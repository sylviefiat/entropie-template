// libs
import { Observable } from 'rxjs/Observable';
// import { combineLatest } from 'rxjs/observable/combineLatest';
import { ActionReducer } from '@ngrx/store';
import '@ngrx/core/add/operator/select';

/**
 * The compose function is one of our most handy tools. In basic terms, you give
 * it any number of functions and it returns a function. This new function
 * takes a value and chains it through every composed function, returning
 * the output.
 *
 * More: https://drboolean.gitbooks.io/mostly-adequate-guide/content/ch5.html
 */
import { compose } from '@ngrx/core/compose';

/**
 * storeFreeze prevents state from being mutated. When mutation occurs, an
 * exception will be thrown. This is useful during development mode to
 * ensure that none of the reducers accidentally mutates the state.
 */
import { storeFreeze } from 'ngrx-store-freeze';

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that stores the gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import { combineReducers } from '@ngrx/store';

/**
 * Every reducer module's default export is the reducer function itself. In
 * addition, each module should export a type or interface that describes
 * the state of the reducer plus any selector functions. The `* as`
 * notation packages up all of the exports into a single object.
 */
import { IMultilingualState, multilingualReducer, getLang } from '../i18n/index';
import { IMainState, reducer, getNames} from '../main/index';
import { IAuthState, ILoginPageState, authReducer, loginPageReducer, getLoggedIn, getPending, getError, getRole, getUser, getCountry, getURL, getSessionLoaded, getRoleIsAdmin} from '../auth/index';
import { ICountriesState, countriesReducer, getCountriesLoaded, getCountriesLoading, getCountriesEntities, getAllCountriesEntities, getCountriesIds, getCountryNamesList} from '../countries/index';
import { ICountryState, countryReducer, getCountryUsers, getCountryUsersId, getCurrentUserId, getCurrentUser, getCountryError, getCurrentCountry, getUserMsg, getUserError} from '../countries/index';
import { ISpeciesState, speciesReducer, getSpeciesLoaded, getSpeciesLoading, getSpeciesEntities, getSpeciesIds, getSpeciesError, getSpeciesMsg, getCurrentSpecies } from '../datas/index';
import { IPlatformState, platformReducer, getPlatformLoaded, getPlatformLoading, getPlatformEntities, getPlatformIds, getPlatformError, getPlatformImportErrors, getPlatformImportMsg, getPlatformMsg, getPlatformOfCurrentCountry, getPlatformsOfCurrentCountry, getSurveysOfCurrentCountry} from '../datas/index';
import { getCurrentPlatform, getCurrentPlatformZones, getCurrentPlatformSurveys, getCurrentZone, getCurrentZoneTransects, 
    getCurrentZoneZonePrefs, getCurrentTransect, getCurrentCount, getCurrentSpPref, getCurrentSurvey, getCurrentSurveyCounts } from '../datas/index';
import { IAnalyseState, analyseReducer, getUsedCountry, getUsedSurveys, getUsedZones, getUsedTransects, getUsedSpecies, 
    getMethods, getUsedMethod, getAnalysing, getAnalysed, getResult, getMsg, getZonesAvailables, getTransectsAvailables } from '../analyse/index'

/**
 * As mentioned, we treat each reducer like a table in a database. This means
 * our top level state interface is just a map of keys to inner state types.
 */
export interface IAppState {
  i18n: IMultilingualState;
  main: IMainState;
  auth: IAuthState;
  loginpage: ILoginPageState;
  countries: ICountriesState;
  country: ICountryState;
  species: ISpeciesState;
  platform: IPlatformState;
  analyse: IAnalyseState;
}

/**
 * Because metareducers take a reducer function and return a new reducer,
 * we can use our compose helper to chain them together. Here we are
 * using combineReducers to make our top level reducer, and then
 * wrapping that in storeLogger. Remember that compose applies
 * the result from right to left.
 */
