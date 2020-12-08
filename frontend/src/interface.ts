export enum Status {
  'Count me in !',
  'Next Time',
}

export interface Rsvp {
  name: string;
  email: string;
  phone: number;
  status: Status;
  createdBy: number;
  createdDt: Date;
  updatedBy?: number;
  updatedDt: Date;
}
