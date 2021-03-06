import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { RouterExtensions, Config } from '../../modules/core/index';

import { Authenticate } from '../../modules/auth/models/user';
import { IAppState, getLoginPagePending, getLoginPageError } from '../../modules/ngrx/index';
import { AuthAction } from '../../modules/auth/actions/index';

@Component({
  selector: 'bc-login-page',
  template: `
    <bc-login-form
      (submitted)="onSubmit($event)"
      [pending]="pending$ | async"
      [errorMessage]="error$ | async">
    </bc-login-form>
  `,
})
export class LoginPageComponent implements OnInit {
  pending$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store<IAppState>, public routerext: RouterExtensions) {}

  ngOnInit() {
    this.pending$ = this.store.let(getLoginPagePending);
    this.error$ = this.store.let(getLoginPageError);    
  }

  onSubmit(auth: Authenticate) {
    this.store.dispatch(new AuthAction.Login(auth));
  }
}