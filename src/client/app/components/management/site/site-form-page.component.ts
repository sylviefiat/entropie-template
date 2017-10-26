import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { RouterExtensions, Config } from '../../../modules/core/index';
import { Site } from '../../../modules/datas/models/index';
import { Country } from '../../../modules/countries/models/country';

import { IAppState, getSitePageError, getSelectedSite, getSelectedCountry } from '../../../modules/ngrx/index';
import { SiteAction } from '../../../modules/datas/actions/index';
import { CountriesAction } from '../../../modules/countries/actions/index';

@Component({
    selector: 'bc-site-page',
    template: `    
    <bc-site-form
      (submitted)="onSubmit($event)"
      [errorMessage]="error$ | async"
      [site]="site$ | async"
      [country]="country$ | async">
    </bc-site-form>
  `,
})
export class SiteFormPageComponent implements OnInit, OnDestroy {
    error$: Observable<string | null>;
    site$: Observable<Site | null>;
    country$: Observable<Country | null>;
    actionsSubscription: Subscription;

    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, route: ActivatedRoute) {
        this.actionsSubscription = route.params
            .map(params => new SiteAction.SelectAction(params.id))
            .subscribe(store);

    }

    ngOnInit() {
        this.error$ = this.store.let(getSitePageError);
        this.site$ = this.store.let(getSelectedSite);
        this.country$ = this.store.let(getSelectedCountry);
    }

    ngOnDestroy() {
        this.actionsSubscription.unsubscribe();
    }

    onSubmit(site: Site) {
        console.log(site);
        this.store.dispatch(new SiteAction.AddSiteAction(site));
    }
}