const reducers = {
  i18n: multilingualReducer,
  main: reducer,
  auth: authReducer,
  loginpage: loginPageReducer,
  countries: countriesReducer,
  country: countryReducer,
  species: speciesReducer,
  platform: platformReducer,
  analyse: analyseReducer
};

// ensure state is frozen as extra level of security when developing
// helps maintain immutability
//const developmentReducer: ActionReducer<IAppState> = compose(storeFreeze, combineReducers)(reducers);
const developmentReducer: ActionReducer<IAppState> = combineReducers(reducers);
// for production, dev has already been cleared so no need
const productionReducer: ActionReducer<IAppState> = combineReducers(reducers);

export function AppReducer(state: any, action: any) {
  if (String('<%= BUILD_TYPE %>') === 'dev') {
    return developmentReducer(state, action);
  } else {
    return productionReducer(state, action);
  }
}

export function getMultilingualState(state$: Observable<IAppState>): Observable<IMultilingualState> {
  return state$.select(s => s.i18n);
}
export function getNameListState(state$: Observable<IAppState>): Observable<IMainState> {
  return state$.select(s => s.main);
}
export function getAuthState(state$: Observable<IAppState>): Observable<IAuthState> {
  return state$.select(s => s.auth);
}
export function getLoginPageState(state$: Observable<IAppState>): Observable<ILoginPageState> {
  return state$.select(s => s.loginpage);
}
export function getCountriesState(state$: Observable<IAppState>): Observable<ICountriesState> {
  return state$.select(s => s.countries);
}
export function getCountryState(state$: Observable<IAppState>): Observable<ICountryState> {
  return state$.select(s => s.country);
}
export function getSpeciesState(state$: Observable<IAppState>): Observable<ISpeciesState> {
  return state$.select(s => s.species);
}
export function getPlatformState(state$: Observable<IAppState>): Observable<IPlatformState> {
  return state$.select(s => s.platform);
}
export function getAnalyseState(state$: Observable<IAppState>): Observable<IAnalyseState> {
  return state$.select(s => s.analyse);
}
export function getAppState(state$: Observable<IAppState>): Observable<IAppState> {
  return state$.select(s => s);
}

// i18n
export const getLangues: any = compose(getLang, getMultilingualState);
export const getListNames: any = compose(getNames, getNameListState);

// Auth
export const getisLoggedIn: any = compose(getLoggedIn, getAuthState);
export const getLatestURL: any = compose(getURL, getAuthState);
export const getAuthUser: any = compose(getUser, getAuthState);
export const getRoleUser: any = compose(getRole, getAuthState);
export const getisAdmin: any = compose(getRoleIsAdmin, getAuthState);
export const getAuthCountry: any = compose(getCountry, getAuthState);
export const getisSessionLoaded: any = compose(getSessionLoaded, getAuthState);

// Login page
export const getLoginPagePending: any = compose(getPending, getLoginPageState);
export const getLoginPageError: any = compose(getError, getLoginPageState);
export const getSignupPagePending: any = compose(getPending, getLoginPageState);
export const getSignupPageError: any = compose(getError, getLoginPageState);

// Countries
export const getCountryList: any = compose(getCountryNamesList, getCountriesState);
export const getCountriesisLoaded: any = compose(getCountriesLoaded, getCountriesState);
export const getCountriesisLoading: any = compose(getCountriesLoading, getCountriesState);
export const getCountriesInApp: any = compose(getCountriesEntities, getCountriesState);
export const getAllCountriesInApp: any = compose(getAllCountriesEntities, getCountriesState);
export const getCountriesIdsInApp: any = compose(getCountriesIds, getCountriesState);
export const getCountryPageError: any = compose(getCountryError, getCountriesState);

// Country
export const getSelectedCountry: any = compose(getCurrentCountry, getAppState); 
export const getUsersCountry: any = compose(getCountryUsers, getCountryState);
export const getSelectedUser: any = compose(getCurrentUser, getAppState);
export const getUserMessage: any = compose(getUserMsg, getCountryState);
export const getUserErr : any = compose(getUserError,getCountryState);

