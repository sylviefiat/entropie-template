import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform, Zone } from '../../modules/datas/models/index';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getLangues } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-station-import',
    templateUrl: './station-import.component.html',
    styleUrls: [
        './station-import.component.css',
    ],
})
export class StationImportComponent implements OnDestroy {
    @Input() platform: Platform;
    @Input() error: string | null;
    @Input() msg: string | null;
    @Output() upload = new EventEmitter<any>();
    @Output() err = new EventEmitter<string>();
    @Output() back = new EventEmitter();
    actionSubscription: Subscription;

    needHelp: boolean = false;
    private csvFile: string;
    private docs_repo: string;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
        this.actionSubscription = this.store.select(getLangues).subscribe((l: any) => {
            this.docs_repo = "../../../assets/files/";
            this.csvFile = "importStation-"+l+".csv";
        });
    }

    ngOnDestroy() {
        this.actionSubscription.unsubscribe();
    }

    handleUpload(csvFile: any): void {
        console.log(csvFile);
        let reader = new FileReader();
        if (csvFile.target.files && csvFile.target.files.length > 0) {
            this.upload.emit(csvFile.target.files[0]);
        } else {
            this.err.emit('No csv file found');
        }
    }

    changeNeedHelp() {
        this.needHelp = !this.needHelp;
    }

    getCsvStations() {
        return this.csvFile;
    }

    getCsvStationsUrl() {
        return this.docs_repo + this.csvFile;
    }

    cancel() {
        this.back.emit();
    }
}