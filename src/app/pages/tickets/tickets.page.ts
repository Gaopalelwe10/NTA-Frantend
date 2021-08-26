import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { ToasterService } from 'src/app/services/toaster.service';
import { TicketFormPage } from '../ticket-form/ticket-form.page';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {
  isSearchbar: boolean=false;
  data = false
  ticketList:any;
  ticketListLoaded:any;
  count = 0;
  constructor(
    private api: ApiService,
    private authService: AuthService,
    private alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private toaster: ToasterService,
    private modalCtrl: ModalController
    
  ) { 
  }

  ngOnInit() {
  
  }

  ionViewWillEnter() {
    this.init();
  }
 
  async init(){
    this.api.get_officer_tickets().subscribe(
      data => {
        if (data.status == 0) {
          this.ticketList = data.data;
          console.log(data.data)
          this.ticketListLoaded = data.data;
          this.count = data.data.length;
          this.data=true
        } else {
          this.data=true
          this.presentAlert(data.msg);
        }
      }, error => {
        this.data=true
        this.presentAlert("Could not connect to server 🖥️, check your internet connection!");
       
      }
    );
  }

  doRefresh(event){
    this.data=false
    setTimeout(()=>{
      
      this.init()
      event.target.complete();
    }, 500)
  }

 
  initializeItems(): void {
    this.ticketList = this.ticketListLoaded;
  }

  filterList(evt) {
    this.initializeItems();

    const searchTerm = evt.srcElement.value;

    if (!searchTerm) {
      return;
    }

    this.ticketList = this.ticketListLoaded.filter(currentOpp => {
      if ((currentOpp.Id && searchTerm) || (currentOpp.firstname && searchTerm) || (currentOpp.lastname && searchTerm)) {
        if ((currentOpp.Id.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) || (currentOpp.lastname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) || (currentOpp.firstname.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1)) {
          return true;
        }
        return false;
      }
    });

  }

  async updateTicket(data){
    const modal = await this.modalCtrl.create({
      component: TicketFormPage,
   
      componentProps: {
        data: JSON.stringify(data),
        isUpdate: true,
      },
    });

    modal.onDidDismiss().then(data => {
      console.log(data)
      if (data['role'] != 'backdrop') {
        this.init()
      }
     
    });

    return await modal.present();
  }

  

  update(data){
    const navigationExtras: NavigationExtras = {
      queryParams: {
        data: data,
        isUpdate: false,
      }
    };

    this.navCtrl.navigateForward(['/ticket-form'], navigationExtras);
  }

  async deleteTicket(ref) {
    const alert = await this.alertCtrl.create({
      header: 'Delete',
      message: 'Do you want to delete this ticket?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'yes',
          handler: data => {
            this.api.remove_ticket(7).subscribe(
              data => {
                if (data.status == 0) {
                  this.toaster.successToast(data.msg);
                  this.ionViewWillEnter()
                } else {
                  this.presentAlert(data.msg);
                }
              }, error => {
            
                this.presentAlert("Could not connect to server 🖥️, check your internet connection!");
              }
            );
          }
        }
      ]
    });

    await alert.present();

  }

  async presentAlert(msg) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'NTA',
      subHeader: 'Warning',
      message: msg,
      buttons: ['OK']
    });
    await alert.present();
  }
}
