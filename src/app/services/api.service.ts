import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // _Url = "http://localhost:8080/";
  _Url = "https://nta-api.herokuapp.com/";
  constructor(
    private http: HttpClient,
  ) { }

  // register
  register(signUpdetails) {
    return this.http.post<any>(this._Url + 'register', signUpdetails);
  }
  //UPDATE Officer
  update_officer(profileDetails) {
    profileDetails.staffNumber = localStorage.getItem('staffNumber');
    return this.http.post<any>(this._Url + 'update_officer', profileDetails);
  }

  //UPDATE PASSWORD
  update_password(password) {
    var staffNumber = localStorage.getItem('staffNumber');
    return this.http.post<any>(this._Url + 'update_password', { password, staffNumber });
  }

  //Reset PASSWORD
  reset_password(email) {
    var staffNumber = localStorage.getItem('staffNumber');
    return this.http.get<any>(this._Url + 'resetPassword/' + email, {});
  }

  driver(Id) {
    return this.http.post<any>(this._Url + 'driver', { Id });
  }
  //Add a ticket
  add_ticket(ticketDetails) {
    ticketDetails.staffNumber = localStorage.getItem('staffNumber');
    return this.http.post<any>(this._Url + 'add_ticket', ticketDetails);
  }

  update_ticket(ticketDetails) {
    return this.http.post<any>(this._Url + 'update_ticket', ticketDetails);
  }
  //get officer_tickets
  get_officer_tickets() {
    var staffNumber = localStorage.getItem('staffNumber');
    return this.http.post<any>(this._Url + 'get_officer_ticket', { staffNumber });
  }
  //remove ticket
  remove_ticket(reference) {

    return this.http.post<any>(this._Url + 'delete_ticket', { reference });
  }
  
  get_vehicle_by_search(searchText) {
    return this.http.post<any>(this._Url + 'get_vehicle_by_search', { searchText });
  }

  get_all_charges() {
    return this.http.get<any>(this._Url + 'get_all_charges');
  }

  get_all_vehicletype() {
    return this.http.get<any>(this._Url + 'get_all_vehicletype');
  }
}
