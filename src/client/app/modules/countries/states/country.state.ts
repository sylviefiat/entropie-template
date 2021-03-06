import { Observable } from 'rxjs/Observable';
import { Country, User } from '../models/country';
import { IAppState } from '../../ngrx/index';

export interface ICountryState {
  userIds: string[];
  users: { [id: string]: User };
  currentUserId: string;
  currentCountryId: string;
  error: string | null;
  msg: string | null
}

export const countryInitialState: ICountryState = {
  userIds: null,
  users: {},
  currentUserId: null,
  currentCountryId: null,
  error: null,
  msg: null
};


export function getCountryUsers(state$: Observable<ICountryState>){
  return state$.select(state => state.users);
}

export function getCountryUsersId(state$: Observable<ICountryState>){
  return state$.select(state => state.userIds);
}

export function getCurrentUserId(state$: Observable<ICountryState>){
  return state$.select(state => state.currentUserId);
}

export function getCurrentUser(state$: Observable<IAppState>){
  return state$.select(state => state.country.currentCountryId && state.country.currentUserId &&
    state.countries.entities
      .filter(country => country.code === state.country.currentCountryId)[0].users
      .filter(user => user.username === state.country.currentUserId)[0]);
}

export function getCurrentCountry(state$: Observable<IAppState>){
  return state$.select(state => state.countries.entities.filter(country => country.code === state.country.currentCountryId)[0]);
}

export function getUserError(state$: Observable<ICountryState>){
  return state$.select(state => state.error);
}

export function getUserMsg(state$: Observable<ICountryState>){
  return state$.select(state => state.msg);
}


