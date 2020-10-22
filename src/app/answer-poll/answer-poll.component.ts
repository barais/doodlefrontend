import { Component, OnInit, ViewChild, AfterViewChecked } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { stringify } from 'querystring';
import { PollService } from '../poll-service.service';
import { Poll, ChoiceUser, PollCommentElement, User, PollChoice } from '../model/model';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import frLocale from '@fullcalendar/core/locales/fr';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-answer-poll',
  templateUrl: './answer-poll.component.html',
  styleUrls: ['./answer-poll.component.css'],
  providers: [MessageService, PollService, FullCalendarComponent]

})
export class AnswerPollComponent implements OnInit, AfterViewChecked {

  constructor(public messageService: MessageService, private actRoute: ActivatedRoute, private pollService: PollService) { }
  slugid: string;
  poll: Poll;
  calendarortableoption: any[];
  calendarortable = 'calendar';
  personalInformation: any = {
    nom: '',
    mail: '',
    desc: '',
    pref: false
  };
  options: CalendarOptions;
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  submitted = false;
  csubmitted = false;
  voeuxsoumis = false;
  commentsoumis = false;
  events: EventInput[] = [];
  comment1 = '';
  commentdesc1 = '';
  uniqueUsers: User[] = [];
  userChoices: Map<number, PollChoice[]> = new Map();
  ngOnInit(): void {
    this.calendarortableoption = [
      { icon: 'pi pi-calendar', text: 'Calendrier', value: 'calendar' },
      { icon: 'pi pi-table', text: 'Tableau', value: 'table' },
    ];

    this.actRoute.paramMap.subscribe(params => {
      this.slugid = params.get('slugid');
      this.pollService.getPollBySlugId(this.slugid).subscribe(p => {
        this.poll = p;
        const calendarApi = this.calendarComponent.getApi();
        // calendarApi.next();
        this.uniqueUsers.splice(0, this.uniqueUsers.length);
        this.poll.pollChoices.forEach(pc => {
          pc.users.forEach(user => {
            if (this.uniqueUsers.filter(us => us.id === user.id).length  === 0 ){
              this.uniqueUsers.push(user);
              this.userChoices.set(user.id, []);
            }
          });

          const evt =
          {
            title: '',
            start: pc.startDate,
            end: pc.endDate,
            resourceEditable: false,
            eventResizableFromStart: false,
            backgroundColor: 'red',
            extendedProps: {
              choiceid: pc.id,
              selected: false
            },
          };
          calendarApi.addEvent(evt, true);
          this.events.push(evt);
        });
        this.poll.pollChoices.forEach(pc => {
          pc.users.forEach(us => {
              this.userChoices.get(us.id).push(pc);
          });
        });

      });
    });

    this.options = {
      initialView: 'timeGridWeek',
      // dateClick: this.handleDateClick.bind(this), // bind is important!
      /*eventDragStart: (timeSheetEntry, jsEvent, ui, activeView) => {
        this.eventDragStart(
            timeSheetEntry, jsEvent, ui, activeView
        );
     },
eventDragStop: (timeSheetEntry, jsEvent, ui, activeView) => {
        this.eventDragStop(
           timeSheetEntry, jsEvent, ui, activeView
        );
      },*/
      events: this.events,
      editable: false,
      droppable: false,
      //      selectMirror: true,
      eventResizableFromStart: false,
      selectable: false,
      locale: frLocale,
      themeSystem: 'bootstrap',
      slotMinTime: '08:00:00',
      slotMaxTime: '20:00:00',
      eventMouseEnter: (mouseEnterInfo) => {

      },
      eventClick: (info) => {
        if (info.event.extendedProps.selected) {
          info.event.setExtendedProp('selected', false);
          const evt = this.events.filter(e => e.extendedProps.choiceid === info.event.extendedProps.choiceid).pop();
          evt.extendedProps.selected = false;
          evt.backgroundColor = 'red';
          info.event.setProp('backgroundColor', 'red');
          this.poll.pollChoices.filter(pc => pc.id === evt.extendedProps.choiceid)[0].users.splice(-1, 1);

        } else {
          info.event.setExtendedProp('selected', true);
          const evt = this.events.filter(e => e.extendedProps.choiceid === info.event.extendedProps.choiceid).pop();
          evt.extendedProps.selected = true;
          evt.backgroundColor = 'green';
          info.event.setProp('backgroundColor', 'green');
          this.poll.pollChoices.filter(pc => pc.id === evt.extendedProps.choiceid)[0].users.push({id: -1});

        }

        //        info.event.remove();
      },
    };


  }


  updateEvent($event: any, event: EventInput): void{

    event.extendedProps.selected = $event.checked;
    if ($event.checked){
      event.backgroundColor = 'green';
      this.poll.pollChoices.filter(pc => pc.id === event.extendedProps.choiceid)[0].users.push({id: -1});

    }else {
      event.backgroundColor = 'red';
      this.poll.pollChoices.filter(pc => pc.id === event.extendedProps.choiceid)[0].users.splice(-1, 1);


    }
  }
  ngAfterViewChecked(): void {

  }

  createComment(): void {


    if (this.comment1 && this.commentdesc1) {
      const c: PollCommentElement = {
        content: this.commentdesc1,
        auteur: this.comment1
      };
      this.pollService.addComment4Poll(this.slugid, c).subscribe(e => {
        this.messageService.add({
          severity: 'success',
          summary: 'Données enregistrées',
          detail: 'Merci pour ce commentaire'}
          );
        this.commentsoumis = true;
      });

      return;
    }
    this.messageService.add(
      {
        severity: 'warn',
        summary: 'Données incomplètes',
        detail: 'Veuillez remplir les champs requis'}
        );
    this.csubmitted = true;
  }

  createReponse(): void {



    if (this.personalInformation.nom && this.personalInformation.mail &&
      this.events.filter(e => e.extendedProps.selected).length > 0 &&
      (this.personalInformation.desc || !this.personalInformation.pref)) {
      const cu: ChoiceUser = {
        username: this.personalInformation.nom,
        mail: this.personalInformation.mail,
        pref: this.personalInformation.desc,
        choices: this.events.filter(e => e.extendedProps.selected).map(x => x.extendedProps.choiceid)
      };
      this.pollService.updateChoice4user(cu).subscribe(e => {
      //  cu.choices.forEach(c => this.poll.pollChoices.filter( c1 => c1.id === c)[0].users.push(e));
      //  if (this.uniqueUsers.filter(u1 => u1.id === e.id ).length === 0) {
      //    this.uniqueUsers.push(e);
       // }
        this.messageService.add({
          severity: 'success',
          summary: 'Données enregistrées',
          detail: 'Merci pour votre participation'}
          );
        this.voeuxsoumis = true;
      });
      return;
    }
    this.messageService.add(
      {
        severity: 'warn',
        summary: 'Données incomplètes',
        detail: 'Veuillez remplir les champs requis et sélectioner au moins une date'}
        );
    this.submitted = true;
    // http://localhost:4200/answer/xCOAt3obeVkO2KG2J_ZsxahF

  }


}
