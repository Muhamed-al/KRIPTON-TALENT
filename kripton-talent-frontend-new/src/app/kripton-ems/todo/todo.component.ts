import { Component, ViewChild } from "@angular/core";

import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from "@angular/forms";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { MatTable } from "@angular/material/table";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

import Swal from "sweetalert2";

import { TaskService } from "src/app/core/services/task.service";
import { Task } from "src/app/core/models/task.model";
import { LoginService } from "src/app/core/services/login.service";
import { User } from "src/app/core/models/auth.models";
import { TaskUser } from "src/app/core/models/task-user.models";
import { UserManagementService } from "src/app/core/services/user-management.service";
import { ProjectService } from "src/app/core/services/project.service";
import { Project } from "src/app/core/models/project.models";

@Component({
  selector: "app-todo",
  templateUrl: "./todo.component.html",
  styleUrls: ["./todo.component.scss"],
})
export class TodoComponent {
  submitted = false;
  todoForm!: UntypedFormGroup;
  todoUpdateForm!: UntypedFormGroup;

  backgroundColors = [
    "bg-success",
    "bg-danger",
    "bg-primary",
    "bg-warning",
    "bg-secondary",
    "bg-info",
  ];

  // Project Section
  projectForm!: UntypedFormGroup;
  /**
   *
   * clean
   *
   *
   */
  tasksList!: Array<Task>;
  searchTerm!: string;
  sortByAttribute!: string;
  currentUser!: User;
  sortBySelect: string = "createdAt";
  sortByStatusSelect: string = "";
  originalTaskList!: Array<Task>;
  allUsers!: Array<TaskUser>;
  projectList!: Project[];
  selectedProject!: any;

  /**
   *
   *
   *
   *
   */
  constructor(
    private taskService: TaskService,
    private loginService: LoginService,
    private modalService: NgbModal,
    private formBuilder: UntypedFormBuilder,
    private userService: UserManagementService,
    private projectService: ProjectService
  ) {}

  @ViewChild("dataTable")
  table!: MatTable<any>;
  displayedColumns: string[] = [
    "task",
    "subItem",
    "dueDate",
    "status",
    "priority",
    "action",
  ];

  ngOnInit(): void {
    this.currentUser = this.loginService.currentUserValue;
    this.getProjects();

    this.todoForm = this.formBuilder.group({
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
      status: ["PENDING", [Validators.required]],
      deadline: ["", [Validators.required]],
      priority: ["MEDIUM", [Validators.required]],
      users: ["", [Validators.required]],
    });
    this.todoUpdateForm = this.formBuilder.group({
      id: [""],
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
      status: ["", [Validators.required]],
      deadline: ["", [Validators.required]],
      priority: ["", [Validators.required]],
      users: [""],
      creator: [""],
    });

    this.projectForm = this.formBuilder.group({
      title: ["", [Validators.required]],
      description: ["", [Validators.required]],
    });

    // Hamburger menu for when it gets smaller ...
    var isShowMenu = false;
    document.querySelectorAll(".file-menu-btn").forEach(function (item) {
      item.addEventListener("click", function (e) {
        e.preventDefault();
        isShowMenu = true;
        document.getElementById("menusidebar")?.classList.add("menubar-show");
      });
    });
    document
      .querySelector(".chat-wrapper")
      ?.addEventListener("click", function () {
        if (
          document
            .querySelector(".file-manager-sidebar")
            ?.classList.contains("menubar-show")
        ) {
          if (!isShowMenu) {
            document
              .querySelector(".file-manager-sidebar")
              ?.classList.remove("menubar-show");
          }
          isShowMenu = false;
        }
      });
  }

  todoTable(event: CdkDragDrop<any[]>): void {
    moveItemInArray(this.tasksList, event.previousIndex, event.currentIndex);
    this.table.renderRows();
  }

  /**
   * Delete Model Open
   */
  deleteId: any;
  confirm(content: any, id: any) {
    this.deleteId = id;
    this.modalService.open(content, { centered: true });
  }

  // Delete Data
  deleteData(id: any) {
    const taskArrayToBeDeleted: [number] = [id];
    this.taskService.deleteTask(taskArrayToBeDeleted).subscribe((res) => {
      this.getTasks(this.selectedProject?.id);
      this.getProjects();
    });
  }

