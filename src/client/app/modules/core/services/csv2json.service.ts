import { Injectable } from '@angular/core';
import { PapaParseService } from 'ngx-papaparse';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Store } from '@ngrx/store';

import { MomentService } from './moment.service';
import { MapStaticService} from './map-static.service';
import { Species, NameI18N, CoefsAB, Conversion, BiologicDimensions, LegalDimensions } from '../../datas/models/species';
import { Platform, Zone, Transect, Survey, ZonePreference, Count, Mesure } from '../../datas/models/platform';
import { PlatformAction } from '../../datas/actions/index';
import { IAppState, getSpeciesInApp } from '../../ngrx/index';

@Injectable()
export class Csv2JsonService {
    static COMMA = ',';
    static SEMICOLON = ';';
    authCountry$: Observable<string[]>;

    constructor(private store: Store<IAppState>, private mapStaticService: MapStaticService, private papa: PapaParseService, private ms: MomentService) {
    }

    private extractSpeciesData(arrayData): Species[] { // Input csv data to the function
        let allTextLines = arrayData.data;
        let headers = allTextLines[0];
        let lines: Species[] = [];
        // don't iclude header start from 1
        for (let i = 1; i < allTextLines.length; i++) {
            // split content based on comma
            let data = allTextLines[i];
            if (data.length == headers.length) {
                let sp = {} as Species;
                let header, name = {} as NameI18N, value, parts, legaldim = {} as LegalDimensions;
                for (let j = 0; j < headers.length; j++) {
                    switch (headers[j]) {
                        case "code":
                        case "distribution":
                        case "scientific_name":
                        case "habitat_preference":
                            header = headers[j].replace(/_([a-z])/g, function(g) { return g[1].toUpperCase(); });
                            sp[header] = data[j];
                            break;
                        case "sp_name":
                        case "sp_nom":
                            name = { lang: (headers[j].indexOf('name') != -1) ? "EN" : "FR", name: data[j] };
                            if (sp.names == null) sp.names = [];
                            sp.names.push(name);
                            break;
                        case "LLW_coef_a":
                        case "LLW_coef_b":
                        case "LW_coef_a":
                        case "LW_coef_b":
                            parts = headers[j].split('_');
                            header = parts[0];
                            value = parts[1] + parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
                            if (sp[header] == null) sp[header] = {} as CoefsAB;
                            sp[header][value] = data[j];
                            break;
                        case "conversion_salt":
                        case "conversion_BDM":
                            parts = headers[j].split('_');
                            header = parts[0] + 's';
                            value = parts[1];
                            if (sp[header] == null) sp[header] = {} as Conversion;
                            sp[header][value] = data[j];
                            break;
                        case "long_max":
                        case "larg_max":
                            header = headers[j].replace(/_([a-z])/g, function(g) { return g[1].toUpperCase(); });
                            if (sp.biologicDimensions == null) sp.biologicDimensions = {} as BiologicDimensions;
                            sp.biologicDimensions[header] = data[j];
                            break;
                        case "L_min_NC":
                        case "L_min_VT":
                        case "L_min_PG":
                        case "L_min_SB":
                        case "L_min_FJ":
                        case "L_min_TO":
                        case "L_min_SO":
                            header = headers[j].substring(headers[j].lastIndexOf('_') + 1);
                            legaldim = { codeCountry: header, longMin: data[j], longMax: data[headers.indexOf('L_max_' + header)] };
                            if (sp.legalDimensions == null) sp.legalDimensions = [];
                            sp.legalDimensions.push(legaldim);
                            break;
                        case "L_max_NC":
                        case "L_max_VT":
                        case "L_max_PG":
                        case "L_max_SB":
                        case "L_max_FJ":
                        case "L_max_TO":
                        case "L_max_SO":
                            break;
                        default:
                            throw new Error('Wrong CSV File Unknown field detected');
                    }
                }
                lines.push(sp);
            }
        }
        //console.log(lines); //The data in the form of 2 dimensional array.
        return lines;
    }

