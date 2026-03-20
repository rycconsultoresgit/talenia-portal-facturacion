import { plansService } from "@/app/api/plansService";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { Permission } from "@/app/types/permission.types";

function EditPlanModal({ plan, isOpen, onOpenChange, onClose, permissions }) {
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newCvs, setNewCvs] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

  console.log("Selected permissions: ", selectedPermissionIds);

  useEffect(() => {
    if (isOpen) {
      const planPermissionIds = plan?.permissions?.map((permission) => permission.id) ?? [];
      setSelectedPermissionIds(planPermissionIds);
    }
  }, [isOpen, plan]);

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
      let createObject = {};
      if (newName != "" && newName != plan?.name) {
        createObject = { ...createObject, name: newName };
      }
      if (newPrice != "" && newPrice != plan?.price) {
        createObject = { ...createObject, price: newPrice };
      }
      if (newCvs != "" && newCvs != plan?.cvs) {
        createObject = { ...createObject, cvs: newCvs };
      }
      if (newDescription != "" && newDescription != plan?.description) {
        createObject = { ...createObject, description: newDescription };
      }
      console.log(createObject);
      if (Object.keys(createObject).length > 0) {
        await plansService.updatePlan(plan.id, createObject);
        setNewName("");
        setNewCvs("");
        setNewPrice("");
        setNewDescription("");
      }
      if (selectedPermissionIds.length > 0) {
        await plansService.assignPermissionsToPlan(plan.id, selectedPermissionIds);
      }
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
            Editar Plan
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
                value={newName}
                onChange={(e)=>{setNewName(e.target.value)}}
                placeholder={`${plan?.name}`}
                className="h-[32px] w-full rounded-[5px] border px-2 py-2 text-[14px] font-[400] text-darkPurple focus:outline-none"
              ></input>
            </div>
            <div className="flex flex-col">
              <p className="text-[12px] font-[400] text-[#251D3F]">Precio</p>
              <input
                value={newPrice}
                onChange={(e)=>{setNewPrice(e.target.value.replace(/[^0-9]/g, ""))}}
                placeholder={`${plan?.price}`}
                className="h-[32px] w-full rounded-[5px] border px-2 py-2 text-[14px] font-[400] text-darkPurple focus:outline-none"
              ></input>
            </div>
            <div className="flex flex-col">
              <p className="text-[12px] font-[400] text-[#251D3F]">
                Cantidad de Cvs
              </p>
              <input
                value={newCvs}
                onChange={(e)=>{setNewCvs(e.target.value.replace(/[^0-9]/g, ""))}}
                placeholder={`${plan?.cvs}`}
                className="h-[32px] w-full rounded-[5px] border px-2 py-2 text-[14px] font-[400] text-darkPurple focus:outline-none"
              ></input>
            </div>
            <div className="flex flex-col">
              <p className="text-[12px] font-[400] text-[#251D3F]">
                Descripción del plan
              </p>
              <textarea
                value={newDescription}
                onChange={(e)=>{setNewDescription(e.target.value)}}
                placeholder={`${plan?.description}`}
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
                  onClose();
                  setSelectedPermissionIds([]);
                }}
                className="flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] bg-black px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
              >
                Cancelar
              </div>
              <button
                type="submit"
                className="flex h-[32px] w-[102px] items-center justify-center gap-2 rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
              >
                Editar
              </button>
            </div>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default EditPlanModal;
