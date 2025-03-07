import { Task } from "./task.model";

export class Project {
  id?: number;
  title?: any;
  description?: string;
  tasks?: [Task];
  isCollapsed?: any;
}
