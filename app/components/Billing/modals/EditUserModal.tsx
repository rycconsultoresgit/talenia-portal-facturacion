import { userService } from "@/app/api/userService";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Switch,
  Select,
  SelectItem,
} from "@heroui/react";
import React, { useState } from "react";
import { LiaGrinStars } from "react-icons/lia";
import { toast } from "sonner";

interface User {
  username: string;
  rut: string;
  email: string;
  plan: number;
  rol: number;
  dv: number;
  company_id?: string;
  status: number;
}

function EditUserModal({ user, isOpen, onOpenChange, onClose }) {
  const [plan, setPlan] = useState("");
  const [role, setRole] = useState("");
  const [newUserName, setNewUserName] = useState(user?.username);
  const [newEmail, setNewEmail] = useState(user?.email);
  const [newPassword, setNewPassword] = useState("");
  const [newStatus, setnewStatus] = useState(user?.status);

  const plans = [
    { key: 4, label: "Demo" },
    { key: 1, label: "Basico" },
    { key: 2, label: "Avanzado" },
    { key: 3, label: "Pro" },
  ];

  const roles = [
    { key: "cliente", label: "Cliente" },
    { key: "coordinador", label: "Coordinador" },
  ];

  const handleSubmit = async () => {
    try {
      let updateObject = {};
      if (newUserName != "" && newUserName != user?.username) {
        updateObject = { ...updateObject, username: newUserName };
      }
      if (newEmail != "" && newEmail != user?.email) {
        updateObject = { ...updateObject, email: newEmail };
      }
      if (newStatus != user?.status) {
        updateObject = { ...updateObject, status: newStatus };
      }
      if (Object.keys(updateObject).length != 0) {
        await userService.updateInfoClient(user.user_id, updateObject);
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
      }

      onClose();
    } catch (error) {
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
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 text-[#372AAC]">
            Editar cliente
          </ModalHeader>
          <ModalBody>
            <div className="grid w-full grid-cols-2 grid-rows-4 text-[12px] font-[400] text-darkPurple">
              <div className="w-full px-1 py-1">
                <p>Nombre</p>
                <input
                  className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                  placeholder={user?.username}
                  value={newUserName}
                  onChange={(e) => {
                    setNewUserName(e.target.value);
                  }}
                ></input>
              </div>
              <div className="w-full px-1 py-1">
                <p>Rut</p>
                <input
                  disabled={true}
                  className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                  placeholder={`${user?.rut} - ${user?.dv}`}
                ></input>
              </div>
              <div className="w-full px-1 py-1">
                <p>E-mail</p>
                <input
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                  }}
                  className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                  placeholder={user?.email}
                ></input>
              </div>
              <div className="w-full px-1 py-1">
                <p>Empresa</p>
                <input
                  disabled={true}
                  className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                  placeholder={user?.company.name}
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
                <p>Contraseña</p>
                <input
                  className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                  placeholder={"********"}
                ></input>
              </div>
              <div className="flex items-end justify-start px-2 py-2">
                <Switch
                  defaultSelected={newStatus == 1}
                  onChange={() => {
                    setnewStatus(newStatus == 1 ? 0 : 1);
                  }}
                >
                  <p className="text-[14px] font-[400]">Habilitado</p>
                </Switch>
              </div>
            </div>
            <p className="text-[14px] text-[#947CE7]">
              *El cambio de plan se hará efectivo al comenzar la próxima
              facturación.
            </p>

            <p className="border-t-1 pt-4 text-[#372AAC]">
              Datos de facturacion
            </p>
            <div className="grid w-full grid-cols-2 grid-rows-3 text-[12px] font-[400] text-darkPurple">
              <div className="w-full px-1 py-1">
                <p>Razon social</p>
                <input
                  className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                  placeholder={"Campo opcional"}
                ></input>
              </div>
              <div className="w-full px-1 py-1">
                <p>Rut</p>
                <input
                  className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                  placeholder={"Campo opcional"}
                ></input>
              </div>
              <div className="w-full px-1 py-1">
                <p>Domicilio</p>
                <input
                  className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                  placeholder={"Campo opcional"}
                ></input>
              </div>
              <div className="w-full px-1 py-1">
                <p>Comuna</p>
                <input
                  className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                  placeholder={"Campo opcional"}
                ></input>
              </div>
              <div className="w-full px-1 py-1">
                <p>Giro del negocio</p>
                <input
                  className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                  placeholder={"Campo opcional"}
                ></input>
              </div>
              <div className="w-full px-1 py-1">
                <p>Celular</p>
                <input
                  className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                  placeholder={"Campo opcional"}
                ></input>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div
              onClick={() => {
                setNewPassword("")
                setNewEmail("")
                setNewUserName("")
                setnewStatus(user.status)
                onClose();
              }}
              className="flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] bg-black px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
            >
              Cancelar
            </div>
            <div
              onClick={() => {
                
                handleSubmit();
              }}
              className="flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
            >
              Guardar
            </div>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}

export default EditUserModal;
