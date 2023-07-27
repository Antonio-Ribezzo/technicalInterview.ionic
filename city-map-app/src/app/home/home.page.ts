import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import {
  GoogleMap,
  MapInfoWindow,
  MapGeocoder,
  MapGeocoderResponse,
} from '@angular/google-maps';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage {
  @ViewChild('search')
  public searchElementRef!: ElementRef;
  @ViewChild('myGoogleMap', { static: false })
  map!: GoogleMap;
  @ViewChild(MapInfoWindow, { static: false })
  info!: MapInfoWindow;

  address = '';
  latitude!: any;
  longitude!: any;
  zoom = 12;
  maxZoom = 15;
  minZoom = 8;
  center!: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid',
  };
  markers = [] as any;

  constructor(private ngZone: NgZone, private geoCoder: MapGeocoder) {}

  ngAfterViewInit(): void {
    // Binding autocomplete to search input control
    let autocomplete = new google.maps.places.Autocomplete(
      this.searchElementRef.nativeElement
    );
  
    autocomplete.addListener('place_changed', () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        console.log({ place }, place.geometry.location?.lat());

        //set latitude, longitude and zoom
        this.latitude = place.geometry.location?.lat();
        this.longitude = place.geometry.location?.lng();

        // Set marker position
        this.setMarkerPosition(this.latitude, this.longitude);

        this.center = {
          lat: this.latitude,
          lng: this.longitude,
        };
      });
    });
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      // Set marker position
      this.setMarkerPosition(this.latitude, this.longitude);
    });
  }

  setMarkerPosition(latitude: any, longitude: any) {
    // Set marker position
    this.markers = [
      {
        position: {
          lat: latitude,
          lng: longitude,
        },
        options: {
          animation: google.maps.Animation.DROP,
          draggable: true,
        },
      },
    ];
  }
}