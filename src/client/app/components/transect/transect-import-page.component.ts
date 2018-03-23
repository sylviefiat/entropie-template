import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../modules/core/index';
import { Platform, Zone } from '../../modules/datas/models/index';

import { IAppState, getPlatformPageError, getSelectedPlatform, getPlatformPageMsg, getSelectedZone } from '../../modules/ngrx/index';
import { PlatformAction } from '../../modules/datas/actions/index';
import { CountriesAction } from '../../modules/countries/actions/index';

@Component({
    selector: 'bc-transect-import-page',
    template: `
    <bc-transect-import
      (upload)="handleUpload($event)"
      (err)="handleErrorUpload($event)"
      (back)="return($event)"
      [error]="error$ | async"
      [msg]="msg$ | async"
      [platform]="platform$ | async">
    </bc-transect-import>
  `,
    styles: [``]
})
export class TransectImportPageComponent implements OnInit, OnDestroy {
    platform$: Observable<Platform>;
    error$: Observable<string | null>;
    msg$: Observable<string | null>;


    platformSubscription: Subscription;
    needHelp: boolean = false;
    private csvFile: string;
    private docs_repo: string;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
        this.platformSubscription = route.params
            .map(params => new PlatformAction.SelectPlatformAction(params.idPlatform))
            .subscribe(store);
    }

    ngOnInit() {
        this.error$ = this.store.let(getPlatformPageError);
        this.msg$ = this.store.let(getPlatformPageMsg);
        this.platform$ = this.store.let(getSelectedPlatform);
    }

    ngOnDestroy() {
        this.platformSubscription.unsubscribe();
    }

    handleUpload(csvFile: any): void {
        console.log(csvFile);
        this.store.dispatch(new PlatformAction.ImportTransectAction(csvFile));
    }

    handleErrorUpload(msg: string) {
        this.store.dispatch(new PlatformAction.AddPlatformFailAction(msg));
    }

    return(event) {
        this.routerext.navigate(['/platform/'], {
            transition: {
                duration: 1000,
                name: 'slideTop',
            }
        });
    }
}