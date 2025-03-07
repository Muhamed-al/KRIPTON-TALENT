import { JobApplication } from "./jobApplication.models";
import { Experience } from "./experience.models";
import { Certification } from "./certification.models";
import { Education } from "./education.models";
import { Candidate } from "./candidate.models";

export class Job {
  id?: number;
  title?: string;
  description?: string;
  location?: string;
  company?: string;
  employmentType?: string;
  experienceLevel?: string;
  proposedSalary?: number;
  imagePath?: string;
  startDate?: Date;
  createdAt?: Date;
  modifiedAt?: Date;
  status?: string;
  isValidated?: boolean;
  jobApplications?: [JobApplication];
  requiredExperiences?: [Experience];
  requiredCertifications?: [Certification];
  requiredEducations?: [Education];
  isSelected?: boolean;
  candidateAssignedTo?: boolean | string;
  assignedCandidates?: Candidate[];
  requiredSkills?: Array<string>;
}
