import { Component, OnInit, AfterContentChecked, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

import { IAppState } from '../../modules/ngrx/index';

import { AnalyseAction } from '../../modules/analyse/actions/index';
import { Country } from '../../modules/countries/models/country';
import { Platform, Zone, Survey, Transect, Species } from '../../modules/datas/models/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-analyse',
    templateUrl: 'analyse.component.html',
    styleUrls: [
        'analyse.component.css',
    ],
})
export class AnalyseComponent implements OnInit, AfterContentChecked {
    @Input() msg: string | null;
    @Input() countries: Country[];
    @Input() platforms: Platform[];
    @Input() surveys: Survey[];
    @Input() zonesList: Zone[][];
    @Input() transectsList: Transect[][];
    @Input() isAdmin: boolean;
    @Input() locale: string;
    @Output() countryEmitter = new EventEmitter<Country>();
    @Output() platformEmitter = new EventEmitter<Platform[]>();
    @Output() surveyEmitter = new EventEmitter<Survey[]>();
    @Output() zoneEmitter = new EventEmitter<Zone[][]>();
    @Output() analyse = new EventEmitter<String>();

    currentPlatforms: Platform[];
    currentSurveys: Survey[];
    currentZones: Zone[][];

    countryFormGroup: FormGroup = new FormGroup({
        country: new FormControl()
    });
    platformsFormGroup: FormGroup = new FormGroup({
        platforms: this._fb.array([])
    });
    yearFormGroup: FormGroup = new FormGroup({
        years: this._fb.array([])
    });
    surveysFormGroup: FormGroup = new FormGroup({
        surveys: this._fb.array([])
    });
    zonesFormGroup: FormGroup = new FormGroup({
        zones: this._fb.array([])
    });
    transectsFormGroup: FormGroup = new FormGroup({
        transects: this._fb.array([])
    });
    speciesFormGroup: FormGroup = new FormGroup({
        species: this._fb.array([])
    });
    analyseFormGroup: FormGroup = new FormGroup({
        analyseType: new FormControl()
    });

    constructor(private store: Store<IAppState>, route: ActivatedRoute, public routerext: RouterExtensions, private _fb: FormBuilder) {

    }

    ngOnInit() {
        //TODO
    }

    ngAfterContentChecked() {
        //TODO
    }

    initPlatforms() {
        this.platformsFormGroup.controls['platforms']=this._fb.array([]);
        const controlP = <FormArray>this.platformsFormGroup.controls['platforms'];
        let addrCtrl;
        for (let i in this.currentPlatforms) {
            addrCtrl =  this.newPlatforms();
            controlP.push(addrCtrl);
        }
    }

    initZones() {
        this.zonesFormGroup.controls['zones']=this._fb.array([]);
        const controlZ = <FormArray>this.zonesFormGroup.controls['zones'];
        let addrCtrl;
        for (let i in this.currentSurveys) {
            addrCtrl =  this.newZones();
            controlZ.push(addrCtrl);
        }
    }

    newPlatforms() {
        return this._fb.group({
            platforms: new FormControl([])
        });
    }

    newZones() {
        return this._fb.group({
            zones: new FormControl([])
        });
    }

    initTransects() {
        this.transectsFormGroup.controls['transects']=this._fb.array([]);
        const controlT = <FormArray>this.transectsFormGroup.controls['transects'];
        let addrCtrl;
        for (let i in this.currentSurveys) {
            addrCtrl=this.newTransects();
            controlT.push(addrCtrl);
        }
    }

    newTransects() {
        return this._fb.group({
            transects: new FormControl([])
        });
    }

    initSpecies() {
        this.speciesFormGroup.controls['species']=this._fb.array([]);
        const controlS = <FormArray>this.speciesFormGroup.controls['species'];
        for (let i in this.currentSurveys) {
            controlS.push(this.newSpecies());
        }
    }

    newSpecies() {
        return this._fb.group({
            species: new FormControl([])
        });
    }

    setCountry(country: Country) {
        this.countryEmitter.emit(country);
        this.surveysFormGroup.controls['platforms'] = this._fb.array([]);
    }

    setPlatforms(platforms: Platform[]) {
        let pname=[];
        for(let c of platforms){
            pname.push(c.code);
        }
        this.platformEmitter.emit(platforms);
        this.platformsFormGroup.controls['platforms'].setValue(pname);
        this.currentPlatforms = platforms;
        //this.initYears();
    }

    setSurveys(surveys: Survey[]) {
        let sname=[];
        for(let c of surveys){
            sname.push(c.code);
        }
        this.surveyEmitter.emit(surveys);
        this.surveysFormGroup.controls['surveys'].setValue(sname);
        this.currentSurveys = surveys;
        this.initZones();
        this.initTransects();
        this.initSpecies();
    }

    setZones(zones: Zone[][]) {
        let zname=[];
        for(let i in zones){
            zname[i]=[];
            for(let z of zones[i])
                zname[i].push(z.code);
        }
        

        this.zoneEmitter.emit(zones);
        this.currentZones = zones;
    }

    get localDate() {
        switch (this.locale) {
            case "fr":
                return 'dd-MM-yyyy';
            case "en":
            default:
                return 'MM-dd-yyyy';
        }
    }

}