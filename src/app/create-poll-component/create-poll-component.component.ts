import { Component, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { PollService } from '../poll-service.service';
import { FullCalendarComponent, CalendarOptions } from '@fullcalendar/angular';
import frLocale from '@fullcalendar/core/locales/fr';
import { PollChoice, Poll } from '../model/model';

@Component({
  selector: 'app-create-poll-component',
  templateUrl: './create-poll-component.component.html',
  styleUrls: ['./create-poll-component.component.css'],
  providers: [MessageService, PollService, FullCalendarComponent]
})
export class CreatePollComponentComponent implements OnInit {
  urlsondage = '';
  urlsondageadmin = '';
  urlsalon = '';
  urlpad = '';

  items: MenuItem[];
  personalInformation: any = {
    titre: '',
    lieu: '',
    desc: '',
    repas: false
  };
  options: CalendarOptions;

  step = 0;
  events = [];

  result: Poll;
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  submitted = false;


  constructor(public messageService: MessageService, public pollService: PollService) { }

  ngOnInit(): void {

    this.items = [{
      label: 'Informations pour le rendez vous',
      command: () => {
        this.step = 0;
      }
    },
    {
      label: 'Choix de la date',
      command: () => {
        this.step = 1;
      }
    },
    {
      label: 'Résumé',
      command: () => {
        this.step = 2;
      }
    }
    ];



    this.options = {
      initialView: 'timeGridWeek',
      // dateClick: this.handleDateClick.bind(this), // bind is important!
      select: (selectionInfo) => {
        const calendarApi = this.calendarComponent.getApi();
        const evt = {
          title: 'event 1', start: selectionInfo.start, end: selectionInfo.end, resourceEditable: true,
          eventResizableFromStart: true
        };
        calendarApi.addEvent(evt, true);
        this.events.push(evt);
      },

      events: this.events,
      editable: true,
      droppable: true,
      //      selectMirror: true,
      eventResizableFromStart: true,
      selectable: true,
      locale: frLocale,
      themeSystem: 'bootstrap',
      slotMinTime: '08:00:00',
      slotMaxTime: '20:00:00',
      eventMouseEnter: (mouseEnterInfo) => {

      },
      eventClick: (info) => {
        info.event.remove();
      },
      validRange: {
        start: Date.now()
      }
    };


  }


  nextPage(): void {

    if (this.personalInformation.titre && this.personalInformation.lieu && this.personalInformation.desc) {
      this.step = 1;
      return;
    }
    this.messageService.add(
      {
        severity: 'warn',
        summary: 'Données incomplètes',
        detail: 'Veuillez remplir les champs requis'
      }
    );

    this.submitted = true;
  }

  nextPage1(): void {
    const p = {
      title: this.personalInformation.titre,
      description: this.personalInformation.desc,
      location: this.personalInformation.lieu,
      has_meal: this.personalInformation.repas,
      pollChoices: []
    };
    this.events.forEach(e => {
      p.pollChoices.push({
        startDate: e.start,
        endDate: e.end,
      });
    });

    this.pollService.createPoll(p).subscribe(p1 => {
      this.result = p1;
      this.urlsondage = 'http://localhost:4200/answer/' + p1.slug;
      this.urlsondageadmin = 'http://localhost:4200/admin/' + p1.slugAdmin;
      this.urlsalon = p1.tlkURL;
      this.urlpad = p1.padURL;
      this.step = 2;
    });

  }

  prevPage1(): void {

    this.step = this.step - 1;
  }


}
