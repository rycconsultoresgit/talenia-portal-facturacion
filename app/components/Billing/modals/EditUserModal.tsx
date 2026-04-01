import { plansService } from "@/app/api/plansService";
import { permissionsService } from "@/app/api/permissionsService";
import { userService } from "@/app/api/userService";
import { Permission } from "@/app/types/permission.types";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Switch,
  Select,
  SelectItem,
} from "@heroui/react";
import { SHA512 } from "crypto-js";
import React, { useEffect, useMemo, useState } from "react";
import { LiaGrinStars } from "react-icons/lia";
import { toast } from "sonner";

type PlanOption = {
  id?: number;
  key?: number | string;
  name?: string;
  label?: string;
};

type RoleOption = {
  id: number;
  name: string;
};

const CLIENT_ROLE_NAME = "Cliente";
const ADMIN_ROLE_NAME = "Administrador";

function EditUserModal({ user, isOpen, onOpenChange, onClose }) {
  const [role, setRole] = useState("");
  const [newUserName, setNewUserName] = useState(user?.username ?? "");
  const [newEmail, setNewEmail] = useState(user?.email ?? "");
  const [newPassword, setNewPassword] = useState("");
  const [newStatus, setnewStatus] = useState(user?.status);
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [clientPermissions, setClientPermissions] = useState<Permission[]>([]);
  const [selectedAdminPermissionIds, setSelectedAdminPermissionIds] = useState<
    number[]
  >([]);

  const effectiveRoleName = useMemo(() => {
    const selectedRole = roles.find(
      (roleOption) => String(roleOption.id) === role,
    );

    return selectedRole?.name ?? user?.role?.name ?? "";
  }, [role, roles, user?.role?.name]);

  const isClientRole = effectiveRoleName === CLIENT_ROLE_NAME;
  const isAdminRole = effectiveRoleName === ADMIN_ROLE_NAME;
  const adminPermissions = useMemo(
    () =>
      allPermissions.filter((permission) => permission.category === "admin"),
    [allPermissions],
  );

  useEffect(() => {
    setNewUserName(user?.username ?? "");
    setNewEmail(user?.email ?? "");
    setNewPassword("");
    setnewStatus(user?.status);
    setRole("");
  }, [user]);

  useEffect(() => {
    const loadOptions = async () => {
      const rolesResponse = await userService.getAllRoles();
      const plansResponse = await plansService.getAllPlans();
      const permissionsResponse = await permissionsService.getAllPermissions();
      const normalizedPlans = Array.isArray(plansResponse)
        ? plansResponse
        : Array.isArray(plansResponse?.data)
          ? plansResponse.data
          : [];
      const normalizedRoles = Array.isArray(rolesResponse)
        ? rolesResponse
        : Array.isArray(rolesResponse?.data)
          ? rolesResponse.data
          : [];
      const normalizedPermissions = Array.isArray(permissionsResponse)
        ? permissionsResponse
        : Array.isArray(permissionsResponse?.data)
          ? permissionsResponse.data
          : [];

      setPlans(normalizedPlans);
      setRoles(normalizedRoles);
      setAllPermissions(normalizedPermissions);
    };

    loadOptions();
  }, []);

  useEffect(() => {
    const loadUserPermissions = async () => {
      if (!isOpen || !user?.user_id) {
        setSelectedAdminPermissionIds([]);
        return;
      }

      const fullUser = await userService.getUserById(user.user_id);
      const permissionIds = Array.isArray(fullUser?.permissions)
        ? fullUser.permissions
            .filter((permission: Permission) => permission.category === "admin")
            .map((permission: Permission) => permission.id)
        : [];

      setSelectedAdminPermissionIds(permissionIds);
    };

    loadUserPermissions();
  }, [isOpen, user?.user_id]);

  useEffect(() => {
    const loadPlanPermissions = async () => {
      if (!isOpen || !isClientRole || !user?.plan?.id) {
        setClientPermissions([]);
        return;
      }

      try {
        const plan = await plansService.getPlanById(user.plan.id);
        const permissions = Array.isArray(plan?.permissions)
          ? plan.permissions
              .map((permission) => ({
                id: permission.id,
                name: permission.name,
                description: permission.description,
                category:
                  (permission as Permission & { categiory?: string }).category ??
                  (permission as Permission & { categiory?: string }).categiory ??
                  "",
              }))
              .filter((permission) => permission.category === "client")
          : [];

        setClientPermissions(permissions);
      } catch (error) {
        console.log("Error al cargar permisos del plan:", error);
        setClientPermissions([]);
      }
    };

    loadPlanPermissions();
  }, [isClientRole, isOpen, user?.plan?.id]);

  const handleAdminPermissionToggle = (permissionId: number) => {
    setSelectedAdminPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const handleSubmit = async () => {
    try {
      let updateObject = {};

      if (newUserName && newUserName !== user?.username) {
        updateObject = { ...updateObject, username: newUserName };
      }

      if (newEmail && newEmail !== user?.email) {
        updateObject = { ...updateObject, email: newEmail };
      }

      if (newStatus !== undefined && newStatus !== user?.status) {
        updateObject = { ...updateObject, status: newStatus };
      }

      if (role !== "" && role !== String(user?.role?.id)) {
        updateObject = { ...updateObject, role };
      }

      if (newPassword !== "") {
        updateObject = {
          ...updateObject,
          password: SHA512(newPassword).toString(),
        };
      }

      if (Object.keys(updateObject).length !== 0) {
        await userService.updateInfoClient(user.user_id, updateObject);
      }

      if (isAdminRole && user?.user_id) {
        await userService.assignPermissions(
          user.user_id,
          selectedAdminPermissionIds,
        );
      }

      toast("Usuario editado con exito", {
        icon: <LiaGrinStars color="#372AAC" size={16} />,
        duration: 2000,
        style: {
          background: "#FFFFFF",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          width: "280px",
        },
      });

      onClose();
    } catch {
      toast("Error al editar el usuario", {
        icon: <LiaGrinStars color="#372AAC" size={16} />,
        duration: 2000,
        style: {
          background: "#FFFFFF",
          display: "flex",
          justifyContent: "start",
          alignItems: "center",
          width: "280px",
        },
      });
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      size="xl"
      backdrop="blur"
      classNames={{
        base: "bg-white/80",
        backdrop: "backdrop-blur-sm",
      }}
      className="h-fit w-[580px] max-w-[580px] rounded-[10px] px-[16px] py-[13px]"
    >
      <ModalContent className="w-[580px] max-w-[580px] rounded-[10px] bg-white/70 shadow-lg backdrop-blur-md">
        <ModalHeader className="flex min-h-[24px] w-full items-center justify-start px-0 pt-0 text-[16px] font-[500] text-[#372AAC]">
          Editar usuario
        </ModalHeader>
        <ModalBody className="w-full px-0 py-0">
          <div className="flex w-full flex-col gap-[10px]">
            <div className="grid w-full grid-cols-2 gap-x-[12px] gap-y-[8px] text-[12px] font-[400] text-darkPurple">
              <div className="w-full">
                <p>Nombre</p>
                <input
                  className="mt-1 h-[38px] w-full rounded-[6px] border border-transparent bg-white px-3 py-2 text-[14px] text-darkPurple focus:outline-none"
                  placeholder={user?.username}
                  value={newUserName}
                  onChange={(e) => {
                    setNewUserName(e.target.value);
                  }}
                />
              </div>
              <div className="w-full">
                <p>Rut</p>
                <input
                  disabled={true}
                  className="mt-1 h-[38px] w-full rounded-[6px] border border-transparent bg-white px-3 py-2 text-[14px] text-darkPurple focus:outline-none"
                  placeholder={`${user?.rut} - ${user?.dv}`}
                />
              </div>
              <div className="w-full">
                <p>E-mail</p>
                <input
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                  }}
                  className="mt-1 h-[38px] w-full rounded-[6px] border border-transparent bg-white px-3 py-2 text-[14px] text-darkPurple focus:outline-none"
                  placeholder={user?.email}
                />
              </div>
              <div className="w-full">
                <p>Rol</p>
                <Select
                  onChange={(e) => {
                    setRole(e.target.value);
                  }}
                  aria-label="random"
                  placeholder="Seleccionar rol"
                  classNames={{
                    base: ["mt-1 h-[38px]"],
                    trigger: [
                      "min-h-[0px] h-[38px] rounded-[6px] border border-transparent bg-white shadow-none",
                    ],
                    listbox: ["text-darkPurple rounded-[5px] "],
                    popoverContent: ["rounded-[5px]"],
                    value: [
                      "group-data-[has-value=true]:text-[14px] group-data-[has-value=true]:text-darkPurple font-[400] text-[14px]",
                    ],
                  }}
                >
                  {roles.map((role) => (
                    <SelectItem
                      key={role.id}
                      className="rounded-[5px] text-[13px] data-[selectable=true]:text-[13px] data-[selectable=true]:focus:bg-[#442F8D] data-[selectable=true]:focus:text-white"
                    >
                      {role.name}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="w-full">
                <p>Plan</p>
                <Select
                  isDisabled={true}
                  aria-label="random"
                  placeholder="Seleccionar un plan"
                  classNames={{
                    base: ["mt-1 h-[38px] text-[14px] font-[400]"],
                    trigger: [
                      "min-h-[0px] h-[38px] rounded-[6px] border border-transparent bg-white shadow-none",
                    ],
                    listbox: ["text-darkPurple rounded-[5px] "],
                    popoverContent: ["rounded-[5px]"],
                    value: [
                      "group-data-[has-value=true]:text-[14px] group-data-[has-value=true]:text-darkPurple font-[400] text-[14px]",
                    ],
                  }}
                >
                  {plans.map((plan) => (
                    <SelectItem
                      key={plan.id ?? plan.key}
                      textValue={plan.name ?? plan.label}
                      className="rounded-[5px] text-[13px] data-[selectable=true]:text-[13px] data-[selectable=true]:focus:bg-[#442F8D] data-[selectable=true]:focus:text-white"
                    >
                      {plan.name ?? plan.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="w-full">
                <p>Contraseña</p>
                <input
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                  }}
                  className="mt-1 h-[38px] w-full rounded-[6px] border border-transparent bg-white px-3 py-2 text-[14px] text-darkPurple focus:outline-none"
                  placeholder="********"
                />
              </div>
            </div>

            <p className="text-[14px] text-[#947CE7]">
              *El cambio de plan se hará efectivo al comenzar la próxima
              facturación.
            </p>

            <div className="flex items-center justify-start">
              <Switch
                defaultSelected={newStatus == 1}
                onChange={() => {
                  setnewStatus(newStatus == 1 ? 0 : 1);
                }}
              >
                <p className="text-[14px] font-[400] text-darkPurple">
                  Habilitado
                </p>
              </Switch>
            </div>

            {isClientRole ? (
              <div className="flex flex-col gap-[12px]">
                <p className="text-[14px] font-[500] text-darkPurple">
                  Permisos
                </p>
                <div className="border-t border-white/80 pt-[12px]">
                  {clientPermissions.length === 0 ? (
                    <p className="text-[12px] text-[#6E668D]">
                      El plan actual no tiene permisos de cliente configurados.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-x-[16px] gap-y-[10px]">
                      {clientPermissions.map((permission) => (
                        <label
                          key={permission.id}
                          className="flex items-center gap-2 text-[14px] text-[#4A3CB0]"
                        >
                          <input
                            type="checkbox"
                            checked={true}
                            disabled={true}
                            className="h-[16px] w-[16px] accent-[#4A3CB0]"
                          />
                          <span>{permission.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {isAdminRole ? (
              <div className="flex flex-col gap-[12px]">
                <p className="text-[14px] font-[500] text-darkPurple">
                  Permisos
                </p>
                <div className="border-t border-white/80 pt-[12px]">
                  {adminPermissions.length === 0 ? (
                    <p className="text-[12px] text-[#6E668D]">
                      No hay permisos de categoria admin configurados.
                    </p>
                  ) : (
                    <div className="grid grid-cols-3 gap-x-[16px] gap-y-[10px]">
                      {adminPermissions.map((permission) => (
                        <label
                          key={permission.id}
                          className="flex items-center gap-2 text-[14px] text-[#4A3CB0]"
                        >
                          <input
                            type="checkbox"
                            checked={selectedAdminPermissionIds.includes(
                              permission.id,
                            )}
                            onChange={() =>
                              handleAdminPermissionToggle(permission.id)
                            }
                            className="h-[16px] w-[16px] accent-[#4A3CB0]"
                          />
                          <span>{permission.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <div className="flex items-center justify-end gap-[10px] pt-[4px]">
              <div
                onClick={() => {
                  setNewPassword("");
                  setNewEmail(user?.email ?? "");
                  setNewUserName(user?.username ?? "");
                  setnewStatus(user?.status);
                  onClose();
                }}
                className="flex h-[40px] min-w-[124px] items-center justify-center rounded-[6px] bg-[#241B3C] px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
              >
                Cancelar
              </div>
              <div
                onClick={() => {
                  handleSubmit();
                }}
                className="flex h-[40px] min-w-[124px] items-center justify-center rounded-[6px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
              >
                Guardar
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default EditUserModal;
