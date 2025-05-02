// values that are const but aren't that important to hide in env

export const UserRolesEnum = {
    ADMIN : "admin",
    PROJECT_ADMIN : "project-admin",
    MEMBER : "member"
}

export const AvailableUserRoles = Object.values(UserRolesEnum);

export const TaskStatusEnum = {
    TODO : "todo",
    IN_PROGRESS : "in-progress",
    DONE : "done",
}