    private extractPlatformData(arrayData): Platform[] { 
        let allTextLines = arrayData.data;
        let headers = allTextLines[0];
        let lines: Platform[] = [];
        let errorTab = [];
        for (let i = 1; i < allTextLines.length; i++) {
            let data = allTextLines[i];
            if (data.length == headers.length) {
                let st = {} as Platform;
                let header;
                for (let j = 0; j < headers.length; j++) {
                    switch (headers[j]) {
                        case "code":
                        case "description":
                        case "codeCountry":
                            header = headers[j].replace(/_([a-z])/g, function(g) { return g[1].toUpperCase(); });
                            st[headers[j]] = data[j];
                            break;
                        default:
                            if(!errorTab.includes(headers[j])){
                                errorTab.push(headers[j]);
                            }  
                            break;
                    }
                }
                lines.push(st);
            }
        }

        if(errorTab.length !== 0){
            let string = "";
            for(let i in errorTab){
                if(parseInt(i) === errorTab.length - 1){
                    string+=errorTab[i]+"."    
                }else{
                    string+=errorTab[i]+", ";
                }
            }

            this.store.dispatch(new PlatformAction.AddPlatformFailAction(string))
            return [];
        }

        //console.log(lines); //The data in the form of 2 dimensional array.
        return lines;
    }

    private extractZoneData(arrayData): Zone[] { 
        let allTextLines = arrayData.data;
        let headers = allTextLines[0];
        let lines: Zone[] = [];
        for (let i = 1; i < allTextLines.length; i++) {            
            let data = allTextLines[i];
            if (data.length == headers.length) {
                let st = {} as Zone;
                let header;
                for (let j = 0; j < headers.length; j++) {
                    switch (headers[j]) {
                        case "code":
                        case "code_platform":
                        case "surface":
                            header = headers[j].replace(/_([a-z])/g, function(g) { return g[1].toUpperCase(); });
                            st[headers[j]] = data[j];
                            break;
                        default:                            
                            throw new Error('Wrong CSV File Unknown field detected');
                    }
                }
                lines.push(st);
            }
        }
        //console.log(lines); //The data in the form of 2 dimensional array.
        return lines;
    }

    private extractSurveyData(arrayData): Survey[] { 
        let allTextLines = arrayData.data;
        let delimiter = arrayData.meta.delimiter;
        let headers = allTextLines[0];
        let lines: Survey[] = [];
        let errorTab = [];
        for (let i = 1; i < allTextLines.length; i++) {            
            let data = allTextLines[i];
            if (data.length == headers.length) {
                let st = {} as Survey;
                let header;
                for (let j = 0; j < headers.length; j++) {
                    switch (headers[j]) {
                        case "codeCountry":
                        case "codePlatform":
                        case "codeZone":
                        case "code":
                        case "participants":
                        case "surfaceTransect":
                        case "description":
                            header = headers[j].replace(/_([a-z])/g, function(g) { return g[1].toUpperCase(); });
                            st[headers[j]] = data[j];
                            break;
                        case "dateStart":
                        case "dateEnd":
                            header = headers[j].replace(/_([a-z])/g, function(g) { return g[1].toUpperCase(); });
                            let d;
                            // if it is french format reverse date and month in import date (from dd/MM/yyyy to MM/dd/yyyy)
                            if(delimiter === Csv2JsonService.SEMICOLON){
                                //this.ms.moment().locale("fr");
                                d = this.ms.moment(data[j], "DD/MM/YYYY").toISOString();
                            } else {
                                //this.ms.moment().locale("en");
                                d = this.ms.moment(data[j], "MM/DD/YYYY").toISOString();
                            }                         
                            st[headers[j]] = d;
                            break;
                        default:                            
                            if(!errorTab.includes(headers[j])){
                                errorTab.push(headers[j]);
                            }  
                            break;
                    }
                }
                lines.push(st);
            }
        }

        if(errorTab.length !== 0){
            let string = "";
            for(let i in errorTab){
                if(parseInt(i) === errorTab.length - 1){
                    string+=errorTab[i]+"."    
                }else{
                    string+=errorTab[i]+", ";
                }
            }

            this.store.dispatch(new PlatformAction.AddPlatformFailAction(string))
            return [];
        }

        //console.log(lines); //The data in the form of 2 dimensional array.
        return lines;
    }

