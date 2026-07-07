// Роли и уровни доступа. По убыванию прав: OWNER > ADMIN > MANAGER > CLIENT.
export type Role = "OWNER" | "ADMIN" | "MANAGER" | "CLIENT";

export const ROLES: Role[] = ["OWNER", "ADMIN", "MANAGER", "CLIENT"];

export const ROLE_RANK: Record<Role, number> = {
  OWNER: 40,
  ADMIN: 30,
  MANAGER: 20,
  CLIENT: 10,
};

export const ROLE_LABEL: Record<Role, string> = {
  OWNER: "Владелец",
  ADMIN: "Администратор",
  MANAGER: "Менеджер",
  CLIENT: "Клиент",
};

export const ROLE_DESC: Record<Role, string> = {
  OWNER: "Полный доступ, управление администраторами",
  ADMIN: "Каталог, заказы, заявки, пользователи",
  MANAGER: "Каталог и заявки, без управления доступом",
  CLIENT: "Личный кабинет, без доступа к панели",
};

export function rank(role?: string | null): number {
  return ROLE_RANK[(role as Role) ?? "CLIENT"] ?? 0;
}

// Доступ в админ-панель — от менеджера и выше.
export const canAccessAdmin = (role?: string | null) => rank(role) >= ROLE_RANK.MANAGER;
// Управление каталогом — менеджер и выше.
export const canManageCatalog = (role?: string | null) => rank(role) >= ROLE_RANK.MANAGER;
// Управление пользователями — администратор и выше.
export const canManageUsers = (role?: string | null) => rank(role) >= ROLE_RANK.ADMIN;
// Назначать роли OWNER/ADMIN может только владелец.
export const canAssignPrivileged = (role?: string | null) => rank(role) >= ROLE_RANK.OWNER;

// Какие роли текущий пользователь вправе назначать другим.
export function assignableRoles(role?: string | null): Role[] {
  if (rank(role) >= ROLE_RANK.OWNER) return ["ADMIN", "MANAGER", "CLIENT", "OWNER"];
  if (rank(role) >= ROLE_RANK.ADMIN) return ["MANAGER", "CLIENT"];
  return [];
}
