import { Injectable } from '@angular/core';

//Add Import
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {Observable} from 'rxjs';
import { ResponseAPI } from '../Interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private endpoint:string = environment.endpoint;
  private myApiUrl:string = this.endpoint + "api/course" 

  constructor(private http:HttpClient) { }

  getList():Observable<ResponseAPI>{
    return this.http.get<ResponseAPI>(this.myApiUrl);
  }
}
