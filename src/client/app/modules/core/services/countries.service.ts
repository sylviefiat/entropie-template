import { Injectable, Output, EventEmitter } from '@angular/core';
import { Http, Headers, Response, URLSearchParams, RequestOptions, ResponseContentType } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';


import * as PouchDB from "pouchdb";
import { User, Country, Flagimg } from '../../countries/models/country';
import { ResponsePDB } from '../models/pouchdb';
import { Authenticate } from '../../auth/models/user';

@Injectable()
export class CountriesService {
  public currentCountry: Observable<Country>;
  public currentUser: Observable<User>;
  public adminUser = { _id: 'admin', name: 'admin', surname: null, username: 'admin', email: null, countryCode: 'AA', password: null };
  public adminCountry: Country = { _id: 'AA', code: 'AA', name: 'Administrators', flag: null, users: null };

  private db: any;

  constructor(private http: Http) {
  }

  initDB(dbname: string, remote: string): Observable<any> {
    this.db = new PouchDB(dbname);
    this.sync(remote + dbname);

    return this.insertCountry(this.adminCountry)
      .mergeMap(country => this.addUser(this.adminUser));
  }

  public getAll(): Observable<any> {
    return fromPromise(
      this.db.allDocs({ include_docs: true })
        .then(docs => {
          return docs.rows.map(row => {
            return row.doc;
          });
        }));
  }

  getCountry(countrycode: string): Observable<Country> {
    return fromPromise(this.db.query(function(doc, emit) {
      emit(doc.code);
    }, { key: countrycode, include_docs: true }).then(function(result) {
      return result.rows && result.rows[0] && result.rows[0].doc;
    }).catch(function(err) {
      console.log(err);
    }));
  }

  insertCountry(country: Country): Observable<Country> {
    this.currentCountry = of(country);
    return this.getCountry(country.code)
      .filter((response) => !response)
      .mergeMap(response => {
        return fromPromise(this.db.put(country))
      })
      .filter((response: ResponsePDB) => { console.log(response); return response.ok; })
      .mergeMap(response => {
        return this.currentCountry;
      })
  }

  addCountry(countryJson: any): Observable<Country> {
    let country = countryJson.pays;
    let url = '../node_modules/svg-country-flags/svg/' + country.code.toLowerCase() + '.svg';
    let headers = new Headers({ 'Content-Type': 'image/svg+xml' });
    let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });

    return this.http
      .get(url, {
        headers: headers,
        responseType: ResponseContentType.Blob
      })
      .map(res =>
        res.blob())
      .mergeMap(blob => {
        let fullCountry = { _id: country.code, code: country.code, name: country.name, flag: { _id: country.code + '_flag', _attachments: { flag: { type: blob.type, data: blob } } }, users: null }
        this.currentCountry = of(fullCountry);
        return fromPromise(this.db.put(fullCountry))
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return this.currentCountry;
      })
  }

  removeCountry(country: Country): Observable<Country> {
    this.currentCountry = of(country);
    return of(country)
      .mergeMap(country =>
        fromPromise(this.db.remove(country)))
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap(response => {
        return this.currentCountry;
      })
  }

  getUser(username: string): Observable<User> {
    return fromPromise(this.db.query(function(doc, emit) {
      doc.users && doc.users.forEach(function(user) {
        emit(user.username);
      });
    }, { key: username, include_docs: true }).then(function(result) {
      console.log(result);
      return result.rows && result.rows[0] && result.rows[0].doc && result.rows[0].doc.users &&
        result.rows[0].doc.users.filter(user => user.username === username) && result.rows[0].doc.users.filter(user => user.username === username)[0];
    }).catch(function(err) {
      console.log(err);
    }));
  }

  getCountryUser(username: string): Observable<Country> {
    return fromPromise(this.db.query(function(doc, emit) {
      doc.users && doc.users.forEach(function(user) {
        emit(user.username);
      });
    }, { key: username, include_docs: true }).then(function(result) {
      console.log(result);
      return result.rows && result.rows[0] && result.rows[0].doc;
    }).catch(function(err) {
      console.log(err);
    }));
  }

  addUser(user: User): Observable<Country> {
    console.log(user);
    delete user.password;
    console.log(user);
    return this.getCountry(user.countryCode)
      .mergeMap(country => {
        this.currentCountry = of(country);
        if (country.users === null) {
          country.users = [];
        }
        country.users[country.users.length] = user;

        return fromPromise(this.db.put(country));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return this.currentCountry;
      })
  }

  removeUser(user: User): Observable<Country> {
    return this.getCountry(user.countryCode)
      .mergeMap(country => {
        this.currentCountry = of(country);
        country.users = country.users.filter(users => { return users.username !== user.username; });
        return fromPromise(this.db.put(country));
      })
      .filter((response: ResponsePDB) => { return response.ok; })
      .mergeMap((response) => {
        return this.currentCountry;
      })
  }

  userMapFunction(doc, emit) {
    doc.users.forEach(function(user) {
      emit(user.username);
    });
  }

  countryNameMapFunction(doc, emit) {
    emit(doc.name);
  }

  countryCodeMapFunction(doc, emit) {
    emit(doc.code);
  }

  public sync(remote: string): Promise<any> {
    let remoteDatabase = new PouchDB(remote);
    return this.db.sync(remoteDatabase, {
      live: true,
      retry: true
    }).on('error', error => {
      console.error(JSON.stringify(error));
    });
  }
}