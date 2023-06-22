import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  public language = "md"

  private token: any
  public user: any

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }


  login(data: any): Observable<{ message: any, token: string, user: any }> {
    return this.http.post<{ message: any, token: string, user: any }>(`${environment.apiURL}/api/web/client/login`, data)
      .pipe(
        tap(
          ({ token, user }) => {
            this.setToken(token);
            localStorage.setItem('auth-token', token);
            this.setUser(user);
          }
        ))
  };

  register(data: any): Observable<any> {
    return this.http.post<any>(`${environment.apiURL}/api/web/client`, data)
  }

  setToken(token: any) { 
    this.token = token
  }

  getToken(): string {
    return this.token
  }

  isAuthenticated(): boolean {
    return this.token
  }

  setUser(user: any) {
    this.user = user
  }

  logout() {
    this.setToken(null)
    this.setUser(null)
    localStorage.removeItem('auth-token');
    this.router.navigate(['/login']);
  }

  findOne(query: any): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/api/web/client/${JSON.stringify(query)}`)
  }

  patch(data: any, _id: string): Observable<any> {
    return this.http.patch<any>(`${environment.apiURL}/api/web/client/${_id}`, data)
  }

  userInfo(): Observable<any> {
    return this.http.get<any>(`${environment.apiURL}/api/web/client/data`)
  }

  getIp(): Observable<any> {
    return this.http.get<any>("http://api.ipify.org/?format=json")
  }

}
