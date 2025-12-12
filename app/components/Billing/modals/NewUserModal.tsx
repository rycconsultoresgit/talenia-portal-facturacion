import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Select,
  SelectItem,
} from "@heroui/react";
import React, { useState } from "react";
import { toast } from "sonner";
import { LiaGrinStars } from "react-icons/lia";
import { companyService } from "@/app/api/companyService";
import { userService } from "@/app/api/userService";
import { SHA512 } from "crypto-js";
import { MdOutlineDangerous } from "react-icons/md";

function NewUserModal({ isOpen, onOpenChange, onClose }) {
  //User data
  const [name, setName] = useState("");
  const [rut, setRut] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [plan, setPlan] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");

  const plans = [
    { key: 4, label: "Demo" },
    { key: 1, label: "Basico" },
    { key: 2, label: "Avanzado" },
    { key: 3, label: "Pro" },
  ];

  const roles = [
    { key: 2, label: "Cliente" },
    { key: 1, label: "Administrador" },
  ];

  //company data
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
    setRole("");
    setPassword("");
    setSocialReason("");
    setCompanyRut("");
    setAddress("");
    setCommon("");
    setPhone("");
    setBusiness("");
    onClose();
  };

  const formatRut = (rut: string) => {
    let clean = rut.replace(/[^0-9kK]/g, "").toUpperCase();
    if (clean.length <= 1) return clean;
    let cuerpo = clean.slice(0, -1);
    let dv = clean.slice(-1);
    return `${cuerpo}-${dv}`;
  };

  const formatCel = (input) => {
    let clean = input.replace(/[^0-9]/g, "");
    clean = clean.replace(/^56/, "").replace(/^9/, "");
    if (clean.length === 0) return "+569 ";
    if (clean.length <= 4) {
      return `+569 ${clean}`;
    }
    let parte1 = clean.slice(0, 4);
    let parte2 = clean.slice(4, 8);
    return `+569 ${parte1}${parte2 ? " " + parte2 : ""}`;
  };

  const validateRut = (rut:string) => {
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
    let dvCalculado =
        dvEsperado === 11 ? "0" :
        dvEsperado === 10 ? "K" :
        dvEsperado.toString();
    return dvCalculado === dv;
}

  //Validaciones desde el frontend
  const validateFields = () => {
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
    if (name == "") {
      return false;
    }
    if (rut == "" || !validateRut(rut)) {
      return false;
    }
    if (company == "") {
      return false;
    }
    if (email == "") {
      return false;
    }
    if (password == "") {
      return false;
    }
    if (plan == "") {
      return false;
    }
    if (role == "") {
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: any) => {
    //Evitamos el comportamiento por defecto
    e.preventDefault();

    if (validateFields()) {
      //Tomamos la informacion del usuario y lo creamos
      const rutData = rut.split("-")
      const companyRutData = companyRut.split("-");

      //Primero creariamos la empresa, para asociarsela al usuario
      const newCompany = await companyService.createCompany({
        name: company,
        socialReason: socialReason,
        address: address,
        business: business,
        rut: companyRutData[0],
        dv: companyRutData[1],
        phone: phone.replace(/\s+/g, ""),
        common: common,
      });

      if(!newCompany){
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

      //Con los datos de la empresa creamos al usuario
      await userService.createNewClient({
        username: name,
        password: SHA512(password).toString(),
        email: email,
        rut: rutData[0],
        dv: rutData[1],
        company: newCompany.id,
        plan: plan,
        role: role,
      });
      
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
      onClose()
    } else {
      toast("Complete todos los campos", {
        icon: <MdOutlineDangerous color="#372AAC" size={16} />,
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
      className="min-h-[539px] py-[13px]"
    >
      <ModalContent className="flex items-center bg-white/85 shadow-lg backdrop-blur-md">
        <>
          <ModalHeader className="flex h-[24px] w-[548px] items-center justify-start gap-1 text-[16px] font-[500] text-[#372AAC]">
            Nuevo cliente
          </ModalHeader>
          <ModalBody className="flex w-[548px] items-center justify-center">
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
                    maxLength={30}
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
                  <p>Empresa</p>
                  <input
                  maxLength={30}
                    name="random"
                    autoComplete="off"
                    className="h-[32px] w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                    placeholder="RyC Consultores"
                    value={company}
                    onChange={(e) => {
                      setCompany(e.target.value);
                    }}
                  ></input>
                </div>
                <div className="w-full px-1 py-1">
                  <p>Plan</p>
                  <Select
                    onChange={(e) => {
                      setPlan(e.target.value);
                    }}
                    aria-label="random"
                    placeholder="Plan"
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
                    {plans.map((plan) => (
                      <SelectItem
                        key={plan.key}
                        className="rounded-[5px] text-[13px] data-[selectable=true]:text-[13px] data-[selectable=true]:focus:bg-[#442F8D] data-[selectable=true]:focus:text-white"
                      >
                        {plan.label}
                      </SelectItem>
                    ))}
                  </Select>
                </div>

                <div className="w-full px-1 py-1">
                  <p>Rol</p>
                  <Select
                    onChange={(e) => {
                      setRole(e.target.value);
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
                    {roles.map((plan) => (
                      <SelectItem
                        key={plan.key}
                        className="rounded-[5px] text-[13px] data-[selectable=true]:text-[13px] data-[selectable=true]:focus:bg-[#442F8D] data-[selectable=true]:focus:text-white"
                      >
                        {plan.label}
                      </SelectItem>
                    ))}
                  </Select>
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
              </div>

              <p className="my-2 text-[#372AAC]">Datos de facturacion</p>
              <div className="grid w-full grid-cols-2 grid-rows-3 gap-1 text-[12px] font-[400] text-darkPurple">
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
                  type="submit"
                  className="flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
                >
                  Crear
                </button>
              </div>
            </form>
          </ModalBody>
        </>
      </ModalContent>
    </Modal>
  );
}

export default NewUserModal;
