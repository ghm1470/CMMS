import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

const headerDict = {
  'Content-Type': 'application/octet-stream',
  'Accept': 'application/blob',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const requestOptions = {
  headers: new HttpHeaders(headerDict),
};


@Injectable({
  providedIn: 'root'
})
export class UploadService {
  public microserviceName = 'MicroserviceDrive';
  public prefixUrl = 'api';
  public entityName = 'upload';

  constructor(private http: HttpClient) {
  }

  post(body: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post(this.microserviceName + '/' + this.prefixUrl + '/' + this.entityName + '/create/public',
      body, {headers}).pipe(map(res => res));
  }

  active(body: any) {
    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.post(this.microserviceName + '/' + this.prefixUrl + '/' + this.entityName + '/active/public',
      body, {headers}).pipe(map(res => res));
  }

  get(id): Observable<Blob> {
    return this.http.get(this.microserviceName + '/' + this.prefixUrl + '/' +
      this.entityName + '/get/public/' + id, {
      responseType: 'blob'
    });
  }

  delete(idList) {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    return this.http.post(this.microserviceName + '/' + this.prefixUrl + '/' +
      this.entityName + '/delete/public', JSON.stringify(idList), {headers: headers}).pipe(map(res => res));
  }
}
