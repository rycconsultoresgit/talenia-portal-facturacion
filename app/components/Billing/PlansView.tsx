"use client";

import React, { useEffect, useState } from "react";
import { FiEdit3 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { IoAddCircleOutline } from "react-icons/io5";
import { plansService } from "@/app/api/plansService";
import { Spinner } from "@heroui/react";

function PlansView() {
  const [isLoading, setIsLoading] = useState(true);
  const [plans, setPlans] = useState([]);

  function moneyParser(value: number): string {
    return value.toLocaleString("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  useEffect(() => {
    const getData = async () => {
      const data = await plansService.getAllPlans();
      setIsLoading(false);
      setPlans(data);
    };
    getData();
  }, []);

  return (
    <>
      <div className="flex h-[633px] w-full flex-col justify-center gap-5 rounded-lg bg-gradient-to-r from-[#E9E3FF] to-[#D9CEFF] px-5 py-4">
        <div className="mx-auto flex h-[32px] w-[1288px] items-center justify-between rounded-lg">
          <p className="text-[18px] font-[500] text-[#645790]">Planes</p>
          <div className="flex items-center justify-center gap-5">
            
            <div
              onClick={() => {}}
              className="flex h-[33px] min-w-[114px] items-center gap-2 rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-4 text-[14px] font-[500] text-white hover:cursor-pointer"
            >
              <IoAddCircleOutline /> Nuevo plan
            </div>
          </div>
          
        </div>
        { !isLoading ? <div className="grid grid-cols-3  mx-auto  h-[500px] w-[1288px]  gap-10 rounded-[10px]   py-2">
          { plans.slice(0,6).map((plan,index)=>(<div key={index} className="min-w-[300px] w-full min-h-[138px] h-fit bg-[#FFFFFF80] rounded-[5px] px-4 py-4 gap-2 flex flex-col justify-between">
            <p className="text-[#372AAC] py-2 border-b-1 border-b-[#FFFFFF]">Plan {plan.name} ({plan.cvs}CV)</p>
            <p className="text-[14px] font-[300]">Precio: ${moneyParser(plan.price)}</p>
            <p>Incluye: Este plan incluye acceso a herramientas, evaluaciones y análisis personalizados.</p>
            <div className="flex items-center gap-2 justify-end w-full">
              <FiEdit3 className="hover:cursor-pointer" /><AiOutlineDelete className="hover:cursor-pointer" />
            </div>
          </div>))}
        </div>: <div className="grid grid-cols-1  mx-auto  h-[500px] w-[1288px]  gap-10 rounded-[10px]   py-2" ><Spinner></Spinner></div>}
      </div>
    </>
  );
}

export default PlansView;
