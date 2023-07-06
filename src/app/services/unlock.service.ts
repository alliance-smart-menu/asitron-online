import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
})

export class UnlockService {

    constructor(private http: HttpClient) { }

    get(): Observable<any> {
        return this.http.get<any>(`${environment.apiURL}/api/web/unlock`)
    }

    post(data: any): Observable<any> {
        return this.http.post<any>(`${environment.apiURL}/api/web/unlock`, data)
    }

    patch(data: any, _id: string): Observable<any> {
        return this.http.patch<any>(`${environment.apiURL}/api/web/unlock/${_id}`, data)
    }

}