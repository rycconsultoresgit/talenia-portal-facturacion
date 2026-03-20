"use client";
import NewPlanModal from "./modals/NewPlanModal";
import EditPlanModal from "./modals/EditPlanModal";
import DeletePlanModal from "./modals/DeletePlanModal";
import React, { useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";
import { Spinner, useDisclosure } from "@heroui/react";
import { usePlanAll } from "@/app/api/queries/planService";
import { permissionsService } from "@/app/api/permissionsService";
import { Plan } from "@/app/types/plan.types";

function PlansView() {
  const {
    isOpen: isNewPlanOpen,
    onOpenChange: onNewPlanChange,
    onClose: onNewPlanClose,
  } = useDisclosure();
  const {
    isOpen: isEditPlanOpen,
    onOpenChange: onEditPlanChange,
    onClose: onEditPlanClose,
  } = useDisclosure();
  const {
    isOpen: isDeletePlanOpen,
    onOpenChange: onDeletePlanChange,
    onClose: onDeletePlanClose,
  } = useDisclosure();
  const { plansAll, isLoadingPlans, refetch } = usePlanAll();
  const [selectedPlan, setSelectedPlan] = useState<null | Plan>(null);

  function moneyParser(value: number): string {
    return value.toLocaleString("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  const [permissions, setPermissions] = useState([
    "Permiso dummy",
  ]);

  useEffect(() => {
    const getPermissions = async () => {
    try {
      const response = await permissionsService.getAllPermissions();
      console.log(response);
      setPermissions(response.data);
    } catch (error) {
      console.error("Error al cargar permisos:", error);
    }
    };
    getPermissions();
  }, []);

  return (
    <>
      <div className="flex h-[633px] w-full flex-col justify-center gap-5 rounded-lg bg-gradient-to-r from-[#E9E3FF80] to-[#D9CEFF80] px-5 py-4">
        <div className="mx-auto flex h-[32px] w-[1288px] items-center justify-between rounded-lg">
          <p className="text-[18px] font-[500] text-[#645790]">Planes</p>
          <div className="flex items-center justify-center gap-5">
            <div
              onClick={() => {
                onNewPlanChange();
              }}
              className="flex h-[33px] min-w-[114px] items-center gap-2 rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
            >
              <IoAddCircleOutline /> Nuevo plan
            </div>
          </div>
        </div>
        {!isLoadingPlans ? (
          <div className="mx-auto grid h-[500px] w-[1288px] grid-cols-4 gap-6 rounded-[10px] py-2">
            {plansAll?.slice(0, 6).map((plan: Plan, index: number) => (
              <div
                key={index}
                className="flex h-full min-h-[138px] w-full min-w-[300px] flex-col justify-between gap-2 rounded-[5px] bg-[#FFFFFF80] px-4 py-4"
              >
                <div>
                  <p className="border-b-1 border-b-[#FFFFFF] py-2 text-[#372AAC]">
                    Plan {plan.name} ({plan.cvs}CV)
                  </p>
                  <p className="text-[14px] font-[300] pt-2">
                    Precio: ${moneyParser(plan.price)}
                  </p>
                  <p>
                    {plan.description}
                  </p>
                </div>
                <div className="flex items-center justify-end gap-2">
                  <div
                    onClick={() => {
                      setSelectedPlan(plan);
                      onEditPlanChange();
                    }}
                  >
                    <FiEdit3 className="hover:cursor-pointer" />
                  </div>
                  <div
                    onClick={() => {
                      onDeletePlanChange();
                      setSelectedPlan(plan)
                    }}
                  >
                    <AiOutlineDelete className="hover:cursor-pointer" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-auto grid h-[500px] w-[1288px] grid-cols-1 gap-10 rounded-[10px] py-2">
            <Spinner></Spinner>
          </div>
        )}
      </div>
      <NewPlanModal
        isOpen={isNewPlanOpen}
        onOpenChange={onNewPlanChange}
        onClose={()=>{
          onNewPlanClose()
          refetch()
        }}
        permissions={permissions}
      ></NewPlanModal>
      <EditPlanModal
        plan={selectedPlan}
        isOpen={isEditPlanOpen}
        onOpenChange={onEditPlanChange}
        onClose={() => {
          onEditPlanClose();
          setSelectedPlan(null);
          refetch();
        }}
        permissions={permissions}
      ></EditPlanModal>
      <DeletePlanModal
        plan={selectedPlan}
        isOpen={isDeletePlanOpen}
        onOpenChange={onDeletePlanChange}
        onClose={() => {
          onDeletePlanClose();
          setSelectedPlan(null);
          refetch();
        }}
      ></DeletePlanModal>
    </>
  );
}

export default PlansView;
