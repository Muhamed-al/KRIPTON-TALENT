
export interface Email {
  id: number;
  idEmail? : string;
  forId: any;
  unread?:any;
  name?: string;
  number: string;
  subject ?: string;
  badge?:any;
  badgeClass?:any;
  teaser?: string;
  date?: string;
  type: string;
  category: string;
  label: string;
  img: string;
  isIcon?: any;
}
export class FlaskEmail {
  bccRecipients?: string[];
  body?: Body;
  bodyPreview?: string;
  categories?: string[];
  ccRecipients?: string[];
  changeKey?: string;
  conversationId?: string;
  conversationIndex?: string;
  createdDateTime?: Date;
  flag?: Flag;
  from?: From;
  hasAttachments?: boolean;
  id?: string;
  importance?: string;
  inferenceClassification?: string;
  internetMessageId?: string;
  isDeliveryReceiptRequested: any;
  isDraft?: boolean;
  isRead?: boolean;
  isReadReceiptRequested?: boolean;
  lastModifiedDateTime?: Date;
  parentFolderId?: string;
  receivedDateTime?: Date;
  replyTo?: Object[];
  sender?: Sender;
  sentDateTime?: Date;
  subject?: string;
  toRecipients?: ToRecipient[];
  webLink?: string;
}

 
export class Body {
  content?: string;
  contentType?: string;
}



export class Flag {
  flagStatus?: string;
}

export class From {
  emailAddress?: EmailAddress;
}

export class Sender {
  emailAddress?: EmailAddress;
}

export class EmailAddress {
  address?: string;
  name?: string;
}
export class ToRecipient {
  emailAddress?: EmailAddress;
}

export interface EmailPayload {
  subject?: string;
  content: string;
  to_recipients: ToRecipient[];
}



export function mapFlaskEmailToAngularEmail(flaskEmail: FlaskEmail): Email {
  const fromEmailAddress = flaskEmail.from?.emailAddress || {};
  return {
    id: -1, // Provide an appropriate default value or generate it based on your requirements
    idEmail : flaskEmail.id,
    forId: flaskEmail.id,
    unread: flaskEmail.isRead, // You can provide a default value if needed
    name: fromEmailAddress.name || '', // Map from flaskEmail.from.emailAddress.name or any other relevant property
    number: '', // Map from flaskEmail.from.emailAddress.address or any other relevant property
    subject: flaskEmail.subject,
    teaser: flaskEmail.bodyPreview,
    date: flaskEmail.createdDateTime ? flaskEmail.createdDateTime.toString() : '', // Convert to the desired date format
    type: flaskEmail.inferenceClassification ? flaskEmail.inferenceClassification.toString() : '', // Map from flaskEmail.inferenceClassification or any other relevant property
    category: '', // Map from flaskEmail.categories or any other relevant property
    label: flaskEmail.importance ? flaskEmail.importance.toString() : '', // Map from flaskEmail.importance or any other relevant property
    img: '', // Map from flaskEmail.sender.emailAddress.img or any other relevant property
    isIcon: undefined, // You can provide a default value if needed
  };


}