import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: "MENUITEMS.MENU.TEXT",
    isTitle: true,
  },
  {
    id: 2,
    label: "Dashboard",
    icon: "ri-dashboard-2-line",
    link: "/ems",
  },

  {
    id: 4,
    label: "Jobs",
    icon: "ri-bubble-chart-fill",
    link: "/ems/jobs",
  },

  {
    id: 6,
    label: "Applications",
    icon: "ri-article-line",
    link: "/ems/jobs/applications",
  },

  {
    id: 8,
    label: "Candidates",
    icon: " ri-group-line",
    link: "/ems/candidates",
  },

  // {
  //   id: 10,
  //   label: "Tasks",
  //   icon: "ri-todo-line",
  //   link: "/ems/tasks",
  // },

  // {
  //   id: 12,
  //   label: "Mailbox",
  //   icon: " ri-mail-send-line",
  //   link: "/ems/mailbox",
  // },
  {
    id: 87,
    label: "Recommendation",
    link: "/ems/recommend",
    icon: "ri-repeat-one-line",
  },
  {
    id: 13,
    label: "Calendar",
    icon: "bx bx-calendar-plus",
    link: "/ems/calendar",
  },
];
