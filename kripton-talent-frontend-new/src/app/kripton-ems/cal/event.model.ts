import { EmailAddress } from "../mailbox/mailbox.model";

export class EventData {
  subject !: string;
  start !: EventDateTime;
  end !: EventDateTime;
  attendees !: Attendee[];
  isOnlineMeeting ?: boolean;
}


export class EventDateTime {
  dateTime ?: string;
  timeZone ?: string;
}

export class Attendee {
  emailAddress ?: EmailAddress;
}