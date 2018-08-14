import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class MyNewServiceService {


  constructor(private http: Http) { }
  weatherId="d3acf8751fb6329eb7d1d0723229741a";

  //For Getting location

  appId="sNZJxwUD1CJSWABbWTV0";
  appCode="CUxmD04Tp6kBnAi6VfOpow";



public getWeatherDetails(lat,lon)
  {
	   return this.http.get('https://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid='+this.weatherId)
       .map(res => res.json());

    // return this.http.get('http://api.apixu.com/v1/current.json?key=23319fb777b04d468cc173118173112&q='+lat+','+lon)
    //   .map(res => res.json());
  }

  public getLocationDeatils(lat,lon)
  {
    return this.http.get('https://reverse.geocoder.cit.api.here.com/6.2/reversegeocode.json?app_id='+this.appId+'&app_code='+this.appCode+'&locationattributes=address,streetDetails,linkInfo&mode=retrieveAddresses&prox='+lat+','+lon+',50&maxresults=3')
    .map(res=>res.json());
  }

  public getStateDetails(){
   return this.http.get('./assets/json/stateIdMap.json')
     .map(res => res.json());
 }

 public getPrediction(bodyjson){
   return this.http.post('https://cgsafari.herokuapp.com/predict/safari_api',bodyjson)
     .map(res => res.json());

}
}
