import { Component, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PollService } from '../poll-service.service';
import { FullCalendarComponent } from '@fullcalendar/angular';
import frLocale from '@fullcalendar/core/locales/fr';

@Component({
  selector: 'app-create-poll-component',
  templateUrl: './create-poll-component.component.html',
  styleUrls: ['./create-poll-component.component.css'],
  providers: [MessageService, PollService, FullCalendarComponent]
})
export class CreatePollComponentComponent implements OnInit {


  items: MenuItem[];
  personalInformation: any = {};
  options: any;

  constructor(public messageService: MessageService, public pollService: PollService) { }

  ngOnInit(): void {

    this.items = [{
      label: 'Information pour le rendez vous',
      routerLink: 'personal'
    },
    {
      label: 'Choix de la date',
      routerLink: 'seat'
    },
    {
      label: 'Résumé',
      routerLink: 'payment'
    }
    ];



    this.options  = {
      initialView: 'timeGridWeek',
      // dateClick: this.handleDateClick.bind(this), // bind is important!
      select: (selectionInfo) => {
        console.log(selectionInfo);
      },
      eventDragStart: (timeSheetEntry, jsEvent, ui, activeView) => {
        this.eventDragStart(
            timeSheetEntry, jsEvent, ui, activeView
        );
     },
eventDragStop: (timeSheetEntry, jsEvent, ui, activeView) => {
        this.eventDragStop(
           timeSheetEntry, jsEvent, ui, activeView
        );
      },
      events: [
        { title: 'event 1', start: '2020-10-20T08:00:00', end: '2020-10-20T10:00:00', resourceEditable : true,
        eventResizableFromStart: true },
        { title: 'event 2', date: '2020-10-21' , resourceEditable : true, eventResizableFromStart: true }
      ],
      editable: true,
      droppable: true,
      selectMirror: true,
      eventResizableFromStart: true,
      selectable: true,
      locale: frLocale,
      themeSystem: 'bootstrap',
      slotMinTime: '08:00:00',
      slotMaxTime: '20:00:00',
      eventMouseEnter: (mouseEnterInfo) => {

      }
    };


  }


  eventDragStart(timeSheetEntry, jsEvent, ui, activeView): void {
    console.log('event drag start');
 }
 eventDragStop(timeSheetEntry, jsEvent, ui, activeView): void {
    console.log('event drag end');
 }
  nextPage(): void { }

  handleDateClick(arg): void {
    alert('date click! ' + arg.dateStr);
  }

}
