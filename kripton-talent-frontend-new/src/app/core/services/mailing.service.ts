import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { EmailPayload } from 'src/app/kripton-ems/mailbox/mailbox.model';
import { head } from 'lodash';
import { options } from '@fullcalendar/core/preact';
import { EventData } from 'src/app/kripton-ems/cal/event.model';
@Injectable({
  providedIn: 'root'
})
export class MailingService {
  readonly BASE_URL: string = "http://localhost:5000/";
  constructor(private http: HttpClient) { }



  getAllEmails(emailType: string):Observable<any>{
    return this.http.get(`${this.BASE_URL}/${emailType}`)
  }


  sendEmail(payload: EmailPayload): Observable<any> {

    return this.http.post(`${this.BASE_URL}/send_email`, payload, {headers:{"media-type":"html/text"}});
  }

///*********GET ALL EVENT FOR NEXT WEEEK  */
  getAllEventsForThisWeek():Observable<any>{
    return this.http.get(`${this.BASE_URL}events/nextweek`)
  }

  ///********SCHEDULE MEETING */
  createEvent(eventData: EventData): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<string>(`${this.BASE_URL}create_event`, eventData, { headers });
  }

  
}
