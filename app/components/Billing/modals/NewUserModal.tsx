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
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function NewUserModal({ isOpen, onOpenChange, onClose }) {
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
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>(
    [],
  );
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>(
    [],
  );
  const [showErrors, setShowErrors] = useState(false);

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
    setShowErrors(false);
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

  const formatRut = (value: string) => {
    const clean = value.replace(/[^0-9kK]/g, "").toUpperCase();
    if (clean.length <= 1) {
      return clean;
    }
    const body = clean.slice(0, -1);
    const dv = clean.slice(-1);
    return `${body}-${dv}`;
  };

  const formatCel = (input) => {
    let clean = input.replace(/[^0-9]/g, "");
    clean = clean.replace(/^56/, "").replace(/^9/, "");
    if (clean.length === 0) return "+569 ";
    if (clean.length <= 4) {
      return `+569 ${clean}`;
    }
    const first = clean.slice(0, 4);
    const second = clean.slice(4, 8);
    return `+569 ${first}${second ? ` ${second}` : ""}`;
  };

  const validateRut = (value: string) => {
    if (!value) return false;
    const normalized = value.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    if (normalized.length < 2) return false;

    const body = normalized.slice(0, -1);
    const dv = normalized.slice(-1);

    if (!/^\d+$/.test(body)) return false;

    let sum = 0;
    let multiplier = 2;

    for (let index = body.length - 1; index >= 0; index -= 1) {
      sum += parseInt(body[index], 10) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expected = 11 - (sum % 11);
    const calculatedDv =
      expected === 11 ? "0" : expected === 10 ? "K" : expected.toString();

    return calculatedDv === dv;
  };

  const nameValid = name.trim().length >= 3;
  const rutValid = validateRut(rut);
  const emailValid = EMAIL_REGEX.test(email.trim());
  const passwordValid = password.trim().length >= 8;
  const companyValid = addCompany || company !== "";
  const planValid = isAdministratorRole || plan !== "";
  const roleValid = role !== "";
  const companyNameValid = !addCompany || companyName.trim().length > 0;
  const socialReasonValid = !addCompany || socialReason.trim().length > 0;
  const companyRutValid = !addCompany || validateRut(companyRut);
  const addressValid = !addCompany || address.trim().length > 0;
  const commonValid = !addCompany || common.trim().length > 0;
  const phoneValid = !addCompany || phone.trim().replace(/\s+/g, "").length > 0;
  const businessValid = !addCompany || business.trim().length > 0;

  const nameInvalid = (showErrors || name.trim().length > 0) && !nameValid;
  const rutInvalid = (showErrors || rut.trim().length > 0) && !rutValid;
  const emailInvalid = (showErrors || email.trim().length > 0) && !emailValid;
  const passwordInvalid =
    (showErrors || password.trim().length > 0) && !passwordValid;
  const companyInvalid = showErrors && !companyValid;
  const planInvalid = showErrors && !planValid;
  const roleInvalid = showErrors && !roleValid;
  const companyNameInvalid =
    addCompany && (showErrors || companyName.trim().length > 0) && !companyNameValid;
  const socialReasonInvalid =
    addCompany &&
    (showErrors || socialReason.trim().length > 0) &&
    !socialReasonValid;
  const companyRutInvalid =
    addCompany && (showErrors || companyRut.trim().length > 0) && !companyRutValid;
  const addressInvalid =
    addCompany && (showErrors || address.trim().length > 0) && !addressValid;
  const commonInvalid =
    addCompany && (showErrors || common.trim().length > 0) && !commonValid;
  const phoneInvalid =
    addCompany && (showErrors || phone.trim().length > 0) && !phoneValid;
  const businessInvalid =
    addCompany && (showErrors || business.trim().length > 0) && !businessValid;

  const validateUserFields = () => {
    if (!nameValid) return false;
    if (!rutValid) return false;
    if (!companyValid) return false;
    if (!emailValid) return false;
    if (!passwordValid) return false;
    if (!planValid) return false;
    if (!roleValid) return false;
    return true;
  };

  const validateCompanyFields = () => {
    if (!addCompany) {
      return true;
    }

    if (!socialReasonValid) return false;
    if (!addressValid) return false;
    if (!businessValid) return false;
    if (!phoneValid) return false;
    if (!commonValid) return false;
    if (!companyRutValid) return false;
    if (!companyNameValid) return false;
    return true;
  };

  const validateFields = () => validateUserFields() && validateCompanyFields();

  useEffect(() => {
    const getCompanies = async () => {
      const companiesResponse = await userService.getAllCompanies();
      const rolesResponse = await userService.getAllRoles();
      const plansResponse = await plansService.getAllPlans();
      const permissionsResponse = await permissionsService.getAllPermissions();
      setCompanies([...(companiesResponse ?? [])]);
      setPlans([...(plansResponse ?? [])]);
      setRoles([...(rolesResponse ?? [])]);
      const normalizedPermissions = Array.isArray(permissionsResponse)
        ? permissionsResponse
        : Array.isArray(permissionsResponse?.data)
          ? permissionsResponse.data
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

      if (!validateFields()) {
        setShowErrors(true);
        toast("Completa correctamente los campos obligatorios", {
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
        return;
      }

      const rutData = rut.split("-");

      if (addCompany) {
        const companyRutData = companyRut.split("-");
        const newCompany = await companyService.createCompany({
          name: companyName,
          socialReason,
          address,
          business,
          rut: companyRutData[0],
          dv: companyRutData[1],
          phone: phone.replace(/\s+/g, ""),
          common,
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
          return;
        }

        const createdUser = await userService.createNewClient({
          username: name,
          password: SHA512(password).toString(),
          email,
          rut: rutData[0],
          dv: rutData[1],
          company: newCompany.id,
          plan,
          role,
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
        const createdUser = await userService.createNewClient({
          username: name,
          password: SHA512(password).toString(),
          email,
          rut: rutData[0],
          dv: rutData[1],
          company: parseInt(company, 10),
          plan,
          role,
        });
        const createdUserId = createdUser?.user_id ?? createdUser?.id;
        if (
          isAdministratorRole &&
          createdUserId &&
          selectedPermissionIds.length > 0
        ) {
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
        backdrop: "backdrop-blur-sm",
      }}
      className="h-fit min-h-[369px] gap-[16px] py-[13px]"
    >
      <ModalContent className="w-full items-center">
        <ModalHeader className="flex h-[24px] w-[548px] items-center justify-start gap-1 p-[3] text-[16px] font-[500] text-[#372AAC]">
          Nuevo cliente
        </ModalHeader>
        <ModalBody className="flex w-[548px] items-center justify-start p-[-10px]">
          <form className="w-full" autoComplete="off" onSubmit={handleSubmit}>
            <div className="grid w-full grid-cols-2 grid-rows-3 text-[12px] font-[400] text-darkPurple">
              <div className="w-full px-1 py-1">
                <p>Nombre</p>
                <input
                  maxLength={30}
                  name="random"
                  autoComplete="off"
                  className={inputClassName(nameInvalid)}
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setShowErrors(false);
                  }}
                />
                {nameInvalid ? (
                  <p className="mt-1 text-[12px] text-[#E5484D]">
                    Debe tener al menos 3 caracteres.
                  </p>
                ) : null}
              </div>

              <div className="w-full px-1 py-1">
                <p>Rut</p>
                <input
                  maxLength={10}
                  name="random"
                  autoComplete="off"
                  className={inputClassName(rutInvalid)}
                  placeholder="XXXXXXXX-X"
                  value={rut}
                  onChange={(e) => {
                    setRut(formatRut(e.target.value));
                    setShowErrors(false);
                  }}
                />
                {rutInvalid ? (
                  <p className="mt-1 text-[12px] text-[#E5484D]">
                    Ingresa un rut valido.
                  </p>
                ) : null}
              </div>

              <div className="w-full px-1 py-1">
                <p>E-mail</p>
                <input
                  maxLength={50}
                  type="text"
                  name="random"
                  autoComplete="off"
                  className={inputClassName(emailInvalid)}
                  placeholder="example@gmail.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setShowErrors(false);
                  }}
                />
                {emailInvalid ? (
                  <p className="mt-1 text-[12px] text-[#E5484D]">
                    Ingresa un e-mail valido.
                  </p>
                ) : null}
              </div>

              <div className="w-full px-1 py-1">
                <p>Password</p>
                <input
                  maxLength={30}
                  name="random"
                  autoComplete="off"
                  className={inputClassName(passwordInvalid)}
                  placeholder="********"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setShowErrors(false);
                  }}
                />
                {passwordInvalid ? (
                  <p className="mt-1 text-[12px] text-[#E5484D]">
                    La contraseña debe tener al menos 8 caracteres.
                  </p>
                ) : null}
              </div>

              <div className="w-full px-1 py-1">
                <p>Plan</p>
                <Select
                  disallowEmptySelection={!isAdministratorRole}
                  isDisabled={isAdministratorRole}
                  onChange={(e) => {
                    setPlan(e.target.value);
                    setLastClientPlan(e.target.value);
                    setShowErrors(false);
                  }}
                  aria-label="random"
                  placeholder={isAdministratorRole ? "Sin plan" : "Plan"}
                  classNames={{
                    base: ["h-[32px] text-[14px] font-[400]"],
                    trigger: [
                      `min-h-[0px] h-[32px] rounded-[5px] border bg-white shadow-none ${
                        planInvalid ? "border-[#E5484D]" : ""
                      }`,
                    ],
                    listbox: ["rounded-[5px] text-darkPurple"],
                    popoverContent: ["rounded-[5px]"],
                    value: [
                      "group-data-[has-value=true]:text-[13px] group-data-[has-value=true]:text-darkPurple text-[13px] font-[400]",
                    ],
                  }}
                >
                  {isAdministratorRole ? (
                    <SelectItem key="sin-plan" className="rounded-[5px] text-[13px]">
                      Sin plan
                    </SelectItem>
                  ) : (
                    plans.map((planOption) => (
                      <SelectItem
                        key={planOption.id}
                        className="rounded-[5px] text-[13px] data-[selectable=true]:text-[13px] data-[selectable=true]:focus:bg-[#442F8D] data-[selectable=true]:focus:text-white"
                      >
                        {planOption.name}
                      </SelectItem>
                    ))
                  )}
                </Select>
                {planInvalid ? (
                  <p className="mt-1 text-[12px] text-[#E5484D]">
                    Debes seleccionar un plan.
                  </p>
                ) : null}
              </div>

              <div className="w-full px-1 py-1">
                <p>Rol</p>
                <Select
                  disallowEmptySelection
                  onChange={(e) => {
                    setRole(e.target.value);
                    setShowErrors(false);
                  }}
                  aria-label="random"
                  placeholder="Rol"
                  classNames={{
                    base: ["h-[32px]"],
                    trigger: [
                      `min-h-[0px] h-[32px] rounded-[5px] border bg-white shadow-none ${
                        roleInvalid ? "border-[#E5484D]" : ""
                      }`,
                    ],
                    listbox: ["rounded-[5px] text-darkPurple"],
                    popoverContent: ["rounded-[5px]"],
                    value: [
                      "group-data-[has-value=true]:text-[13px] group-data-[has-value=true]:text-darkPurple text-[13px] font-[400]",
                    ],
                  }}
                >
                  {roles.map((roleOption) => (
                    <SelectItem
                      key={roleOption.id}
                      className="rounded-[5px] text-[13px] data-[selectable=true]:text-[13px] data-[selectable=true]:focus:bg-[#442F8D] data-[selectable=true]:focus:text-white"
                    >
                      {roleOption.name}
                    </SelectItem>
                  ))}
                </Select>
                {roleInvalid ? (
                  <p className="mt-1 text-[12px] text-[#E5484D]">
                    Debes seleccionar un rol.
                  </p>
                ) : null}
              </div>

              <div className="w-full px-1 py-1">
                <p>Empresa</p>
                <Select
                  disallowEmptySelection
                  isDisabled={addCompany}
                  onChange={(e) => {
                    setCompany(e.target.value);
                    setShowErrors(false);
                  }}
                  aria-label="random"
                  placeholder="Empresa"
                  classNames={{
                    base: ["h-[32px] text-[14px] font-[400]"],
                    trigger: [
                      `min-h-[0px] h-[32px] rounded-[5px] border bg-white shadow-none ${
                        companyInvalid ? "border-[#E5484D]" : ""
                      }`,
                    ],
                    listbox: ["rounded-[5px] text-darkPurple"],
                    popoverContent: ["rounded-[5px]"],
                    value: [
                      "group-data-[has-value=true]:text-[13px] group-data-[has-value=true]:text-darkPurple text-[13px] font-[400]",
                    ],
                  }}
                >
                  {companies.map((companyOption) => (
                    <SelectItem
                      key={companyOption.id}
                      className="rounded-[5px] text-[13px] data-[selectable=true]:text-[13px] data-[selectable=true]:focus:bg-[#442F8D] data-[selectable=true]:focus:text-white"
                    >
                      {companyOption.name}
                    </SelectItem>
                  ))}
                </Select>
                {companyInvalid ? (
                  <p className="mt-1 text-[12px] text-[#E5484D]">
                    Debes seleccionar una empresa.
                  </p>
                ) : null}
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
                setShowErrors(false);
              }}
              className="my-2 flex items-center gap-1 text-[#372AAC] hover:cursor-pointer"
            >
              <MdOutlineAdd color="#372AAC" />
              Nueva empresa
            </div>

            {addCompany ? (
              <div className="grid w-full grid-cols-2 grid-rows-4 gap-1 text-[12px] font-[400] text-darkPurple">
                <div className="w-full px-1 py-1">
                  <p>Nombre</p>
                  <input
                    maxLength={30}
                    name="random"
                    autoComplete="off"
                    className={inputClassName(companyNameInvalid)}
                    placeholder="Nombre"
                    value={companyName}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      setShowErrors(false);
                    }}
                  />
                  {companyNameInvalid ? (
                    <p className="mt-1 text-[12px] text-[#E5484D]">
                      Debes ingresar el nombre de la empresa.
                    </p>
                  ) : null}
                </div>

                <div className="w-full px-1 py-1">
                  <p>Rut</p>
                  <input
                    maxLength={10}
                    name="random"
                    autoComplete="off"
                    className={inputClassName(companyRutInvalid)}
                    placeholder="XXXXXXXX-X"
                    value={companyRut}
                    onChange={(e) => {
                      setCompanyRut(formatRut(e.target.value));
                      setShowErrors(false);
                    }}
                  />
                  {companyRutInvalid ? (
                    <p className="mt-1 text-[12px] text-[#E5484D]">
                      Ingresa un rut valido.
                    </p>
                  ) : null}
                </div>

                <div className="w-full px-1 py-1">
                  <p>Domicilio</p>
                  <input
                    maxLength={30}
                    name="random"
                    autoComplete="off"
                    className={inputClassName(addressInvalid)}
                    placeholder="Calle Falsa 123"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setShowErrors(false);
                    }}
                  />
                  {addressInvalid ? (
                    <p className="mt-1 text-[12px] text-[#E5484D]">
                      Debes ingresar el domicilio.
                    </p>
                  ) : null}
                </div>

                <div className="w-full px-1 py-1">
                  <p>Comuna</p>
                  <input
                    maxLength={30}
                    name="random"
                    autoComplete="off"
                    className={inputClassName(commonInvalid)}
                    placeholder="Providencia"
                    value={common}
                    onChange={(e) => {
                      setCommon(e.target.value);
                      setShowErrors(false);
                    }}
                  />
                  {commonInvalid ? (
                    <p className="mt-1 text-[12px] text-[#E5484D]">
                      Debes ingresar la comuna.
                    </p>
                  ) : null}
                </div>

                <div className="w-full px-1 py-1">
                  <p>Giro del negocio</p>
                  <input
                    maxLength={30}
                    name="random"
                    autoComplete="off"
                    className={inputClassName(businessInvalid)}
                    placeholder="Automotriz"
                    value={business}
                    onChange={(e) => {
                      setBusiness(e.target.value);
                      setShowErrors(false);
                    }}
                  />
                  {businessInvalid ? (
                    <p className="mt-1 text-[12px] text-[#E5484D]">
                      Debes ingresar el giro del negocio.
                    </p>
                  ) : null}
                </div>

                <div className="w-full px-1 py-1">
                  <p>Razon social</p>
                  <input
                    maxLength={30}
                    name="random"
                    autoComplete="off"
                    className={inputClassName(socialReasonInvalid)}
                    placeholder="Comercio"
                    value={socialReason}
                    onChange={(e) => {
                      setSocialReason(e.target.value);
                      setShowErrors(false);
                    }}
                  />
                  {socialReasonInvalid ? (
                    <p className="mt-1 text-[12px] text-[#E5484D]">
                      Debes ingresar la razon social.
                    </p>
                  ) : null}
                </div>

                <div className="w-full px-1 py-1">
                  <p>Celular</p>
                  <input
                    name="random"
                    autoComplete="off"
                    className={inputClassName(phoneInvalid)}
                    placeholder="+569 XXXX XXXX"
                    value={phone}
                    onChange={(e) => {
                      setPhone(formatCel(e.target.value));
                      setShowErrors(false);
                    }}
                  />
                  {phoneInvalid ? (
                    <p className="mt-1 text-[12px] text-[#E5484D]">
                      Debes ingresar el celular.
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}

            <div className="mt-3">
              <p className="text-[14px] font-[500] text-[#251D3F]">Permisos</p>
              {!role ? (
                <p className="mt-2 text-[12px] text-[#6E668D]">
                  Selecciona un rol para cargar los permisos asignables.
                </p>
              ) : isAdministratorRole ? (
                availablePermissions.length === 0 ? (
                  <p className="mt-2 text-[12px] text-[#6E668D]">
                    No hay permisos de categoria admin disponibles.
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
                  Selecciona un plan para asignar automaticamente sus permisos al
                  cliente.
                </p>
              ) : (
                <p className="mt-2 text-[12px] text-[#6E668D]">
                  Este usuario cliente recibira automaticamente todos los permisos
                  asociados al plan seleccionado.
                </p>
              )}
            </div>

            <div className="mt-3 flex h-[32px] items-center justify-end gap-2">
              <div
                onClick={closeModal}
                className="flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] bg-black px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
              >
                Cancelar
              </div>
              <button
                disabled={!validateFields()}
                type="submit"
                className={`flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] px-4 text-[14px] font-[500] text-white ${
                  !validateFields()
                    ? "bg-gradient-to-r from-[#384DF699] to-[#987EE699]"
                    : "bg-gradient-to-r from-[#384DF6] to-[#987EE6]"
                }`}
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

function inputClassName(hasError: boolean) {
  return `h-[32px] w-full rounded-[5px] border px-2 py-2 focus:outline-none ${
    hasError ? "border-[#E5484D]" : ""
  }`;
}

export default NewUserModal;
