import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery/ngx';
import { ChargesPageModule } from './pages/charges/charges.module';
import { HttpClientModule } from '@angular/common/http';
import { TabsPageModule } from './pages/tabs/tabs.module';
import { TicketFormPageModule } from './pages/ticket-form/ticket-form.module';
import { VehicletypePageModule } from './pages/vehicletype/vehicletype.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    HttpClientModule,
    TabsPageModule,
    TicketFormPageModule,
    ChargesPageModule,
    VehicletypePageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    BarcodeScanner,
    Base64ToGallery
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
