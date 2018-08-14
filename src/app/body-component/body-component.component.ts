import { Component, OnInit } from '@angular/core';
import { MyNewServiceService } from './../my-new-service.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-body-component',
  templateUrl: './body-component.component.html',
  styleUrls: ['./body-component.component.css']
})
export class BodyComponentComponent implements OnInit {

public dob: string;
public age:any;
public vage:any;
public vechage:string;
public vehicleType:number;
public predictionResult:any;
busy: Subscription;
public loading:any;
public number: number = 1000;

public lat1:number;
public lng1:number;
public location:any;

public wDetails:any;
public loacationDeatails:any;
public jsonBody:any={};
public speedRange:any="";

public mymodel:number=60;
public max = 120;
public stateDettails:any;
public sex:any=1;
public INCPROB:any="none";
public  loadingMap:any;
public sectors = [
{
  from:0,
  to:60,
  color:'green'
},
  {
  from: 60,
  to: 90,
  color: 'orange'
}, {
  from: 90,
  to: 120,
  color: 'red'
}];


//private speedMap:Map<string,string> = new Map([["SC1","80"],["SC2","65-80"],["SC3","55-64"],["SC4","41-54"],["SC5","31-40"],["SC5","31-40"],["SC6","21-30"],["SC7","6-20"],["SC8","<6"]]);

private speedMap:Map<string,number> = new Map([["SC1",80],["SC2",73],["SC3",60],["SC4",48],["SC5",36],["SC6",26],["SC7",13],["SC8",3]]);
private weatherConditionMap:Map<string,number> = new Map([["Clear",0],["Cloudy",1],["Fog",2],["Rain",3],["Snow",4],["Freeze",4],["Strong Wind",5],["Thunderstorm",5]]);
  constructor(public myNewServiceService: MyNewServiceService) {

 }

    ngOnInit() {
      this.loadingMap = true;
      this.myNewServiceService.getStateDetails().subscribe(result=>{
        this.loadingMap = false;
      this.stateDettails=result;
    },
    err => {
                    this.loading = false;
                    //...
                })
    ;
    this.fetchDetails(this.lat,this.lng);
  }
  calculateVAge()
  {
    let diffInMs: number = Date.now() - Date.parse(this.vechage);
  this.vage=Math.floor((diffInMs / (1000 * 3600 * 24))/365);
  }

  getGeoLocation()
  {
    navigator.geolocation.getCurrentPosition(position => {
    console.log(position);
    this.lat=position.coords.latitude;
    this.lng=position.coords.longitude;
    //markerDragEnd(Marker: m, $event);
    // in your case
    this.markers[0].lat=this.lat;
    this.markers[0].lng=this.lng;

    this.fetchDetails(position.coords.latitude,position.coords.longitude);
});
  }
  getLocation()
  {


    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.showPosition, this.showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
  }

   showPosition(position) {
    var latlon = position.coords.latitude + "," + position.coords.longitude;
    console.log(position.coords.latitude);
    //this.lat= position.coords.latitude;
    //this.lng=position.coords.longitude;
    var img_url = "https://maps.googleapis.com/maps/api/staticmap?center="
    +latlon+"&zoom=14&size=400x300&key=AIzaSyAPFYjW4q5sc5wNtyuEB6cV5fLLgtkxve0";
    this.fetchDetails(position.coords.latitude,position.coords.longitude);

    document.getElementById("mapholder").innerHTML = "<img src='"+img_url+"'>";
}
 showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

fetchDetails(a,b)
{
  this.myNewServiceService.getWeatherDetails( a,b).subscribe(data=>{
    this.wDetails=data;
    console.log(this.wDetails);
  });

  this.myNewServiceService.getLocationDeatils(a,b).subscribe(data=>{
    console.log(data.Response.View[0].Result[0]);
    this.loacationDeatails=data.Response.View[0].Result[0];
    this.speedRange=this.speedMap.get(this.loacationDeatails.Location.LinkInfo.SpeedCategory);
  });
}
pred:any=0.45;
public getPrediction()
{
  if(this.age==undefined || this.vehicleType==undefined ||  this.vechage==undefined)
  {
    alert("Please Provide All Driver Or Vehicle Details");
  }
  else
  {

  this.jsonBody.GENDER=this.sex;
  this.jsonBody.AGE=this.age;
  this.jsonBody.PASSTYPE=1; //Predefined

  if(this.wDetails!=undefined)
  {
    console.log(this.wDetails.weather[0].main);
    this.jsonBody.WEATHER=this.weatherConditionMap.get(this.wDetails.weather[0].main);
    if(this.jsonBody.WEATHER==undefined)
    this.jsonBody.WEATHER=1;
  }

  this.jsonBody.WEATHER=1;
  this.jsonBody.VEHAGE=this.vechage;

  this.jsonBody.VEHTYPE=Number(this.vehicleType);

  this.jsonBody.VEHSPEED=this.mymodel;

  this.jsonBody.ROUTE=this.loacationDeatails.Location.LinkInfo.FunctionalClass;

  this.jsonBody.ROADFEAT=1; //Predefined

  this.jsonBody.REQUID=102541; // Any Random Number

  this.jsonBody.SPEEDLIM=this.speedRange;

  this.stateDettails.forEach(element => {
      if(this.loacationDeatails.Location.Address.State==element.STATE)
      this.jsonBody.STATE=element.ID;
    });
  console.log(this.jsonBody);

this.loading = true;

this.myNewServiceService.getPrediction(this.jsonBody).subscribe(result=>{
this.loading = false;
this.predictionResult=result;
console.log(this.predictionResult);
if(this.predictionResult.STATUS==100)
{

 if(Math.round(this.predictionResult.INCPROB * 100)>0 && Math.round(this.predictionResult.INCPROB * 100) <30)
  {
   this.INCPROB="green";

  }
  if(Math.round(this.predictionResult.INCPROB * 100)>=31 && Math.round(this.predictionResult.INCPROB * 100) <=66)
    {
     this.INCPROB="yellow";

  }
 if(Math.round(this.predictionResult.INCPROB * 100)>67)
    {
      this.INCPROB="red";
     }
   }
  else
     {
   alert("Some Error Occured .... Try Again Later...");
     this.predictionResult.INCPROB="Failed To Predict";
    }


}
, err => {
                this.loading = false;
                //...
            });


}
}

  zoom: number = 14;
  // initial center position for the map
  lat: number = 41.840794;

  lng: number = -87.952377;

  clickedMarker(label: string, index: number,$event: any) {
    //console.log(`clicked the marker: ${label || index}`)
    this.fetchDetails(this.lat,this.lng);
  }

  mapClicked($event: any) {
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });
  }

  markerDragEnd(m: marker, $event: any) {
    // console.log("Drag End Called");
    // console.log($event.coords.lat);
    // console.log($event.coords.lng);
    this.lat=$event.coords.lat;
    this.lng=$event.coords.lng;
    this.fetchDetails($event.coords.lat,$event.coords.lng);
  }

  markers: marker[] = [
	  {
		  // lat: 41.840794,
		  // lng: -87.952377,
      lat:this.lat,
      lng:this.lng,
		  label: 'Car',
		  draggable: true
	  }
  ]
}

interface marker {
	lat: number;
	lng: number;
	label?: string;
	draggable: boolean;
}
