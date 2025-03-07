import { Education } from "./education.models";
import { FileHandler } from "./file_handle.models";
import { Certification } from "./certification.models";
import { Experience } from "./experience.models";

export class Candidate {
  id?: number;
  firstName?: string;
  lastName?: string;
  designation?: string;
  description?: string;
  country?: string;
  city?: string;
  imagePath?: string;
  zipCode?: number | string;
  phone?: number | string;
  email?: string;
  dateOfBirth?: number | string;
  decision?: string;
  status?: string;
  source?: string;
  rating?: number;
  createdAt?: Date;
  modifiedAt?: Date;
  user?: string;
  completed?: boolean;
  educations?: Array<Education>;
  experiences?: Array<Experience>;
  certifications?: Array<Certification>;
  //to be able to use check uncheck all
  isSelected?: boolean;
  skills?: Array<string>;
  score?: number;
}
