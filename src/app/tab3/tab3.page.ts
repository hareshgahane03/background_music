import { Component, OnInit } from '@angular/core';
import { GoogleMapsAPIWrapper, MapsAPILoader } from '@agm/core';
import { Geolocation, Position } from '@capacitor/geolocation';
import { AgmDirection } from 'agm-direction';
import { ToastController } from '@ionic/angular';

declare const google: any;

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
})
export class Tab3Page implements OnInit {

  mapData = {
    zoom: 16,
    latitude: 21.1321178,
    longitude: 79.1096177,
    destination: {
      lat: 21.2321178,
      lng: 79.2096177,
    },
    origin: {
      lat: 21.1321178,
      lng: 79.1096177,
    }
  };
  public renderOptions: any = {
    draggable: false,
    suppressMarkers: false,
    suppressInfoWindows: false,
    // markerOptions: { // effect all markers
    //   icon: 'your-icon-url',
    // },
  }

  public markerOptions = {
    origin: {
      label: 'Your location',
      draggable: false,
    },
    designation: {
      label: '',
      draggable: false,
    },
    destination: {
      label: 'Destination',
      opacity: 0.8,
    },
  }
  timeInterval;
  data = {
    markerUrl: 'assets/location.png'
  }
  public directionResponse: any = {};
  private directionService = new google.maps.DirectionsService;
  watchPosition$: any;

  constructor(private mapsAPILoader: MapsAPILoader, private agmDirection: AgmDirection, public toastController: ToastController) {

  }

  async ngOnInit() {
    // const position = (await Geolocation.getCurrentPosition())
    // this.mapData.origin.lat = position.coords.latitude;
    // this.mapData.origin.lng = position.coords.longitude;
    // console.log('position', position)
    this.watchCurrentPosition();
  }


  ionViewDidLeave(): void {
    Geolocation.clearWatch(this.watchPosition$);
  }

  async watchCurrentPosition() {
    const options = {
      enableHighAccuracy: true,
      timeout: 100, // Maximum time to wait for position updates (in milliseconds)
      maximumAge: 300 // Maximum age of a cached position (in milliseconds)
    };
    this.watchPosition$ = Geolocation.watchPosition(options, (position: Position, err: any) => {
      if (err) {
        console.error('Error getting current position:', err);
        return;
      }
      console.log('Current position:', position);
      // Do something with the position data
      this.mapData.origin['lat'] = position.coords.latitude;
      this.mapData.origin['lng'] = position.coords.longitude
      // const body = {
      //   origin: new google.maps.LatLng(this.mapData.origin['lat'], this.mapData.origin['lng']),
      //   destination: new google.maps.LatLng(this.mapData.destination.lat, this.mapData.destination.lat),
      //   travelMode: google.maps.TravelMode.TRANSIT
      // }
      // this.directionService.route(body, (response, status) => {
      //   console.log('response from direction', 'with status ', status, response)
      //   if (status === 'OK') {
      //     this.directionResponse = response;
      //     this.agmDirection.directionsRenderer.setDirections(response)
      //   } else {
      //     // window.alert('Directions request failed due to ' + status);
      //   }
      // });
    });
  }

  async recenterLocation() {
    const position = await Geolocation.getCurrentPosition();
    console.log(position)
    this.mapData.origin['lat'] = position.coords.latitude;
    this.mapData.origin['lng'] = position.coords.longitude;
    console.log('new coordinates', this.mapData.origin)
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Your location have been saved.',
      duration: 2000,
      position: 'middle',
    });
    toast.present();
  }

  markerDragEnd($event: any) {
    this.mapData.latitude = $event.coords.lat;
    this.mapData.longitude = $event.coords.lng;
  }

  change($event) {
    console.log('change $event', $event)
    this.directionResponse = $event;
  }

}
