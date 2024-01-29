import { Component } from '@angular/core';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

import { Geolocation } from '@capacitor/geolocation';
import { NativeAudio } from '@capacitor-community/native-audio'

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  coords: any;
  address: any;
  private geoCoder;

  geolocation: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitudeAccuracy?: number;
    altitude?: number;
    speed?: number;
    heading?: number;
  };

  constructor(private nativeGeocoder: NativeGeocoder) {
    NativeAudio.preload({
      assetId: "music",
      assetPath: "music.wav",
      audioChannelNum: 1,
      isUrl: false
    });

  }
  async ionViewDidEnter() {
    NativeAudio.play({
      assetId: 'music',
      // time: 6.0 - seek time
    });
    NativeAudio.getDuration({
      assetId: 'music'
    })
      .then(result => {
        console.log(result.duration);
      })
  }

  ionViewWillLeave() {
    this.address = null;
    this.coords = null;
    this.geolocation = {
      latitude: null,
      longitude: null,
      accuracy: null,
      altitudeAccuracy: null,
      altitude: null,
      speed: null,
      heading: null,
    };
  }
  async locate() {
    const coordinates = await Geolocation.getCurrentPosition();
    this.coords = coordinates.coords;
  }
  async reverseGeocode() {
    this.geolocation = await (await Geolocation.getCurrentPosition()).coords;
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode(
      {
        location: {
          lat: this.geolocation.latitude,
          lng: this.geolocation.longitude,
        },
      },
      (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            this.address = results[0].formatted_address;
          } else {
            window.alert('No results found');
          }
        } else {
          window.alert('Geocoder failed due to: ' + status);
        }
      }
    );
  }

}
