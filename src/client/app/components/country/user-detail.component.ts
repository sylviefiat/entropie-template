import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { IAppState } from '../../modules/ngrx/index';
import { RouterExtensions, Config } from '../../modules/core/index';
import { ActivatedRoute } from '@angular/router';

import { User } from './../../modules/countries/models/country';
import { CountryAction } from '../../modules/countries/actions/index';

@Component({
  selector: 'bc-user-detail',
  template: `
    <li>
      {{firstname}} {{lastname}} ({{username}})
      <a *ngIf="hasactions" href="mailto:{{email}}">
        <fa [name]="'envelope'" [border]=false [size]=1></fa> {{email}}
      </a>
      <a *ngIf="hasactions" href="javascript:void(0);" (click)="editUser()">
        <fa [name]="'edit'" [border]=false [size]=1></fa>
      </a>
      <a *ngIf="hasactions && isNotAdmin()" href="javascript:void(0);" (click)="removeUserFromCountry()" >
        <fa [name]="'trash'" [border]=false [size]=1></fa>
      </a>
    </li>

  `,
  styles: [
    `
    li {
      list-style:none;
      margin-left:0px;
      padding: 2px;
    }
    li a {
      padding-left: 10px;
      text-decoration: none;
    }
    :host {
      display: flex;
      justify-content: left;
      margin: 15px 0;
    }
  `,
  ],
})
export class UserDetailComponent {
  /**
   * Presentational components receieve data through @Input() and communicate events
   * through @Output() but generally maintain no internal state of their
   * own. All decisions are delegated to 'container', or 'smart'
   * components before data updates flow back down.
   *
   * More on 'smart' and 'presentational' components: https://gist.github.com/btroncone/a6e4347326749f938510#utilizing-container-components
   */
  @Input() user: User;
  @Input() hasactions: boolean;

  constructor(private store: Store<IAppState>, public activatedRoute: ActivatedRoute, public routerext: RouterExtensions){}

  /**
   * Tip: Utilize getters to keep templates clean
   */
 
  get firstname() {
    return this.user.surname;
  }

  get lastname() {
    return this.user.name;
  }

  get username() {
    return this.user.username;
  }

  get email() {
    return this.user.email;
  }

  editUser() {
    this.routerext.navigate(['userForm/'+this.user.username], {
      relativeTo: this.activatedRoute,
      transition: {
        duration: 1000,
        name: 'slideTop',
      }
    });
  }

  removeUserFromCountry() {
    this.store.dispatch(new CountryAction.RemoveUserAction(this.user));
  }

  isNotAdmin() {
    return this.user.username!=='admin';
  }
}
