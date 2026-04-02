import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Select,
  SelectItem,
} from "@heroui/react";
import React, { FormEvent, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { LiaGrinStars } from "react-icons/lia";
import { companyService } from "@/app/api/companyService";
import { userService } from "@/app/api/userService";
import { SHA512 } from "crypto-js";
import { MdOutlineAdd } from "react-icons/md";
import { permissionsService } from "@/app/api/permissionsService";
import { Permission } from "@/app/types/permission.types";
import { plansService } from "@/app/api/plansService";

type CompanyOption = {
  id: number;
  name: string;
};

type PlanOption = {
  id: number;
  name: string;
};

type RoleOption = {
  id: number;
  name: string;
};

const ADMIN_ROLE_NAME = "Administrador";

function NewUserModal({ isOpen, onOpenChange, onClose }) {
  //User data
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [plan, setPlan] = useState("");
  const [lastClientPlan, setLastClientPlan] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [addCompany, setAddCompany] = useState(false);
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>(
    [],
  );

  //company data
  const [companyName, setCompanyName] = useState("");
  const [socialReason, setSocialReason] = useState("");
  const [companyRut, setCompanyRut] = useState("");
  const [address, setAddress] = useState("");
  const [common, setCommon] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState("");

  const closeModal = () => {
    setName("");
    setRut("");
    setEmail("");
    setCompany("");
    setPlan("");
    setLastClientPlan("");
    setRole("");
    setPassword("");
    setSocialReason("");
    setCompanyRut("");
    setAddress("");
    setCommon("");
    setPhone("");
    setBusiness("");
    setCompanyName("");
    setAvailablePermissions([]);
    setSelectedPermissionIds([]);
    onClose();
  };

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const selectedRole = roles.find(
    (roleOption) => String(roleOption.id) === role,
  );
  const isAdministratorRole = selectedRole?.name === ADMIN_ROLE_NAME;
  const adminPermissions = useMemo(
    () =>
      allPermissions.filter((permission) => permission.category === "admin"),
    [allPermissions],
  );

  const formatRut = (rut: string) => {
    const clean = rut.replace(/[^0-9kK]/g, "").toUpperCase();
    if (clean.length <= 1) return clean;
    const cuerpo = clean.slice(0, -1);
    const dv = clean.slice(-1);
    return `${cuerpo}-${dv}`;
  };

  const formatCel = (input) => {
    let clean = input.replace(/[^0-9]/g, "");
    clean = clean.replace(/^56/, "").replace(/^9/, "");
    if (clean.length === 0) return "+569 ";
    if (clean.length <= 4) {
      return `+569 ${clean}`;
    }
    const parte1 = clean.slice(0, 4);
    const parte2 = clean.slice(4, 8);
    return `+569 ${parte1}${parte2 ? " " + parte2 : ""}`;
  };

  const validateRut = (rut: string) => {
    if (!rut) return false;
    rut = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    if (rut.length < 2) return false;
    const cuerpo = rut.slice(0, -1);
    const dv = rut.slice(-1);
    if (!/^\d+$/.test(cuerpo)) return false;
    let suma = 0;
    let multiplo = 2;
    for (let i = cuerpo.length - 1; i >= 0; i--) {
      suma += parseInt(cuerpo[i], 10) * multiplo;
      multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }
    const dvEsperado = 11 - (suma % 11);
    const dvCalculado =
      dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();
    return dvCalculado === dv;
  };

  const validateUserFields = () => {
    if (name == "") {
      return false;
    }
    if (rut == "" || !validateRut(rut)) {
      return false;
    }
    if (company == "" && !addCompany) {
      return false;
    }
    if (email == "") {
      return false;
    }
    if (password == "") {
      return false;
    }
    if (!isAdministratorRole && plan == "") {
      return false;
    }
    if (role == "") {
      return false;
    }
    return true;
  };

  const validateComanyFields = () => {
    if (addCompany) {
      if (socialReason == "") {
        return false;
      }
      if (address == "") {
        return false;
      }
      if (business == "") {
        return false;
      }
      if (phone == "") {
        return false;
      }
      if (common == "") {
        return false;
      }
      if (companyRut == "" || !validateRut(companyRut)) {
        return false;
      }
      if (companyName == "") {
        return false;
      }
    }

    return true;
  };

  const validateFields = () => {
    return validateUserFields() && validateComanyFields();
  };

  useEffect(() => {
    const getCompanies = async () => {
      const companies = await userService.getAllCompanies();
      const roles = await userService.getAllRoles();
      const plans = await plansService.getAllPlans();
      const permissions = await permissionsService.getAllPermissions();
      setCompanies([...(companies ?? [])]);
      setPlans([...(plans ?? [])]);
      setRoles([...(roles ?? [])]);
      const normalizedPermissions = Array.isArray(permissions)
        ? permissions
        : Array.isArray(permissions?.data)
          ? permissions.data
          : [];
      setAllPermissions(normalizedPermissions);
    };

    getCompanies();
  }, []);

  useEffect(() => {
    if (isAdministratorRole) {
      if (plan) {
        setLastClientPlan(plan);
      }
      setPlan("");
      setAvailablePermissions(adminPermissions);
      setSelectedPermissionIds([]);
      return;
    }

    if (!role) {
      setAvailablePermissions([]);
      setSelectedPermissionIds([]);
      return;
    }

    if (!plan && lastClientPlan) {
      setPlan(lastClientPlan);
      return;
    }
    setAvailablePermissions([]);
    setSelectedPermissionIds([]);
  }, [adminPermissions, isAdministratorRole, lastClientPlan, plan, role]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      if (validateFields()) {
        console.log("Creamos usuario con empresa nueva");
        const rutData = rut.split("-");
        if (addCompany) {
          const companyRutData = companyRut.split("-");
          const newCompany = await companyService.createCompany({
            name: companyName,
            socialReason: socialReason,
            address: address,
            business: business,
            rut: companyRutData[0],
            dv: companyRutData[1],
            phone: phone.replace(/\s+/g, ""),
            common: common,
          });
          if (!newCompany) {
            toast("Error al crear la empresa", {
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
          const createdUser = await userService.createNewClient({
            username: name,
            password: SHA512(password).toString(),
            email: email,
            rut: rutData[0],
            dv: rutData[1],
            company: newCompany.id,
            plan: plan,
            role: role,
          });
          const createdUserId = createdUser?.user_id ?? createdUser?.id;
          if (
            isAdministratorRole &&
            createdUserId &&
            selectedPermissionIds.length > 0
          ) {
            await userService.assignPermissions(createdUserId, selectedPermissionIds);
          }
        } else {
          console.log("Creamos usuario con empresa existente");
          const createdUser = await userService.createNewClient({
            username: name,
            password: SHA512(password).toString(),
            email: email,
            rut: rutData[0],
            dv: rutData[1],
            company: parseInt(company),
            plan: plan,
            role: role,
          });
          const createdUserId = createdUser?.user_id ?? createdUser?.id;
          console.log(`Condiciones: isAdministratorRole: ${isAdministratorRole}, createdUserId: ${createdUserId}, selectedPermissionIds: ${selectedPermissionIds}`);
          if (
            isAdministratorRole &&
            createdUserId &&
            selectedPermissionIds.length > 0
          ) {
            console.log("Asignamos permisos al usuario creado: ", selectedPermissionIds);
            await userService.assignPermissions(createdUserId, selectedPermissionIds);
          }
        }
        toast("Nuevo usuario creado con exito", {
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
        closeModal();
        onClose();
      }
    } catch {
      toast("Ocurrio un fallo al crear el usuario", {
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
        backdrop: "backdrop-blur-sm"
      }}
      className="h-fit min-h-[369px] py-[13px] gap-[16px]"
    >
      <ModalContent className="w-full items-center">
          <ModalHeader className="flex h-[24px] w-[548px] items-center justify-start gap-1 text-[16px] font-[500] text-[#372AAC] p-[3]">
            Nuevo cliente
          </ModalHeader>
          <ModalBody className="flex w-[548px] items-center justify-start p-[-10px]">
            <form
              className="w-full"
              autoComplete="off"
              onSubmit={async (e) => {
                handleSubmit(e);
              }}
            >
              <div className="grid w-full grid-cols-2 grid-rows-3 text-[12px] font-[400] text-darkPurple">
                <div className="w-full px-1 py-1">
                  <p>Nombre</p>
                  <input
                    maxLength={30}
                    name="random"
                    autoComplete="off"
                    className="h-[32px] w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                    placeholder="Nombre"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="w-full px-1 py-1">
                  <p>Rut</p>
                  <input
                    maxLength={10}
                    name="random"
                    autoComplete="off"
                    className="h-[32px] w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                    placeholder="XXXXXXXX-X"
                    value={rut}
                    onChange={(e) => {
                      setRut(formatRut(e.target.value));
                    }}
                  ></input>
                </div>
                <div className="w-full px-1 py-1">
                  <p>E-mail</p>
                  <input
                    maxLength={50}
                    type="text"
                    name="random"
                    autoComplete="off"
                    className="h-[32px] w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="w-full px-1 py-1">
                  <p>Password</p>
                  <input
                    maxLength={30}
                    name="random"
                    autoComplete="off"
                    className="h-[32px] w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                    placeholder="********"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                  ></input>
                </div>

                <div className="w-full px-1 py-1">
                  <p>Plan</p>
                  <Select
                    disallowEmptySelection={!isAdministratorRole}
                    isDisabled={isAdministratorRole}
                    onChange={(e) => {
                      setPlan(e.target.value);
                      setLastClientPlan(e.target.value);
                    }}
                    aria-label="random"
                    placeholder={isAdministratorRole ? "Sin plan" : "Plan"}
                    classNames={{
                      base: [" h-[32px] text-[14px] font-[400]"],
                      trigger: [
                        "min-h-[0px] h-[32px] rounded-[5px] border bg-white shadow-none",
                      ],

                      listbox: ["text-darkPurple rounded-[5px] "],
                      popoverContent: ["rounded-[5px]"],
                      value: [
                        "group-data-[has-value=true]:text-[13px] group-data-[has-value=true]:text-darkPurple font-[400] text-[13px]",
                      ],
                    }}
                  >
                    {isAdministratorRole ? (
                      <SelectItem
                        key="sin-plan"
                        className="rounded-[5px] text-[13px]"
                      >
                        Sin plan
                      </SelectItem>
                    ) : (
                      plans.map((plan) => (
                      <SelectItem
                        key={plan.id}
                        className="rounded-[5px] text-[13px] data-[selectable=true]:text-[13px] data-[selectable=true]:focus:bg-[#442F8D] data-[selectable=true]:focus:text-white"
                      >
                        {plan.name}
                      </SelectItem>
                      ))
                    )}
                  </Select>
                </div>

                <div className="w-full px-1 py-1">
                  <p>Rol</p>
                  <Select
                  disallowEmptySelection
                    onChange={(e) => {
                      setRole(e.target.value);
                      console.log("Rol seleccionado: ", e.target.value);
                    }}
                    aria-label="random"
                    placeholder="Rol"
                    classNames={{
                      base: [" h-[32px]"],
                      trigger: [
                        "min-h-[0px] h-[32px] rounded-[5px] border bg-white shadow-none",
                      ],
                      listbox: ["text-darkPurple rounded-[5px] "],
                      popoverContent: ["rounded-[5px]"],
                      value: [
                        "group-data-[has-value=true]:text-[13px] group-data-[has-value=true]:text-darkPurple font-[400] text-[13px]",
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

                <div className="w-full px-1 py-1">
                  <p>Empresa</p>
                  <Select
                    disallowEmptySelection
                    isDisabled={addCompany}
                    onChange={(e) => {
                      console.log("Empresa seleccionada: ", e.target.value);
                      setCompany(e.target.value);
                    }}
                    aria-label="random"
                    placeholder="Empresa"
                    classNames={{
                      base: [" h-[32px] text-[14px] font-[400]"],
                      trigger: [
                        "min-h-[0px] h-[32px] rounded-[5px] border bg-white shadow-none",
                      ],

                      listbox: ["text-darkPurple rounded-[5px] "],
                      popoverContent: ["rounded-[5px]"],
                      value: [
                        "group-data-[has-value=true]:text-[13px] group-data-[has-value=true]:text-darkPurple font-[400] text-[13px]",
                      ],
                    }}
                  >
                    {companies.map((company) => (
                      <SelectItem
                        key={company.id}
                        className="rounded-[5px] text-[13px] data-[selectable=true]:text-[13px] data-[selectable=true]:focus:bg-[#442F8D] data-[selectable=true]:focus:text-white"
                      >
                        {company.name}
                      </SelectItem>
                    ))}
                  </Select>
                </div>
              </div>

              <div
                onClick={() => {
                  setAddCompany(!addCompany);
                  setSocialReason("");
                  setCompanyRut("");
                  setAddress("");
                  setCommon("");
                  setPhone("");
                  setBusiness("");
                  setCompany("");
                }}
                className="my-2 flex items-center gap-1 text-[#372AAC] hover:cursor-pointer"
              >
                <MdOutlineAdd color="#372AAC" />
                Nueva empresa
              </div>
              {!addCompany ? (
                <></>
              ) : (
                <div className="grid w-full grid-cols-2 grid-rows-4 gap-1 text-[12px] font-[400] text-darkPurple">
                  <div className="w-full px-1 py-1">
                    <p>Nombre</p>
                    <input
                      maxLength={30}
                      name="random"
                      autoComplete="off"
                      className="h-[32px] w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                      placeholder="Nombre"
                      value={companyName}
                      onChange={(e) => {
                        setCompanyName(e.target.value);
                      }}
                    ></input>
                  </div>
                  <div className="w-full px-1 py-1">
                    <p>Rut</p>
                    <input
                      maxLength={10}
                      name="random"
                      autoComplete="off"
                      className="h-[32px] w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                      placeholder="XXXXXXXX-X"
                      value={companyRut}
                      onChange={(e) => {
                        setCompanyRut(formatRut(e.target.value));
                      }}
                    ></input>
                  </div>
                  <div className="w-full px-1 py-1">
                    <p>Domicilio</p>
                    <input
                      maxLength={30}
                      name="random"
                      autoComplete="off"
                      className="h-[32px] w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                      placeholder="Calle Falsa 123"
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                      }}
                    ></input>
                  </div>
                  <div className="w-full px-1 py-1">
                    <p>Comuna</p>
                    <input
                      maxLength={30}
                      name="random"
                      autoComplete="off"
                      className="h-[32px] w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                      placeholder="Providencia"
                      value={common}
                      onChange={(e) => {
                        setCommon(e.target.value);
                      }}
                    ></input>
                  </div>
                  <div className="w-full px-1 py-1">
                    <p>Giro del negocio</p>
                    <input
                      maxLength={30}
                      name="random"
                      autoComplete="off"
                      className="h-[32px] w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                      placeholder="Automotriz"
                      value={business}
                      onChange={(e) => {
                        setBusiness(e.target.value);
                      }}
                    ></input>
                  </div>
                  <div className="w-full px-1 py-1">
                    <p>Razon social</p>
                    <input
                      maxLength={30}
                      name="random"
                      autoComplete="off"
                      className="h-[32px] w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                      placeholder="Comercio"
                      value={socialReason}
                      onChange={(e) => {
                        setSocialReason(e.target.value);
                      }}
                    ></input>
                  </div>
                  <div className="w-full px-1 py-1">
                    <p>Celular</p>
                    <input
                      name="random"
                      autoComplete="off"
                      className="h-[32px] w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                      placeholder="+569 XXXX XXXX"
                      value={phone}
                      onChange={(e) => {
                        setPhone(formatCel(e.target.value));
                      }}
                    ></input>
                  </div>
                </div>
              )}

              <div className="mt-3">
                <p className="text-[14px] font-[500] text-[#251D3F]">Permisos</p>
                {!role ? (
                  <p className="mt-2 text-[12px] text-[#6E668D]">
                    Selecciona un rol para cargar los permisos asignables.
                  </p>
                ) : isAdministratorRole ? (
                  availablePermissions.length === 0 ? (
                    <p className="mt-2 text-[12px] text-[#6E668D]">
                      No hay permisos de categoría admin disponibles.
                    </p>
                  ) : (
                    <div className="mt-2 grid w-full grid-cols-2 gap-[9px] pl-2">
                      {availablePermissions.map((permission) => (
                        <label
                          key={permission.id}
                          className="flex items-center gap-2 text-[14px] font-[400] text-[#251D3F]"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPermissionIds.includes(permission.id)}
                            onChange={() => handlePermissionToggle(permission.id)}
                            className="h-[16px] w-[16px] accent-[#372AAC]"
                          />
                          <span>{permission.name}</span>
                        </label>
                      ))}
                    </div>
                  )
                ) : !plan ? (
                  <p className="mt-2 text-[12px] text-[#6E668D]">
                    Selecciona un plan para asignar automaticamente sus permisos al cliente.
                  </p>
                ) : (
                  <p className="mt-2 text-[12px] text-[#6E668D]">
                    Este usuario cliente recibira automaticamente todos los permisos asociados al plan seleccionado.
                  </p>
                )}
              </div>

              <div className="mt-3 flex h-[32px] items-center justify-end gap-2">
                <div
                  onClick={() => {
                    closeModal();
                  }}
                  className="flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] bg-black px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
                >
                  Cancelar
                </div>
                <button
                  disabled={!validateFields()}
                  type="submit"
                  className={`flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] ${!validateFields() ? "bg-gradient-to-r from-[#384DF699] to-[#987EE699]" : "bg-gradient-to-r from-[#384DF6] to-[#987EE6]"} px-4 text-[14px] font-[500] text-white hover:cursor-pointer`}
                >
                  Crear
                </button>
              </div>
            </form>
          </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default NewUserModal;
