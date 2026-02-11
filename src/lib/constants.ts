export const ADMIN_USERS = ["Adam", "Admin___James", "Admin___Levi", "rt3rockydagoat95"];

export function isAdminUser(nickname: string | null): boolean {
  return nickname !== null && ADMIN_USERS.includes(nickname);
}
