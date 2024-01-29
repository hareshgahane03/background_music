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
  async locate() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('Current', coordinates);
    this.coords = coordinates.coords;
  }
  async reverseGeocode() {
    if (!this.coords) {
      const coordinates = await Geolocation.getCurrentPosition();
      this.coords = coordinates.coords;
    }
    this.geoCoder = new google.maps.Geocoder();

    this.geoCoder.geocode({ location: { lat: this.coords.latitude, lng: this.coords.longitude } }, (results, status) => {
      console.log('results', results)
      if (status === 'OK') {
        if (results[0]) {
          console.log('results', results[0])
          this.address = results[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    });
  }

}
