export const ADMIN_PERMISSIONS = {
  BILLING: "Facturacion",
  MANAGE_USERS: "Gestionar usuarios",
  MANAGE_ROLES_PERMISSIONS: "Gestionar roles/permisos",
  MANAGE_PLANS: "Gestionar planes",
} as const;

export type AdminPermissionName =
  (typeof ADMIN_PERMISSIONS)[keyof typeof ADMIN_PERMISSIONS];
