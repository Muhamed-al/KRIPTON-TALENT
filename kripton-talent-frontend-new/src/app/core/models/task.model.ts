import { TaskUser } from "./task-user.models";

export class Task {
  id?: number;
  title?: string;
  description?: string;
  users?: [string];
  userDtos?: [TaskUser];
  creatorId?: string;
  status?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  deadline?: Date;
  priority?: string;
  isAssignedToLoggedInUser?: false;
}
