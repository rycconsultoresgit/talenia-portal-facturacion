import { plansService } from "@/app/api/plansService";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import React, { useState } from "react";
import { Permission } from "@/app/types/permission.types";
import { Plan } from "@/app/types/plan.types";

function NewPlanModal({ isOpen, onOpenChange, onClose, permissions }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cvs, setCvs] = useState("");
  const [description, setDescription] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissionIds((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId],
    );
  };

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      const response: Plan = await plansService.createNewPlan({
        name: name,
        price: price,
        cvs: cvs,
        description: description,
      });
      await plansService.assignPermissionsToPlan(response.id, selectedPermissionIds);
      setName("");
      setCvs("");
      setPrice("");
      setDescription("");
      setSelectedPermissionIds([]);
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          setSelectedPermissionIds([]);
        }
        onOpenChange(open);
      }}
      size="sm"
      className="h-fit min-h-[370px]"
    >
      <ModalContent>
        <ModalHeader>
          <div className="text-[16px] font-[500] text-[#372AAC]">
            Nuevo Plan
          </div>
        </ModalHeader>
        <ModalBody className="w-full">
          <form
            className="flex flex-col gap-[10px]"
            onSubmit={(e) => handleSubmit(e)}
          >
            <div className="flex flex-col">
              <p className="text-[12px] font-[400] text-[#251D3F]">
                Nombre del plan
              </p>
              <input
                placeholder="Nombre del plan"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
                className="h-[32px] w-full rounded-[5px] border px-2 py-2 text-[14px] font-[400] text-darkPurple focus:outline-none"
              ></input>
            </div>
            <div className="flex flex-col">
              <p className="text-[12px] font-[400] text-[#251D3F]">Precio</p>
              <input
                placeholder="$10.000"
                inputMode="numeric"
                pattern="[0-9]*"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value.replace(/[^0-9]/g, ""));
                }}
                className="h-[32px] w-full rounded-[5px] border px-2 py-2 text-[14px] font-[400] text-darkPurple focus:outline-none"
              ></input>
            </div>
            <div className="flex flex-col">
              <p className="text-[12px] font-[400] text-[#251D3F]">
                Cantidad de Cv
              </p>
              <input
                placeholder="10"
                inputMode="numeric"
                pattern="[0-9]*"
                value={cvs}
                onChange={(e) => {
                  setCvs(e.target.value.replace(/[^0-9]/g, ""));
                }}
                className="h-[32px] w-full rounded-[5px] border px-2 py-2 text-[14px] font-[400] text-darkPurple focus:outline-none"
              ></input>
            </div>
            <div className="flex flex-col">
              <p className="text-[12px] font-[400] text-[#251D3F]">
                Descripción del plan
              </p>
              <textarea
                placeholder="Descripcion"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
                className="h-[80px] w-full rounded-[5px] border px-2 py-2 text-[14px] font-[400] text-darkPurple focus:outline-none"
              ></textarea>
            </div>
            <div>
              <p className="text-[14px] font-[500] text-[#251D3F]">
                Permisos
              </p>
              <div className="w-full grid grid-cols-2 gap-[9px] mt-2 pl-2">
                {permissions.map((permission: Permission) => (
                  <div key={permission.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedPermissionIds.includes(permission.id)}
                      onChange={() => handlePermissionToggle(permission.id)}
                      className="h-[16px] w-[16px] accent-[#372AAC]"
                    ></input>
                    <p className="text-[14px] font-[400] text-[#251D3F]">{permission.name}</p>
                  </div>
                ))}

              </div>
            </div>
            <div className="mt-3 flex h-[32px] items-center justify-end gap-2">
              <div
                onClick={() => {
                  setName("");
                  setCvs("");
                  setPrice("");
                  setDescription("");
                  setSelectedPermissionIds([]);
                  onClose();
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
      </ModalContent>
    </Modal>
  );
}

export default NewPlanModal;
