import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';

// Calendar option
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

// Calendar Services

// BootStrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
// Sweet Alert
import Swal from 'sweetalert2';

import { DatePipe } from '@angular/common';
import { restApiService } from 'src/app/core/services/rest-api.service';
import { MailingService } from 'src/app/core/services/mailing.service';
import { EventData } from './event.model';


@Component({
  selector: 'app-cal',
  templateUrl: './cal.component.html',
  styleUrls: ['./cal.component.scss']
})
export class CalComponent {
// bread crumb items
breadCrumbItems!: Array<{}>;

// calendar
calendarEvents!: any[];
editEvent: any;
formEditData!: UntypedFormGroup;
newEventDate: any;
category!: any[];
submitted = false;

// Calendar click Event
formData!: UntypedFormGroup;
@ViewChild('editmodalShow') editmodalShow!: TemplateRef<any>;
@ViewChild('modalShow') modalShow !: TemplateRef<any>;

nextWeekEvents ?:any[]
constructor(private modalService: NgbModal, 
            private formBuilder: UntypedFormBuilder,
            private datePipe: DatePipe, 
            private restApiService: restApiService,
            private mailingService : MailingService) { }

ngOnInit(): void {
  /**
   * BreadCrumb
   */
  this.breadCrumbItems = [
    { label: 'Apps' },
    { label: 'Calendar', active: true }
  ];

  // Validation
  // this.formData = this.formBuilder.group({
  //   title: ['', [Validators.required]],
  //   location: ['', [Validators.required]],
  //   desription: ['', [Validators.required]],
  //   date: ['', Validators.required],
  //   start: ['', Validators.required],
  //   end: ['', Validators.required]
  // });
    // Validation
  this.formData = this.formBuilder.group({
    title: ['', [Validators.required]],
    date: ['', Validators.required],
    start: ['', [Validators.required, Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')]],
    end: ['', [Validators.required, Validators.pattern('^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$')]],
    attendeeEmail: ['', [Validators.required, Validators.email]],
  });
  

  this._fetchData();
  //this.getNextWeekEvents();

  
}


getNextWeekEvents(){
  this.mailingService.getAllEventsForThisWeek().subscribe(
    res =>{
      this.nextWeekEvents=res;
      console.log("NEXT WEEK EVENTS : " , this.nextWeekEvents)
    },
    err=>{
      console.log("ERROR-----" , err.error.message)
    }
  )
}

private _fetchData() {
  // Event category

  // Calendar Event Data
  this.mailingService.getAllEventsForThisWeek().subscribe(
    data => {
      console.log("RESPONSE : " , data)
      this.calendarEvents=data;
      this.calendarOptions.events = data.map(
        (evt:any) => {
          return { date: evt.start.dateTime, title: evt.subject ,className:evt.categories.join(' ') , location:evt.location.displayName ,description:evt.bodyPreview }
        }) 
        console.log("CALENDAR EVENTS " , this.calendarOptions.events)
    }
  );
}
/**
 * Fetches the data
 */
// private _fetchData() {
//   // Event category
//   this.category = category;

//   // Calender Event Data
//   // this.calendarEvents = calendarEvents;
//   this.restApiService.getCalendarData().subscribe(
//     data => {
//       const users = JSON.parse(data);        
//       this.calendarEvents = users.data;   
//       this.calendarOptions.events = this.calendarEvents.map(
//         (evt:any) => {
//           return { date: evt.start, title: evt.title,className:evt.className,location:evt.location,description:evt.description }
//         })     
//   });
// }

/***
* Calender Set
*/
calendarOptions: CalendarOptions = {
  plugins: [
    interactionPlugin,
    dayGridPlugin,
    timeGridPlugin,
    listPlugin,
  ],
  headerToolbar: {
    left: 'dayGridMonth,dayGridWeek,dayGridDay',
    center: 'title',
    right: 'prevYear,prev,next,nextYear'
  },
  initialView: "dayGridMonth",
  themeSystem: "bootstrap",
  initialEvents: this.calendarEvents,
  weekends: true,
  editable: true,
  selectable: true,
  selectMirror: true,
  dayMaxEvents: true,
  select: this.openModal.bind(this),
  eventClick: this.handleEventClick.bind(this),
  eventsSet: this.handleEvents.bind(this)
};
currentEvents: EventApi[] = [];

/**
 * Event add modal
 */
openModal(event?: any) {
  this.submitted = false;
  this.newEventDate = event;
  this.modalService.open(this.modalShow, { centered: true });
}

/**
 * Event click modal show
 */
handleEventClick(clickInfo: EventClickArg) {
  this.editEvent = clickInfo.event;

  this.formEditData = this.formBuilder.group({
    editTitle: clickInfo.event.title,
    editlocation: clickInfo.event.extendedProps['location'],
    editDescription: clickInfo.event.extendedProps['description'],
    editDate: clickInfo.event.start,
    editStart: clickInfo.event.start,
    editEnd: clickInfo.event.end
  });
  this.modalService.open(this.editmodalShow, { centered: true });
}

/**
 * Events bind in calander
 * @param events events
 */
handleEvents(events: EventApi[]) {
  this.currentEvents = events;
}

/**
 * Close event modal
 */
closeEventModal() {
  this.formData = this.formBuilder.group({
    title: '',
  });
  this.modalService.dismissAll();
}

/***
 * Model Position Set
 */
position() {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Event has been saved',
    showConfirmButton: false,
    timer: 1000,
  });
}

/***
 * Model Edit Position Set
 */
Editposition() {
  Swal.fire({
    position: 'center',
    icon: 'success',
    title: 'Event has been Updated',
    showConfirmButton: false,
    timer: 1000,
  });
}

/**
 * Event Data Get
 */
get form() {
  return this.formData.controls;
}

/**
 * Save the event
 */
// saveEvent() {
//   if (this.formData.valid) {
//     ///const className = this.formData.get('category')!.value;
//     const title = this.formData.get('title')!.value;
//     const location = this.formData.get('location')!.value;
//     const desription = this.formData.get('desription')!.value
//     const date = this.formData.get('date')!.value
//     const starttime = this.formData.get('start')!.value;
//     const endtime = this.formData.get('end')!.value;
//     const yy = new Date(date).getFullYear();
//     const mm = new Date(date).getMonth() + 1;
//     const dd = new Date(date).getDate();

//     const start = new Date(mm + '-' + dd + '-' + yy);
//     start.setHours((starttime.split(' ')[0]).split(':')[0]);
//     start.setMinutes((starttime.split(' ')[0]).split(':')[1]);

//     const end = new Date(mm + '-' + dd + '-' + yy);
//     end.setHours((endtime.split(' ')[0]).split(':')[0]);
//     end.setMinutes((endtime.split(' ')[0]).split(':')[1]);
//     const calendarApi = this.newEventDate.view.calendar;

//     calendarApi.addEvent({
//       id: createEventId(),
//       title,
//       date,
//       start,
//       end,
//       location,
//       desription,
//      // className: className + ' ' + 'text-white'
//     });
//     this.position();
//     this.formData = this.formBuilder.group({
//       title: '',
//       location: '',
//       desription: '',
//       date: '',
//       start: '',
//       end: ''
//     });
//     this.modalService.dismissAll();
//   } else {
//   }
//   this.submitted = true;
// }
 formatDateTime(dateValue:any, dateTime: string) {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, '0');
  const day = String(dateValue.getDate()).padStart(2, '0');
  const startTime = dateTime + ':00.000';

