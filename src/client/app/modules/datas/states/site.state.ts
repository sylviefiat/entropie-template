import { Observable } from 'rxjs/Observable';
import { Site, Campaign } from '../models/index';
import { IAppState } from '../../ngrx/index';

export interface ISiteState {
    loaded: boolean;
    loading: boolean;
    currentSiteId: string;
    currentZoneId: string;
    currentTransectId: string;
    currentSpPrefId: string;
    currentCountId: string;
    currentCampaignId: string;
    entities: Site[];
    ids: string[];
    error: string | null;
    msg: string | null;
}

export const siteInitialState: ISiteState = {
    loaded: false,
    loading: false,
    currentSiteId: null,
    currentZoneId: null,
    currentTransectId: null,
    currentSpPrefId: null,
    currentCountId: null,
    currentCampaignId: null,
    entities: [],
    ids: [],
    error: null,
    msg: null
};

export function getSiteLoaded(state$: Observable<ISiteState>) {
    return state$.select(state => state.loaded);
}

export function getSiteLoading(state$: Observable<ISiteState>) {
    return state$.select(state => state.loading);
}

export function getSiteEntities(state$: Observable<ISiteState>) {
    return state$.select(state => state.entities);
}

export function getSiteOfCurrentCountry(state$: Observable<IAppState>) {
    return state$.select(state => {
        if(state.auth.country.code==='AA')
            return state.site.entities;
        return state.site.entities.filter(site => site.codeCountry === state.auth.country.code)
    });
}

export function getCampaignsOfCurrentCountry(state$: Observable<IAppState>) {
    return state$
        .select(state => state.country.currentCountryId && state.site.entities.filter(site => site.codeCountry === state.country.currentCountryId))
        .filter(sites => sites && sites.length>0)
        .map(sites => {
            let campaigns: Campaign[] = [];
            for(let site of sites) 
                campaigns=[...campaigns,...site.campaigns];
            return campaigns;
        });
}

export function getSiteIds(state$: Observable<ISiteState>) {
    return state$.select(state => state.ids);
}

export function getSiteError(state$: Observable<ISiteState>) {
    return state$.select(state => state.error);
}

export function getSiteMsg(state$: Observable<ISiteState>) {
    return state$.select(state => state.msg);
}

export function getCurrentSiteId(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId);
}

export function getCurrentSite(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId && state.entities.filter(site => site._id === state.currentSiteId)[0]);
}

export function getCurrentSiteZones(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId && state.entities.filter(site => site._id === state.currentSiteId)[0].zones);
}

export function getCurrentSiteCampaigns(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId && state.entities.filter(site => site._id === state.currentSiteId)[0].campaigns);
}

export function getCurrentZoneId(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentZoneId);
}

export function getCurrentZone(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId && state.currentZoneId &&
        state.entities.filter(site =>
            site._id === state.currentSiteId)[0].zones.filter(zone =>
                zone.code === state.currentZoneId)[0]);
}

export function getCurrentZoneTransects(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId && state.currentZoneId &&
        state.entities.filter(site =>
            site._id === state.currentSiteId)[0].zones.filter(zone =>
                zone.code === state.currentZoneId)[0].transects);
}

export function getCurrentZoneZonePrefs(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId && state.currentZoneId &&
        state.entities.filter(site =>
            site._id === state.currentSiteId)[0].zones.filter(zone =>
                zone.code === state.currentZoneId)[0].zonePreferences);
}

export function getCurrentCampaignId(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentCampaignId);
}

export function getCurrentCampaign(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId && state.currentCampaignId &&
        state.entities.filter(site => site._id === state.currentSiteId)[0]
            .campaigns.filter(campaign => campaign.code === state.currentCampaignId)[0]);
}

export function getCurrentCampaignCounts(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId && state.currentCampaignId &&
        state.entities.filter(site => site._id === state.currentSiteId)[0]
            .campaigns.filter(campaign => campaign.code === state.currentCampaignId)[0].counts);
}

export function getCurrentTransectId(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentTransectId);
}

export function getCurrentTransect(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId && state.currentZoneId && state.currentTransectId &&
        state.entities.filter(site =>
            site._id === state.currentSiteId)[0].zones.filter(zone =>
                zone.code === state.currentZoneId)[0].transects.filter(transect =>
                    transect.code === state.currentTransectId)[0]);
}

export function getCurrentSpPrefId(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSpPrefId);
}

export function getCurrentSpPref(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentSiteId && state.currentZoneId && state.currentSpPrefId &&
        state.entities.filter(site =>
            site._id === state.currentSiteId)[0].zones.filter(zone =>
                zone.code === state.currentZoneId)[0].zonePreferences.filter(sppref =>
                    sppref.code === state.currentSpPrefId)[0]);
}

export function getCurrentCountId(state$: Observable<ISiteState>) {
    return state$.select(state => state.currentCountId);
}

export function getCurrentCount(state$: Observable<ISiteState>) {
    return state$.select(state => 
        state.currentSiteId &&  state.currentCampaignId && state.currentCountId &&
            state.entities.filter(site => site._id === state.currentSiteId)[0]
                .campaigns.filter(campaign => campaign.code === state.currentCampaignId)[0]
                .counts.filter(count => count.code === state.currentCountId)[0]
    );
}