import { Observable } from 'rxjs/Observable';
import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Survey } from '../../modules/datas/models/index';

@Component({
  selector: 'bc-analyse-survey',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [formGroup]="form"> 
      <h2>{{ 'SELECT_SURVEYS' | translate }}</h2>
      <mat-checkbox (change)="checkAll($event)">
          {{ 'CHECK_ALL' | translate }}
        </mat-checkbox>
      <div  class="surveys">
        <div *ngFor="let survey of surveys$ | async; let i=index; let e=even" [class.even]="e"> 
          <bc-survey  [group]="form.controls.surveys.controls[i]" [survey]="survey" [locale]="locale" (surveyEmitter)="changeValue($event)"></bc-survey>
        </div>
      </div>
    </div>
  `,

  styles: [
    `
    .surveys {
      margin-top:10px;
      margin-bottom:10px;
      padding:5px;
      border: 1px solid grey;
    }
    .even {
      background-color: lightgrey;
    }
    `]
})
export class AnalyseSurveyComponent implements OnInit {
  @Input() surveys$: Observable<Survey[]>;
  @Input() locale: string;
  defaultSurveys: Survey[] = [];
  checkedSurveys: Survey[] = [];
  @Output() surveyEmitter = new EventEmitter<Survey[]>();
  @Input('group') public form: FormGroup;

  constructor(private _fb: FormBuilder) {

  }

  ngOnInit() {
    this.initSurveys();
  }

  newSurvey(s: Survey) {
    return this._fb.group({
      survey: new FormControl(this.checkedSurveys.filter(survey => survey.code === s.code).length > 0)
    });
  }

  initSurveys() {
    this.surveys$
      .filter(surveys => surveys !== null)
      .subscribe(surveys => {
        this.defaultSurveys=[];
        this.form.controls['surveys'] = this._fb.array([]);
        for (let survey of surveys) {
          this.defaultSurveys.push(survey);
          const control = <FormArray>this.form.controls['surveys'];
          control.push(this.newSurvey(survey));
        }
      })
  }

  changeValue(survCheck: any) {
    console.log(survCheck);
    this.checkedSurveys=[...this.checkedSurveys.filter(p => p.code!==survCheck.survey.code)];
    if(survCheck.checked){
      this.checkedSurveys.push(survCheck.survey);
    }
    this.surveyEmitter.emit(this.checkedSurveys);
  }

  checkAll(ev) {
    const control = <FormArray>this.form.controls['surveys'];
    control.value.forEach(x => x.survey = ev.checked)
    control.setValue(control.value);
    this.checkedSurveys=(ev.checked)?this.defaultSurveys:[];
    this.surveyEmitter.emit(this.checkedSurveys);
  }

}
