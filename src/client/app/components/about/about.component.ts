import { Injector, Component } from '@angular/core';
import { Config } from '../../modules/core/index';
import { Store } from '@ngrx/store';
import { IAppState } from '../../modules/ngrx/index';

@Component({
  moduleId: module.id,
  selector: 'sd-about',
  templateUrl: 'about.component.html',
  styleUrls: [
    'about.component.css',
  ],
})
export class AboutComponent {

  private pdfFile: string;
  private docs_repo: string;
  private imgs_repo: string;
  pn_img = "logo_province_nord.jpg";
  vfd_img = "logo_vfd.jpg";
  ird_img = "logo_ird.png";
  sfa_img = "logo_sfa.png";
  siteEntropie = "http://umr-entropie.ird.nc";
  mailLeopold = "marc.leopold@ird.fr";

  constructor(private injector: Injector, private store: Store<IAppState>) {
    this.store.take(1).subscribe((s: any) => {
      this.docs_repo = "../../../assets/files/";
      this.imgs_repo = "../../../assets/img/";

      switch (s.i18n.lang) {
        case "fr": {
          this.pdfFile="BDMer2.0_Guide_de_l_utilisateur_Juin_2014.pdf";
          break;
        }
        case "en":
        default:
           this.pdfFile="BDMer2.0_Guide_de_l_utilisateur_Juin_2014.pdf";
      }
      
    });
  }

  get logo_pn(){    
    return this.imgs_repo + this.pn_img;
  }

  get logo_vfd(){    
    return this.imgs_repo + this.vfd_img;
  }

  get logo_ird(){    
    return this.imgs_repo + this.ird_img;
  }

  get logo_sfa(){    
    return this.imgs_repo + this.sfa_img;
  }

  get pdfUrl(){    
    return this.docs_repo + this.pdfFile;
  }
}
