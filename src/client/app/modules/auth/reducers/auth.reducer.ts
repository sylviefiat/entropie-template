import { IAuthState, authInitialState } from '../states/index';

import { AuthAction } from '../actions/index';
import { User } from '../../countries/models/country';

export function authReducer(
  state : IAuthState = authInitialState,
  action: AuthAction.Actions
): IAuthState {
  //console.log(action.type);
  switch (action.type) {
    case AuthAction.ActionTypes.LOGIN_SUCCESS: {  
      console.log(action.payload);
      return {
        loggedIn: true,
        role: action.payload.user.role,
        user: action.payload.user,
        country: action.payload.country
      };
    }

    case AuthAction.ActionTypes.LOGOUT: {
      return authInitialState;
    }

    default: {
      return state;
    }
  }
}

