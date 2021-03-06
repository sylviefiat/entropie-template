import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs/Subscription';

import { IAppState, getSelectedSite, getAuthUser, getSelectedZone, getSelectedZoneTransects, getSelectedZoneZonePrefs } from '../../modules/ngrx/index';
import { Site, Zone, Transect, ZonePreference } from '../../modules/datas/models/index';
import { User } from '../../modules/countries/models/country';
import { SiteAction } from '../../modules/datas/actions/index';


@Component({
  selector: 'bc-view-zone-page',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <bc-zone 
      [site]="(site$ | async)"
      [zone]="zone$ | async"
      [transects$]="transects$"
      [zonesPref$]="zonesPref$"
      (action)="actionZone($event)"
      (remove)="removeZone($event)">
    </bc-zone>
  `,
})
export class ViewZonePageComponent implements OnInit, OnDestroy {
  siteSubscription: Subscription;
  zoneSubscription: Subscription;
  zone$: Observable<Zone | null>;
  site$: Observable<Site | null>;
  transects$: Observable<Transect[]>;
  zonesPref$: Observable<ZonePreference[]>

  constructor(private store: Store<IAppState>, private route: ActivatedRoute, public routerext: RouterExtensions) {
    this.siteSubscription = route.params
      .map(params => new SiteAction.SelectSiteAction(params.idSite))
      .subscribe(store);
    this.zoneSubscription = route.params
      .map(params => new SiteAction.SelectZoneAction(params.idZone))
      .subscribe(store);
  }

  ngOnInit() {
    this.site$ = this.store.let(getSelectedSite);
    this.zone$ = this.store.let(getSelectedZone);
    this.transects$ = this.store.let(getSelectedZoneTransects);
    this.zonesPref$ = this.store.let(getSelectedZoneZonePrefs);
  }

  ngOnDestroy() {
    this.siteSubscription.unsubscribe();
    this.zoneSubscription.unsubscribe();
  }

  actionZone(redirect: String) {
    this.routerext.navigate([redirect]);
  }

  removeZone(zone: Zone){
    this.store.dispatch(new SiteAction.RemoveZoneAction(zone));
  }
}
