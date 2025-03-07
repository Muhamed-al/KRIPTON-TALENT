import { Candidate } from "./candidate.models";
import { Job } from "./job.models";

export class JobApplication {
  id?: number;
  coverLetter?: string;
  availability?: string;
  desiredSalary?: number;
  createdAt?: Date;
  candidate?: Candidate;
  isSelected?: boolean = false;
  job?: Job;
}
