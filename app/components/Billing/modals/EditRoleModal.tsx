import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Checkbox,
} from "@heroui/react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { LiaGrinStars } from "react-icons/lia";
import { IoChevronDownSharp } from "react-icons/io5";
import { IoChevronUpSharp } from "react-icons/io5";
import { userService } from "@/app/api/userService";

function EditRoleModal({ rol, isOpen, onOpenChange, onClose }) {
  const [billPermises, setBillPermises] = useState(false);
  const [userPermises, setUserPermises] = useState(false);
  const [securityPermises, setSecurityPermises] = useState(false);

  const [newName, setNewName] = useState(rol?.name);
  const [newDescription, setNewDescription] = useState(rol?.description);

  const handleSubmit = async () => {
    try {
      let updateObject = {};
      if (newName != "" && newName != rol?.name) {
        updateObject = { ...updateObject, name: newName };
      }
      if (newDescription != "" && newDescription != rol?.description) {
        updateObject = { ...updateObject, description: newDescription };
      }

      if (Object.keys(updateObject).length != 0) {
        await userService.updateInfoRole(rol?.id, updateObject);
        toast("Rol editado con exito", {
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
      setBillPermises(false);
      setSecurityPermises(false);
      setUserPermises(false);

      setNewName("");
      setNewDescription("");
      onClose();
    } catch {
      toast("Error al editar el Rol", {
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

  useEffect(() => {
    setNewName(rol?.name)
    setNewDescription(rol?.description)
  }, [rol?.description, rol?.name])
  

  return (
    <Modal
    key={rol?.id}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable={false}
      size="lg"
      className="bg-[#FFFFFF]"
    >
      <ModalContent>
        <>
          <ModalHeader className="flex flex-col gap-1 text-[16px] text-[#372AAC]">
            Editar rol
          </ModalHeader>
          <ModalBody className="">
            <div className="flex w-full flex-col gap-2 text-[12px] font-[400] text-darkPurple">
              <div>Nombre del rol</div>
              <input
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                }}
                className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                placeholder={`${rol?.name}`}
              ></input>
              <div>Descripcion de rol</div>
              <input
                value={newDescription}
                onChange={(e) => {
                  setNewDescription(e.target.value);
                }}
                className="w-full rounded-[5px] border px-2 py-2 focus:outline-none"
                placeholder={rol?.description}
              ></input>
            </div>

            <p className="text-[#372AAC]">Permisos</p>
            <div className="text-[12px] font-[400] text-darkPurple">
              <div className="">
                <div className="flex h-fit min-h-[37px] w-full items-center justify-between px-2">
                  <p className="text-[14px] font-[400]">Facturación</p>
                  <div
                    onClick={() => {
                      setBillPermises(!billPermises);
                    }}
                    className="hover:cursor-pointer"
                  >
                    {billPermises ? (
                      <IoChevronUpSharp />
                    ) : (
                      <IoChevronDownSharp />
                    )}
                  </div>
                </div>
                {billPermises ? (
                  <div className="flex h-[20px] w-full items-center justify-start gap-[15%] px-2">
                    <div className="flex">
                      <Checkbox
                        classNames={{
                          label: ["text-[14px]"],
                          wrapper: [
                            "group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 before:rounded-[4px] rounded-[4px] after:rounded-[4px] before:border-1 group-data-[selected=true]:bg-[#442F8D] group-data-[hover=true]:before:bg-[#442F8D]",
                          ],
                        }}
                      >
                        Crear
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        classNames={{
                          label: ["text-[14px]"],
                          wrapper: [
                            "group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 before:rounded-[4px] rounded-[4px] after:rounded-[4px] before:border-1 group-data-[selected=true]:bg-[#442F8D] group-data-[hover=true]:before:bg-[#442F8D]",
                          ],
                        }}
                      >
                        Actualizar
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        classNames={{
                          label: ["text-[14px]"],
                          wrapper: [
                            "group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 before:rounded-[4px] rounded-[4px] after:rounded-[4px] before:border-1 group-data-[selected=true]:bg-[#442F8D] group-data-[hover=true]:before:bg-[#442F8D]",
                          ],
                        }}
                      >
                        Eliminar
                      </Checkbox>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>

              <div className="">
                <div className="flex h-fit min-h-[37px] w-full items-center justify-between px-2">
                  <p className="text-[14px] font-[400]">Usuarios</p>
                  <div
                    onClick={() => {
                      setUserPermises(!userPermises);
                    }}
                    className="hover:cursor-pointer"
                  >
                    {userPermises ? (
                      <IoChevronUpSharp />
                    ) : (
                      <IoChevronDownSharp />
                    )}
                  </div>
                </div>
                {userPermises ? (
                  <div className="flex h-[20px] w-full items-center justify-start gap-[15%] px-2">
                    <div className="flex">
                      <Checkbox
                        classNames={{
                          label: ["text-[14px]"],
                          wrapper: [
                            "group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 before:rounded-[4px] rounded-[4px] after:rounded-[4px] before:border-1 group-data-[selected=true]:bg-[#442F8D] group-data-[hover=true]:before:bg-[#442F8D]",
                          ],
                        }}
                      >
                        Crear
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        classNames={{
                          label: ["text-[14px]"],
                          wrapper: [
                            "group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 before:rounded-[4px] rounded-[4px] after:rounded-[4px] before:border-1 group-data-[selected=true]:bg-[#442F8D] group-data-[hover=true]:before:bg-[#442F8D]",
                          ],
                        }}
                      >
                        Actualizar
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        classNames={{
                          label: ["text-[14px]"],
                          wrapper: [
                            "group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 before:rounded-[4px] rounded-[4px] after:rounded-[4px] before:border-1 group-data-[selected=true]:bg-[#442F8D] group-data-[hover=true]:before:bg-[#442F8D]",
                          ],
                        }}
                      >
                        Eliminar
                      </Checkbox>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>

              <div className="">
                <div className="flex h-fit min-h-[37px] w-full items-center justify-between px-2">
                  <p className="text-[14px] font-[400]">Seguridad</p>
                  <div
                    onClick={() => {
                      setSecurityPermises(!securityPermises);
                    }}
                    className="hover:cursor-pointer"
                  >
                    {securityPermises ? (
                      <IoChevronUpSharp />
                    ) : (
                      <IoChevronDownSharp />
                    )}
                  </div>
                </div>
                {securityPermises ? (
                  <div className="flex h-[20px] w-full items-center justify-start gap-[15%] px-2">
                    <div className="flex">
                      <Checkbox
                        classNames={{
                          label: ["text-[14px]"],
                          wrapper: [
                            "group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 before:rounded-[4px] rounded-[4px] after:rounded-[4px] before:border-1 group-data-[selected=true]:bg-[#442F8D] group-data-[hover=true]:before:bg-[#442F8D]",
                          ],
                        }}
                      >
                        Crear
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        classNames={{
                          label: ["text-[14px]"],
                          wrapper: [
                            "group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 before:rounded-[4px] rounded-[4px] after:rounded-[4px] before:border-1 group-data-[selected=true]:bg-[#442F8D] group-data-[hover=true]:before:bg-[#442F8D]",
                          ],
                        }}
                      >
                        Actualizar
                      </Checkbox>
                    </div>
                    <div>
                      <Checkbox
                        classNames={{
                          label: ["text-[14px]"],
                          wrapper: [
                            "group-data-[focus-visible=true]:ring-0 group-data-[focus-visible=true]:ring-offset-0 before:rounded-[4px] rounded-[4px] after:rounded-[4px] before:border-1 group-data-[selected=true]:bg-[#442F8D] group-data-[hover=true]:before:bg-[#442F8D]",
                          ],
                        }}
                      >
                        Eliminar
                      </Checkbox>
                    </div>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div
              onClick={() => {
                setBillPermises(false);
                setSecurityPermises(false);
                setUserPermises(false);
                setNewName("");
                setNewDescription("");
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
              Editar
            </div>
          </ModalFooter>
        </>
      </ModalContent>
    </Modal>
  );
}

export default EditRoleModal;
