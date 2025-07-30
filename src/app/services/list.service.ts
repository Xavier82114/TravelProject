import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Attraction {
  id: number;
  name: string;
  introduction: string;
  address: string;
  tel: string;
  images: { src: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class ListService {

  private API_URL = 'https://www.travel.taipei/open-api/zh-tw/Attractions/All';

  private API_URL2 = 'https://www.travel.taipei/open-api/zh-tw/Attractions/All?page=1';

  constructor(private http: HttpClient) {}

  getAttractions(): Observable<any> {
    return this.http.get<any>('assets/attractions.json');
    // return this.http.get<any>(this.API_URL);
    // return this.http.get('/open-api/zh-tw/Attractions/All', {
    //   headers: {
    //     'User-Agent': 'Mozilla/5.0',
    //     'Accept': 'application/json'
    //   }
    // });
    // return this.http.get('https://cors-anywhere.herokuapp.com/https://www.travel.taipei/open-api/zh-tw/Attractions/All');
  }
}