  deleteProject(project: Project) {
    Swal.fire({
      title: "Are you sure you want to delete this project",
      icon: "warning",
      showCancelButton: true,
    })
      .then((sub) => {
        if (sub.isConfirmed) {
          this.projectService.deleteProject(project.id).subscribe((res) => {
            this.getProjects();
            this.selectedProject = null;
            this.tasksList = [];
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  /**
   * Open modal
   * @param content modal content
   */
  openModal(content: any) {
    this.submitted = false;
    this.todoForm.reset();
    this.modalService.open(content, { size: "md", centered: true });
  }

  /**
   * Form data get
   */
  get form() {
    return this.todoForm.controls;
  }

  toggleCollapseState(project: any) {
    this.selectedProject = project;
    this.getTasks(this.selectedProject?.id);
    project.isCollapsed = !project.isCollapsed;
    this.projectList.forEach((p) => {
      if (p !== project) {
        p.isCollapsed = true;
      }
    });
  }
  getProjects() {
    this.projectService.getAllProjects("createdAt").subscribe((res) => {
      this.projectList = res.map((project) => {
        return { ...project, isCollapsed: true };
      });
      console.log(res);
    });
  }
  getTasks(projectId: any) {
    if (this.currentUser?.id) {
      this.currentUser.status === "manager"
        ? this.taskService
            .getAllTasksByProject(this.sortBySelect, projectId)
            .subscribe((res: Array<Task>) => {
              this.tasksList = res;
              this.originalTaskList = res;

              this.userService.getUsersInEachRole().subscribe((users) => {
                this.allUsers = users
                  .map((user) => {
                    if (user.id === this.currentUser.id) {
                      user.isCurrentUser = true;
                    }
                    return user;
                  })
                  .filter((user) => user.role !== "candidate");
              });
            })
        : this.taskService
            .getTasksByUser(this.currentUser.id, projectId, this.sortBySelect)
            .subscribe((res) => {
              this.tasksList = res;
              this.originalTaskList = res;
            });
    }
  }
  sortChanged() {
    this.getTasks(this.selectedProject?.id);
  }

  sortStatusChanged() {
    this.sortByStatusSelect === ""
      ? this.getTasks(this.selectedProject?.id)
      : (this.tasksList = this.originalTaskList.filter(
          (task) => task.status?.toUpperCase() === this.sortByStatusSelect
        ));
  }
  searchForTasks() {
    this.searchTerm === ""
      ? this.getTasks(this.selectedProject?.id)
      : (this.tasksList = this.tasksList.filter(
          (task) =>
            task.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            task.description
              ?.toLowerCase()
              .includes(this.searchTerm.toLowerCase())
        ));
  }
  editTask(content: any, task: Task) {
    this.todoUpdateForm.controls["id"].setValue(task.id);
    this.todoUpdateForm.controls["deadline"].setValue(task.deadline);
    this.todoUpdateForm.controls["title"].setValue(task.title);
    this.todoUpdateForm.controls["status"].setValue(task.status);
    this.todoUpdateForm.controls["priority"].setValue(task.priority);
    this.todoUpdateForm.controls["description"].setValue(task.description);
    this.todoUpdateForm.controls["creator"].setValue(task.creatorId);
    this.todoUpdateForm.controls["users"].setValue(task.users);
    this.modalService.open(content, { size: "md", centered: true });
  }

  updateTask() {
    Swal.fire({
      title: "Are you Sure you want to update this task !",
      icon: "question",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.taskService
          .updateTask(
            this.todoUpdateForm.get("id")?.value,
            this.todoUpdateForm.value
          )
          .subscribe((res) => {
            this.modalService.dismissAll();
            console.log(res);
            this.getTasks(this.selectedProject?.id);
            this.getProjects();
            this.todoUpdateForm.reset();
          });
      }
    });
  }
  //this methods needs cleaning
  addTask() {
    if (this.todoForm.valid) {
      let task: Task = new Task();
      task.creatorId = this.currentUser.id;
      task.deadline = this.todoForm.get("deadline")?.value;
      task.users = this.todoForm.get("users")?.value;
      task.description = this.todoForm.get("description")?.value;
      task.status = this.todoForm.get("status")?.value;
      task.priority = this.todoForm.get("priority")?.value;
      task.title = this.todoForm.get("title")?.value;
      console.log(task);
      if (this.currentUser.id && task.users) {
        this.taskService
          .addTask(task, this.selectedProject.id)
          .subscribe((res) => {
            console.log(res);
            this.modalService.dismissAll();
            Swal.fire({
              title: "Task Added and assigned successfully !",
              icon: "success",
            });
            this.todoForm.reset();
            this.getTasks(this.selectedProject?.id);
            this.getProjects();
          });
      }
    }
  }

  checkUncheck(e: any, id: any) {
    let checkboxes: any = e.target.closest("tr").querySelector("#todo" + id);
    if (checkboxes.checked) {
      this.taskService.setTaskCompleted(id).subscribe((res) => {
        this.getTasks(this.selectedProject?.id);
      });
    } else {
      this.taskService.setTaskInProgress(id).subscribe((res) => {
        this.getTasks(this.selectedProject?.id);
      });
    }
  }

  //====== Project Section ======//
  /**
   * Open Project modal
   * @param projectcontent modal content
   */
  openProjectModal(projectcontent: any) {
    this.submitted = false;
    this.modalService.open(projectcontent, { size: "md", centered: true });
  }

  /**
   * Form data get
   */
  get projectform() {
    return this.projectForm.controls;
  }

  saveProject() {
    console.log(this.projectForm);
    this.projectService.addProject(this.projectForm.value).subscribe((res) => {
      this.modalService.dismissAll();
      this.projectForm.reset();
      Swal.fire({
        title: "New Project Added",
        icon: "success",
      }).then(() => {
        this.getProjects();
      });
    });
  }
}
