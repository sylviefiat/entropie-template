import { Component, Input, OnInit } from '@angular/core';
import { Site,Zone,Campaign, Count, Species } from './../../modules/datas/models/index';

@Component({
  selector: 'bc-count-preview',
  template: `
    <a [routerLink]="['/count', codeSite, codeCampaign, code]">
      <mat-card>
        <mat-card-title-group>
          <img mat-card-sm-image *ngIf="thumbnail" [src]="thumbnail"/>
          <mat-card-title>{{ code }}</mat-card-title>
          <mat-card-subtitle><span *ngIf="codeSite">{{ codeSite }}</span> / <span *ngIf="codeCampaign">{{ codeCampaign }}</span></mat-card-subtitle>
        </mat-card-title-group>
        <mat-card-content>
          {{ 'COUNT_DATE' | translate }} : {{ date | date:localDate }}
        </mat-card-content>
        <mat-card-content *ngIf="count.mesures && count.mesures.length>0">
          <div>{{ 'COUNT_DETAIL' | translate }}
            <span *ngIf="!monospecies">{{ 'MULTISPECIES' | translate }} ({{'TOTAL' | translate}}: {{nMesures}})</span> :            
          </div>
          <div class="mesures" *ngFor="let mesure of count.mesures; let i = index;">
            <div *ngIf="writeSp(i)">
              <hr/>
              <span class="speciesName">
              {{ getSpeciesName(mesure.codeSpecies) }}
              </span>
              ({{'TOTAL' | translate}}: {{getNMesuresSpecies(mesure.codeSpecies)}}):
            </div>
            <li>
              <fa [name]="'arrows-v'" [border]=false [size]=1></fa> {{mesure.long}}mm, <fa [name]="'arrows-h'" [border]=false [size]=1></fa> {{mesure.larg}}mm
            </li>
          </div>
        </mat-card-content>
        <mat-card-content *ngIf="!count.mesures || count.mesures.length<=0">
          <div>{{ 'NO_INVERTEBRATES' | translate }}</div>
        </mat-card-content>
      </mat-card>
    </a>
  `,
  styles: [
    `
    mat-card {
      width: 400px;
      margin: 15px;
    }
    @media only screen and (max-width: 768px) {
      mat-card {
        margin: 15px 0 !important;
      }
    }
    mat-card:hover {
      box-shadow: 3px 3px 16px -2px rgba(0, 0, 0, .5);
    }
    mat-card-title {
      margin-right: 10px;
      max-length: 70%;
      word-break: break-all;
    }
    mat-card-title-group {
      margin: 0;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    img {
      width: auto !important;
      margin-left: 5px;
    }
    mat-card-content {
      margin-top: 15px;
      margin: 15px 0 0;
    }
    mat-list-item {
      max-height:20px !important;
    }
    .speciesName {
      font-style: italic;
    }
    .mesures {
      padding-top: 5px;
      margin-left: 15px;
    }
    hr {
      border-color: #fff;
    }
  `,
  ],
})
export class CountPreviewComponent implements OnInit {  
  @Input() count: Count;
  @Input() campaign: Campaign;
  @Input() site: Site;
  @Input() locale: string;
  @Input() species: Species[];

  ngOnInit(){
    this.count.mesures=this.count.mesures.sort((left,right) => (left.codeSpecies < right.codeSpecies)?-1:((left.codeSpecies > right.codeSpecies)?1:0));
  }

  getSpeciesName(code: string) {
    return this.species.filter(species => species.code === code)[0]?this.species.filter(species => species.code === code)[0].scientificName:code;
  }

  writeSp(index: number) {
    return (index===0) || this.count.mesures[index].codeSpecies!==this.count.mesures[index-1].codeSpecies;
  }

  get id() {
    return this.count.code;
  }

  get code() {
    return this.count.code;
  }

  get codeSite() {
    return this.site.code;
  }

  get codeCampaign() {
    return this.campaign.code;
  }

  get date() {
    return this.count.date;
  }

  get monospecies() {
    return this.count.monospecies;
  }  

  get mesures() {
    return this.count.mesures;
  }

  get nMesures(){
    return this.count.mesures && this.count.mesures.length;
  }

  getNMesuresSpecies(codeSpecies:string){
    let mesSp = this.count.mesures && this.count.mesures.filter(count => count.codeSpecies === codeSpecies);
    return mesSp && mesSp.length;
  }

  get thumbnail(): string | boolean {
    // WAIT FOR MAP
    return null;
    //return "/assets/img/"+this.count.code+".jpg"; 
  }

  get localDate(){
        switch (this.locale) {
          case "fr":
            return 'dd-MM-yyyy';
          case "en":
          default:
            return 'MM-dd-yyyy';
        }
      }
}
