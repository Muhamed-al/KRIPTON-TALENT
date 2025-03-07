import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Task } from "../models/task.model";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
@Injectable({
  providedIn: "root",
})
export class TaskService {
  readonly BASE_URL: string = environment.baseURL + "api/tasks";

  constructor(private http: HttpClient) {}
  /**
   *
   * @param task
   * @param creator
   * @param assignedTo
   * @returns
   */
  addTask(task: Task, projectId: any): Observable<Task> {
    const taskBodyRequest: any = {
      taskDto: task,
    };
    return this.http.post<Task>(
      this.BASE_URL + `/project/${projectId}`,
      taskBodyRequest
    );
  }
  /**
   *
   * @param params
   * @returns
   */
  getAllTasks(params: any): Observable<Array<Task>> {
    if (params === null || params === undefined) {
      params = "createdAt";
    }
    let queryParams = { sortByAttribute: params };
    if (params) {
      queryParams = {
        ...queryParams,
        ...params,
      };
    }
    const httpParams = new HttpParams({ fromObject: queryParams });
    return this.http.get<Array<Task>>(this.BASE_URL, { params: httpParams });
  }
  /**
   *
   * @param params
   * @returns
   */
  getAllTasksByProject(params: any, projectId: any): Observable<Array<Task>> {
    if (params === null || params === undefined) {
      params = "createdAt";
    }
    let queryParams = { sortByAttribute: params };
    if (params) {
      queryParams = {
        ...queryParams,
        ...params,
      };
    }
    const httpParams = new HttpParams({ fromObject: queryParams });
    return this.http.get<Array<Task>>(this.BASE_URL + `/${projectId}`, {
      params: httpParams,
    });
  }
  /**
   *
   * @param userId
   * @returns
   */
  getTasksByUser(
    userId: string,
    projectId: any,
    params: any
  ): Observable<Array<Task>> {
    if (params === null || params === undefined) {
      params = "createdAt";
    }
    let queryParams = { sortByAttribute: params };
    if (params) {
      queryParams = {
        ...queryParams,
        ...params,
      };
    }
    const httpParams = new HttpParams({ fromObject: queryParams });
    return this.http.get<Array<Task>>(
      this.BASE_URL + `/project/${projectId}/user/${userId}`,
      {
        params: httpParams,
      }
    );
  }
  /**
   *
   * @param tasks
   * @returns
   */
  deleteTask(tasks: [number]): Observable<any> {
    return this.http.delete(this.BASE_URL + `/delete`, { body: tasks });
  }
  /**
   *
   * @param taskId
   * @param task
   * @returns
   */
  updateTask(taskId: number, task: Task): Observable<Task> {
    return this.http.put(this.BASE_URL + `/update/${taskId}`, task);
  }

  assignTasksToUser(tasks: [number], userId: string): Observable<any> {
    return this.http.put(this.BASE_URL + `/assign-to-user/${userId}`, tasks);
  }

  getTasksByCreator(creatorId: string, params: any): Observable<Array<Task>> {
    if (params === null || params === undefined) {
      params = "createdAt";
    }
    let queryParams = { sortByAttribute: params };
    if (params) {
      queryParams = {
        ...queryParams,
        ...params,
      };
    }
    const httpParams = new HttpParams({ fromObject: queryParams });
    return this.http.get<Array<Task>>(this.BASE_URL + `/creator/${creatorId}`, {
      params: httpParams,
    });
  }

  getTasksWithDeadlineBetweenTwoDates(
    start: Date,
    end: Date
  ): Observable<Array<Task>> {
    const queryParams = { start: start.toISOString(), end: end.toISOString() };
    const httpParams = new HttpParams({ fromObject: queryParams });

    return this.http.get<Task[]>(`${this.BASE_URL}/tasks-between`, {
      params: httpParams,
    });
  }
  getTasksWithDeadlineBefore(date: Date): Observable<Array<Task>> {
    const queryParams = { date: date.toISOString() };
    const httpParams = new HttpParams({ fromObject: queryParams });

    return this.http.get<Task[]>(`${this.BASE_URL}/tasks-before`, {
      params: httpParams,
    });
  }

  setTaskCompleted(taskId: number): Observable<any> {
    return this.http.put(this.BASE_URL + `/completed/${taskId}`, null);
  }
  setTaskInProgress(taskId: number): Observable<any> {
    return this.http.put(this.BASE_URL + `/in-progress/${taskId}`, null);
  }

  getStatsOfProject(projectId: any): Observable<any> {
    return this.http.get(this.BASE_URL + `/stats/${projectId}`);
  }
}