    private extractTransectData(arrayData): Transect[] { 
        let allTextLines = arrayData.data;
        let headers = allTextLines[0];
        let lines = [];
        let geojsons = [];
        let errorTab = [];
        for (let i = 1; i < allTextLines.length; i++) {            
            let data = allTextLines[i];
            if (data.length == headers.length) {
                let st = {} as Transect;
                let header;
                for (let j = 0; j < headers.length; j++) {
                    switch (headers[j]) {
                        case "codePlatform":
                        case "codeZone":
                        case "code":
                        case "nom":
                        case "latitude":
                        case "longitude":
                        case "description":
                            header = headers[j].replace(/_([a-z])/g, function(g) { return g[1].toUpperCase(); });
                            st[headers[j]] = data[j];
                            break;
                        default:
                            if(!errorTab.includes(headers[j])){
                                errorTab.push(headers[j]);
                            }  
                            break;
                    }
                }
                lines.push(st);
            }
        }

        if(errorTab.length !== 0){
            let string = "";
            for(let i in errorTab){
                if(parseInt(i) === errorTab.length - 1){
                    string+=errorTab[i]+"."    
                }else{
                    string+=errorTab[i]+", ";
                }
            }

            this.store.dispatch(new PlatformAction.AddPlatformFailAction(string))
            return [];
        }

        for(let i = 0; i < lines.length; i++){
            let geojson = {
                type: "Feature",
                geometry: {
                    type: "Point",
                    coordinates:[Number(lines[i]["longitude"]), Number(lines[i]["latitude"])]
                },
                properties: {
                    name: lines[i]["nom"],
                    code: lines[i]["code"],
                    description: lines[i]["description"]
                },
                staticMapTransect: "",
                codeZone: lines[i]["codeZone"],
                codePlatform: lines[i]["codePlatform"]
            }

            this.mapStaticService.staticMapToB64(this.mapStaticService.googleMapUrlPoint([Number(lines[i]["longitude"]), Number(lines[i]["latitude"])])).then(function(data){
              geojson.staticMapTransect = data.toString();
            })

            geojsons.push(geojson)
        }

        return geojsons;
    }

    private extractZonePrefData(arrayData): ZonePreference[] { 
        let species$: Observable<Species[]> = this.store.let(getSpeciesInApp);
        let allTextLines = arrayData.data;
        let headers = allTextLines[0];
        let lines: ZonePreference[] = [];
        let errorTab = [];
        for (let i = 1; i < allTextLines.length; i++) {            
            let data = allTextLines[i];
            if (data.length == headers.length) {
                let st = {} as ZonePreference;
                let header;
                for (let j = 0; j < headers.length; j++) {
                    switch (headers[j]) {
                        case "codePlatform":
                        case "codeZone":
                        case "code":
                        case "codeSpecies":
                        case "presence":
                        case "infoSource":
                        case "picture":
                            header = headers[j].replace(/_([a-z])/g, function(g) { return g[1].toUpperCase(); });
                            st[headers[j]] = data[j];
                            break;
                        default:
                            if(!errorTab.includes(headers[j])){
                                errorTab.push(headers[j]);
                            }       
                            break;                     
                    }
                }
                species$.subscribe((species) =>{
                    for(let i = 0; i < species.length; i++){
                        if(st.codeSpecies === species[i].code){
                            st.picture = species[i].picture;
                        }
                    }
                })
                lines.push(st);
            }
        }

        if(errorTab.length !== 0){
            let string = "";
            for(let i in errorTab){
                if(parseInt(i) === errorTab.length - 1){
                    string+=errorTab[i]+"."    
                }else{
                    string+=errorTab[i]+", ";
                }
            }

            this.store.dispatch(new PlatformAction.AddPlatformFailAction(string))
            return [];
        }

        //console.log(lines); //The data in the form of 2 dimensional array.
        return lines;
    }

