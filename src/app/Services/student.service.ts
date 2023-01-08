import { Injectable } from '@angular/core';

//Add Import
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import { ResponseAPI } from '../Interfaces/response-api';
import { Student } from '../Interfaces/student';


@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private endpoint:string = environment.endpoint;
  private myApiUrl:string = this.endpoint + "api/student" 

  constructor(private http:HttpClient) { }

  getList():Observable<ResponseAPI>{
    return this.http.get<ResponseAPI>(this.myApiUrl);
  }

  add(request:Student):Observable<ResponseAPI>{
    return this.http.post<ResponseAPI>(this.myApiUrl,request);
  }

  update(request:Student):Observable<ResponseAPI>{
    return this.http.put<ResponseAPI>(this.myApiUrl,request);
  }

  delete(id:number):Observable<ResponseAPI>{
    return this.http.delete<ResponseAPI>(`${this.myApiUrl}/${id}`);
  }
}