  const formattedDateTime = `${year}-${month}-${day}T${startTime}Z`;
  return formattedDateTime;
}




saveEvent() {
  if (this.formData.valid) {
    const title = this.formData.get('title')!.value;
    const date = this.formData.get('date')!.value;
    const startTime = this.formData.get('start')!.value;
    const endTime = this.formData.get('end')!.value;
    const attendeeEmail = this.formData.get('attendeeEmail')!.value;

    const startDateTime = this.formatDateTime(date , startTime);
    const endDateTime = this.formatDateTime(date , endTime);

    const eventData: EventData = {
      subject: title,
      start: {
        dateTime: startDateTime,
        timeZone: 'UTC'
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'UTC'
      },
      attendees: [
        {
          emailAddress: {
            address: attendeeEmail
          }
        }
      ],
      isOnlineMeeting: true
    };
    console.log("DATE : " , date)
    console.log("START DATE" , startTime +"===>"+ endTime)
    this.mailingService.createEvent(eventData).subscribe(
      () => {
        console.log("Event created successfully");
      },
      (error) => {
        console.log("Failed to create event");
      }
    );

    this.position();
    this.formData.reset();
    this.modalService.dismissAll();
  } else {
    // Handle form validation errors
  }
  this.submitted = true;
}

/**
 * save edit event data
 */
editEventSave() {
  const editTitle = this.formEditData.get('editTitle')!.value;
  const editCategory = this.formEditData.get('editCategory')!.value;

  const editId = this.calendarEvents.findIndex(
    (x) => x.id + '' === this.editEvent.id + ''
  );

  this.editEvent.setProp('title', editTitle);
  this.editEvent.setProp('classNames', editCategory);

  this.calendarEvents[editId] = {
    ...this.editEvent,
    title: editTitle,
    id: this.editEvent.id,
    classNames: editCategory,
  };
  this.Editposition();
  this.formEditData = this.formBuilder.group({
    editTitle: '',
    editCategory: '',
  });
  this.modalService.dismissAll();
}

/**
 * Delete-confirm
 */
confirm() {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You won\'t be able to revert this!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#34c38f',
    cancelButtonColor: '#f46a6a',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.value) {
      this.deleteEventData();
      Swal.fire('Deleted!', 'Event has been deleted.', 'success');
    }
  });
}

/**
 * Delete event
 */
deleteEventData() {
  this.editEvent.remove();
  this.modalService.dismissAll();
}


}
