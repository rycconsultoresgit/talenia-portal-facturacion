import { Select, SelectItem, useDisclosure } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { CiCircleCheck } from "react-icons/ci";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { IoReloadCircleOutline } from "react-icons/io5";
import PayDetail from "./modals/PayDetail";
import { billingService } from "@/app/api/billingService";

interface PayDetail {
  id: string;
    transaction_type: string;
    user_id: number;
    detail: string;
    amount: number;
    date: string;
    status: true;
    cvs: number;
    user_cvs: number;
}
interface Bill {
  month: string;
  plan: number;
  extra: number;
  total: number;
  status: boolean;
  detail: PayDetail[];
  planCvs: number;
  extraCvs: number;
  billingDate: string;
}

function BillingSection() {
  const { isOpen, onClose, onOpenChange } = useDisclosure();
  const [billing, setBilling] = useState([]);
  const [currentPage] = useState(1);
  const [total] = useState(10);
  const [billDetail, setBillDetail] = useState([]);

  function moneyParser(value: number): string {
    return value.toLocaleString("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  useEffect(() => {
    const getFiltredBillings = async (user_id: number): Promise<void> => {
      //Obtenemos todas las compras del usuario
      const bills = await billingService.getSummaryBillings(user_id);
      setBilling([...bills]);
    };

    getFiltredBillings(2);
  }, []);

  return (
    <>
      <div className="mx-[8px] mb-2 flex h-full w-full flex-col justify-start gap-4">
        <div className="flex w-full items-end justify-between">
          <p className="text-[16px] font-[500] text-darkPurple">Facturación</p>
          <div className="flex items-center gap-2">
            <Select
              placeholder="2025"
              className="text-darkPurple"
              classNames={{
                innerWrapper: "",
                value: "",
                base: "bg-[#FFFFFF66] w-[92px] h-[32px] rounded-[5px] text-darkPurple",
                helperWrapper: "",
                listbox: "bg-white text-darkPurple",
                listboxWrapper: "",
                mainWrapper: "",
                popoverContent:
                  "bg-white w-[92px] rounded-[5px] p-0 text-darkPurple",
                selectorIcon: "",
                spinner: "",
                trigger:
                  "bg-[#FFFFFF66] rounded-[5px] data-[hover=true]:bg-[#FFFFFF66] text-[#645790] min-h-[32px] h-[10px] py-0",
              }}
            >
              {["2025"].map((month, index) => (
                <SelectItem key={index}>{month}</SelectItem>
              ))}
            </Select>
          </div>
        </div>

        {billing.length > 0 ? (
          <div className="flex h-fit min-h-[450px] w-full flex-col gap-2 rounded-[5px] bg-[#FFFFFF66] px-6 py-[10px]">
            <div className="mb-[10px] grid h-fit w-full grid-cols-[1fr_1.25fr_1.25fr_1fr_1fr_0.7fr] place-items-start gap-2 rounded-[5px] bg-[#FFFFFF66] px-4 py-1 font-[500] text-darkPurple">
              <p>Titulo facturacion</p>
              <p>Pago plan</p>
              <p>Analisis extra</p>
              <p>Total pago</p>
              <p>Fecha de pago</p>
              <p>Estado</p>
            </div>

            {billing.map((billing: Bill, index: number) => (
              <div
                key={index}
                className="my-2 grid h-fit w-full grid-cols-[1fr_1.25fr_1.25fr_1fr_1fr_0.7fr] gap-2 rounded-[5px] px-4 py-1 text-[16px] font-[300] text-darkPurple"
              >
                <div className="w-full">{billing.month}</div>
                <div className="flex w-full items-center gap-2">
                  <p>{moneyParser(billing.plan)} CLP</p>
                  <p className="text-[#372AAC]">
                    ({"0" + "/" + billing.planCvs} CV)
                  </p>
                </div>
                {billing.extra > 0 ? (
                  <div className="flex w-full items-center gap-2">
                    <p>{moneyParser(billing.extra)} CLP</p>
                    <p className="text-[#372AAC]">
                      {"+" + billing.extraCvs + "CVs"}
                    </p>
                  </div>
                ) : (
                  <div>No adquirido</div>
                )}
                <div className="flex w-full items-center gap-2">
                  {moneyParser(billing.total)} CLP
                  <div
                    onClick={() => {
                      setBillDetail(billing.detail);
                      onOpenChange();
                    }}
                    className="hover:cursor-pointer"
                  >
                    <AiOutlineInfoCircle color="#372AAC" />
                  </div>
                </div>
                <div className="w-full">{billing.billingDate}</div>
                <div className="flex w-full items-center gap-2">
                  <p>
                    {billing.status ? (
                      <CiCircleCheck color="green" />
                    ) : (
                      <IoReloadCircleOutline color="#FF9900" />
                    )}
                  </p>
                  <p>{billing.status ? "Pagado" : "Pendiente"}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-fit min-h-[450px] w-full flex-col gap-2 rounded-[5px] bg-[#FFFFFF66] px-6 py-[10px]">
            <p> No hay datos disponibles</p>
          </div>
        )}

        <div className="flex w-full items-center justify-end">
          <div className="flex items-center justify-center gap-2 rounded-[5px] bg-[#FFFFFF66] px-2 py-2 text-darkPurple">
            <IoIosArrowBack />
            {currentPage} de {total}
            <IoIosArrowForward />
          </div>
        </div>
      </div>
      <PayDetail
        isOpen={isOpen}
        onClose={onClose}
        detail={billDetail}
      ></PayDetail>
    </>
  );
}

export default BillingSection;