    private extractCountData(arrayData): Count[] { 
        let allTextLines = arrayData.data;
        let delimiter = arrayData.meta.delimiter;
        let headers = allTextLines[0];
        let lines: Count[] = [];
        let errorTab = [];
        for (let i = 1; i < allTextLines.length; i++) {            
            let data = allTextLines[i];
            if (data.length == headers.length) {
                let ct = {} as Count;
                let header;
                for (let j = 0; j < headers.length; j++) {
                    switch (headers[j]) {
                        case "codePlatform":
                        case "codeZone":
                        case "codeSurvey":
                        case "code":
                        case "codeTransect":
                            header = headers[j].replace(/_([a-z])/g, function(g) { return g[1].toUpperCase(); });
                            ct[headers[j]] = data[j];
                            break;
                        case "date":
                            let d;
                            // if it is french format reverse date and month in import date (from dd/MM/yyyy to MM/dd/yyyy)
                            if(delimiter === Csv2JsonService.SEMICOLON){
                                //this.ms.moment().locale("fr");
                                d = this.ms.moment(data[j], "DD/MM/YYYY").toISOString();
                            } else {
                                //this.ms.moment().locale("en");
                                d = this.ms.moment(data[j], "MM/DD/YYYY").toISOString();
                            }                         
                            ct[headers[j]] = d;
                            break;
                        case "mesures":
                            let sp = data[headers.indexOf('codeSpecies')];
                            // if there is no species name (let size of 2 for undesired spaces) break;
                            if(sp.length<2) break;
                            if (ct.mesures == null) ct.mesures = [];
                            let mes = data[j].split(',');
                            for(let dims of mes){
                                let longlarg = dims.split('/');
                                ct.mesures.push({codeSpecies: sp, long: longlarg[0], larg: (longlarg.length>0)?longlarg[1]:'0'});
                            }
                            break;
                        case "codeSpecies":
                            ct['monospecies'] = true;
                            break;
                        default:                            
                            if(!errorTab.includes(headers[j])){
                                errorTab.push(headers[j]);
                            }       
                            break; 
                    }
                }
                lines.push(ct);
            }
        }

        if(errorTab.length !== 0){
            let string = "";
            for(let i in errorTab){
                if(parseInt(i) === errorTab.length - 1){
                    string+=errorTab[i]+"."    
                }else{
                    string+=errorTab[i]+", ";
                }
            }

            this.store.dispatch(new PlatformAction.AddPlatformFailAction(string))
            return [];
        }

        //console.log(lines); //The data in the form of 2 dimensional array.
        return lines;
    }

    csv2(type: string, csvFile: any): Observable<any> {
        return Observable.create(
            observable => {
                this.papa.parse(csvFile, {
                    /*delimiter: function(csvFile){
                        return ",";
                    },*/
                    skipEmptyLines: true,
                    download: true,
                    complete: function(results) {
                        if(!results.data[0].indexOf('code_species'))
                            throw new Error('Wrong CSV File Missing mandatory "code" column');
                        observable.next(results);
                        observable.complete();
                    }
                });
            })
            .mergeMap(data => {
                let res;
                switch (type) {
                    case "species":
                        res = this.extractSpeciesData(data);
                        break;
                    case "platform":
                        res = this.extractPlatformData(data);
                        break;
                    case "zone":
                        res = this.extractZoneData(data);
                        break;
                    case "survey":
                        res = this.extractSurveyData(data);
                        break;
                    case "zonePref":
                        console.log(data);
                        res = this.extractZonePrefData(data);
                        break;
                    case "transect":
                        res = this.extractTransectData(data);
                        break;
                    case "count":
                        res = this.extractCountData(data);
                        break;
                    default:
                        // code...
                        break;
                }
                return res;
            });

    }

}