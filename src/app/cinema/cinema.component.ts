import { Component, OnInit } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {CinemaService} from "../services/cinema.service";

@Component({
  selector: 'app-cinema',
  templateUrl: './cinema.component.html',
  styleUrls: ['./cinema.component.css']
})
export class CinemaComponent implements OnInit {
  public villes: any;
  public cinemas:any;
  public currentVille:any;
  public currentCinema:any;
  public salles: any;
  public currentProjection: any;
  public selectedTickets: any[];

  constructor(public cinemaService: CinemaService) {
  }

  ngOnInit() {
    this.cinemaService.getVilles()
      .subscribe(data => {
        this.villes = data;
      }, err => {
        console.log(err);
      });

  }

  onGetCinema(v: any) {
    this.currentVille=v;
    this.salles=undefined;
    this.currentCinema=undefined;
    this.cinemaService.getCinemas(v)
      .subscribe(data=>{
        this.cinemas=data;
      },err => {
        console.log(err);
      })
  }

  onGetSalles(c:any) {
    this.currentCinema=c;
    this.cinemaService.getSalles(c)
      .subscribe(data => {
        this.salles = data;
        // @ts-ignore
        this.salles._embedded.salles.forEach( salle => {
          this.cinemaService.getProjections(salle)
            .subscribe(data => {
              salle.projections = data;
            }, err => {
              console.log(err);
            });

        })
      }, err => {
        console.log(err);
      });

  }

  onGetTicketPlaces(p: any) {
    this.currentProjection = p;
    this.cinemaService.getTicketsPlaces(p)
      .subscribe(data => {
        this.currentProjection.tickets = data;
        this.selectedTickets=[];
      }, err => {
        console.log(err);

      })
  }

  onSelectedTicket(t : any ) {
    if(!t.selected){
      t.selected=true;
      this.selectedTickets.push(t);
    }
    else {
      t.selected=false;
      this.selectedTickets.splice(this.selectedTickets.indexOf(t),1);
    }
    console.log(this.selectedTickets);
  }

  getTicketClass(t : any) {
    let str = "btn ticket ";
    if (t.selected==true){
      str+="btn-warning ";
    }
    else if (t.reserve==true){
      str+=" btn-danger";
    }else {
      str+="btn-success";
    }
    return str;
  }

  onPayerTicket(dataForm : any) {
    console.log(dataForm);
    let tickets: any[] = [];
    this.selectedTickets.forEach(t=>{
      tickets.push(t.id);
    });
    dataForm.tickets=tickets;
    this.cinemaService.payerTicket(dataForm)
      .subscribe(data => {
        alert("Tickets reservés avec succée")
        this.onGetTicketPlaces(this.currentProjection);
      }, err => {
        console.log(err);

      })
  }
}
