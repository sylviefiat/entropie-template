import { Component, OnInit, Output, Input, ChangeDetectionStrategy, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { RouterExtensions, Config } from '../../modules/core/index';

import { IAppState } from '../../modules/ngrx/index';

import { SiteAction } from '../../modules/datas/actions/index';
import { User } from '../../modules/countries/models/country';
import { Site,Zone, Transect, Count } from '../../modules/datas/models/index';
import { WindowService } from '../../modules/core/services/index';

@Component({
    moduleId: module.id,
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'bc-transect',
    templateUrl: 'view-transect.component.html',
    styleUrls: [
        'view-transect.component.css',
    ],
})
export class ViewTransectComponent implements OnInit {    
    @Input() site: Site;
    @Input() zone: Zone;
    @Input() transect: Transect;
    counts$: Observable<Count[]>;
    @Output() remove = new EventEmitter<any>();
    @Output() edit = new EventEmitter<any>();


    constructor(private store: Store<IAppState>, public routerext: RouterExtensions, private windowService: WindowService) { }


    ngOnInit() {
        this.counts$ = of(this.transect.counts);
    }


    deleteTransect() {
        if (this.windowService.confirm("Are you sure you want to delete this transect from database ?")){
            this.zone.transects = this.zone.transects.filter(transect => transect.code !== this.transect.code);
            this.site.zones = [...this.site.zones.filter(zone => zone.code !== this.zone.code),this.zone];
            this.remove.emit(this.site);
        }
    }

    addCount(type: string) {
        type = type.charAt(0).toUpperCase() + type.slice(1);
        this.routerext.navigate(['/count' + type+'/'+this.transect.code+'/'+this.site.code+'/'+this.zone.code]);
    }

}