// Species
export const getSpeciesisLoaded: any = compose(getSpeciesLoaded, getSpeciesState);
export const getSpeciesisLoading: any = compose(getSpeciesLoading, getSpeciesState);
export const getSpeciesInApp: any = compose(getSpeciesEntities, getSpeciesState);
export const getSpeciesIdsInApp: any = compose(getSpeciesIds, getSpeciesState);
export const getSpeciesPageError: any = compose(getSpeciesError, getSpeciesState);
export const getSpeciesPageMsg: any = compose(getSpeciesMsg, getSpeciesState);
export const getSelectedSpecies: any = compose(getCurrentSpecies, getSpeciesState);

// Platform
export const getPlatformisLoaded: any = compose(getPlatformLoaded, getPlatformState);
export const getPlatformisLoading: any = compose(getPlatformLoading, getPlatformState);
export const getPlatformInApp: any = compose(getPlatformEntities, getPlatformState);
export const getPlatformIdsInApp: any = compose(getPlatformIds, getPlatformState);
export const getPlatformPageError: any = compose(getPlatformError, getPlatformState);
export const getPlatformImpErrors: any = compose(getPlatformImportErrors, getPlatformState);
export const getPlatformImpMsg: any = compose(getPlatformImportMsg, getPlatformState);
export const getPlatformPageMsg: any = compose(getPlatformMsg, getPlatformState);
export const getSelectedPlatform: any = compose(getCurrentPlatform, getPlatformState);
export const getSelectedPlatformZones: any = compose(getCurrentPlatformZones, getPlatformState);
export const getSelectedPlatformSurveys: any = compose(getCurrentPlatformSurveys, getPlatformState);
export const getSelectedZone: any = compose(getCurrentZone, getPlatformState);
export const getSelectedZoneTransects: any = compose(getCurrentZoneTransects, getPlatformState);
export const getSelectedZoneZonePrefs: any = compose(getCurrentZoneZonePrefs, getPlatformState);
export const getSelectedZonePref: any = compose(getCurrentSpPref, getPlatformState);
export const getSelectedTransect: any = compose(getCurrentTransect, getPlatformState);
export const getSelectedSurvey: any = compose(getCurrentSurvey, getPlatformState);
export const getSelectedSurveyCounts: any = compose(getCurrentSurveyCounts, getPlatformState);
export const getSelectedCount: any = compose(getCurrentCount, getPlatformState);
export const getPlatformListCurrentCountry: any = compose(getPlatformOfCurrentCountry, getAppState);
export const getSelectedCountryPlatforms: any = compose(getPlatformsOfCurrentCountry, getAppState);
export const getSelectedCountrySurveys: any = compose(getSurveysOfCurrentCountry, getAppState);

// Analyse
export const getAnalyseCountry: any = compose(getUsedCountry, getAnalyseState);
export const getAnalyseSurveys: any = compose(getUsedSurveys, getAnalyseState);
export const getAnalyseZones: any = compose(getUsedZones, getAnalyseState);
export const getTransectZones: any = compose(getUsedTransects, getAnalyseState);
export const getAnalyseSpecies: any = compose(getUsedSpecies, getAnalyseState);
export const getAnalyseAvailableMethods: any = compose(getMethods, getAnalyseState);
export const getAnalyseMethod: any = compose(getUsedMethod, getAnalyseState);
export const isAnalysing: any = compose(getAnalysing, getAnalyseState);
export const isAnalysed: any = compose(getAnalysed, getAnalyseState);
export const getAnalyseResult: any = compose(getResult, getAnalyseState);
export const getAnalyseMsg: any = compose(getMsg, getAnalyseState);
export const getSelectedSurveysZones: any = compose(getZonesAvailables, getAppState);
export const getSelectedSurveysTransects: any = compose(getTransectsAvailables, getAppState);