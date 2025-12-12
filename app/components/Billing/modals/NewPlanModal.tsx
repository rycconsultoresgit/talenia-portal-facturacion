import { plansService } from "@/app/api/plansService";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import React, { useState } from "react";

function NewPlanModal({ isOpen, onOpenChange, onClose }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cvs, setCvs] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      let createObject = {};
      if (name != "") {
        createObject = { ...createObject, name: name };
      }
      if (description != "") {
        createObject = { ...createObject, description: description };
      }
      await plansService.createNewPlan({
        name: name,
        price: price,
        cvs: cvs,
        description: description,
      });
      setName("");
      setCvs("");
      setPrice("");
      setDescription("");
      onClose();
    } catch (error) {}
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
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
                Cantidad de Cvs
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
            <div className="mt-3 flex h-[32px] items-center justify-end gap-2">
              <div
                onClick={() => {
                  setName("");
                  setCvs("");
                  setPrice("");
                  setDescription("");
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
