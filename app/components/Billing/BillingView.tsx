import { billingService } from "@/app/api/billingService";
import { Select, SelectItem, Spinner, useDisclosure } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import PayDetail from "../AccConfig/modals/PayDetail";
import { IoReloadCircleOutline } from "react-icons/io5";
import { CiCircleCheck } from "react-icons/ci";

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

function BillingView() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(10);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: detailIsOpen,
    onOpen: detailOnOpen,
    onOpenChange: detailOnOpenChange,
    onClose: detailOnClose,
  } = useDisclosure();
  const [billing, setBilling] = useState([]);
  const [billDetail, setBillDetail] = useState([]);

  function moneyParser(value: number): string {
    return value.toLocaleString("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  useEffect(() => {
    const getData = async (user_id: number) => {
      const data = await billingService.getSummaryBillings(user_id);
      setIsLoading(false);
      setBilling(data);
    };
    getData(2);
  }, []);
  return (
    <>
      <div className="flex h-[633px] w-full flex-col justify-center gap-5 rounded-lg bg-gradient-to-r from-[#E9E3FF] to-[#D9CEFF] px-5 py-4">
        <div className="flex h-[32px] w-[1288px] items-center justify-between rounded-lg mx-auto">
          <p className="text-[18px] font-[500] text-[#645790]">
            Panel de facturacion
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <Select
                  placeholder="Dic"
                  className="text-[#645790]"
                  classNames={{
                    innerWrapper: "text-[#645790]",
                    value:
                      "text-[#645790] group-data-[has-value=true]:text-[#645790] ",
                    base: " w-[82px] h-[32px] rounded-[5px] text-[#645790] bg-[#FFFFFF66] ",
                    helperWrapper: "text-[#645790]",
                    listbox: "bg-white text-[#645790]",
                    listboxWrapper: "text-[#645790]",
                    mainWrapper: "text-[#645790]",
                    popoverContent:
                      "bg-white w-[82px] rounded-[5px] p-0 text-[#645790]",
                    selectorIcon: "text-[#645790]",
                    spinner: "text-[#645790]",
                    trigger:
                      "bg-[#FFFFFF66] rounded-[5px] data-[hover=true]:bg-[#FFFFFF66] text-[#645790] min-h-[32px] h-[10px] py-0",
                    description: "text-[#645790]",
                    errorMessage: "text-[#645790]",
                    label: "text-[#645790]",
                  }}
                >
                  {[
                    "Ene",
                    "Feb",
                    "Mar",
                    "Abr",
                    "May",
                    "Jun",
                    "Jul",
                    "Ago",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dic",
                  ].map((month, index) => (
                    <SelectItem key={index}>{month}</SelectItem>
                  ))}
                </Select>

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

              <input
                className="h-[32px] w-full px-2"
                placeholder="Buscar"
              ></input>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="flex h-[500px] w-full flex-col items-center justify-center gap-2 overflow-scroll rounded-[10px] bg-[#FFFFFF66] px-4 py-4">
            {" "}
            <Spinner></Spinner>{" "}
          </div>
        ) : (
          <div className="flex h-[500px] min-w-fit w-[1288px]  flex-col items-center gap-2 rounded-[10px] bg-[#FFFFFF66] mx-auto py-4">
            <div className="grid h-[50px] min-w-[1286px] w-full grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-start items-center rounded-[5px] bg-[#FFFFFF66] px-8 text-[16px] font-[500] text-[#442F8D]">
              <div className="w-full">Cliente</div>
              <div className="w-full">Detalle</div>
              <div className="w-full">Pago plan</div>
              <div className="w-full">Analisis extra</div>
              <div className="w-full">Total pago</div>
              <div className="w-full">Fecha de pago</div>
              <div className="w-full ">Estado</div>
            </div>

            {billing.map((bill: Bill, index) => (
              <div
                key={index}
                className="grid h-[50px] w-full grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-start items-center px-8"
              >
                <div className="w-full">{bill.month}</div>
                <div className="w-full">{bill.month}</div>
                <div className="w-full">${moneyParser(bill.plan)} CLP</div>
                <div className="flex w-full ">
                  <div>
                    {bill.extra > 0
                      ? "$"+moneyParser(bill.extra) + " CLP"
                      : "No adquirido"}{" "}
                  </div>
                  
                </div>
                <div className="w-full flex items-center gap-2">
                  <div>${moneyParser(bill.plan + bill.extra)} CLP</div>
                  
                    <div
                      onClick={() => {
                        setBillDetail(bill.detail);
                        detailOnOpenChange();
                      }}
                    >
                      <AiOutlineInfoCircle color="#947CE7" />
                    </div>
                  
                </div>
                <div className="w-full">{bill.detail[0].date}</div>

                <div>
                    <Select
                startContent={bill.detail[0].status ? <CiCircleCheck color="green"/> : <IoReloadCircleOutline color="orange"/> }
                  placeholder={bill.detail[0].status ? "Pagado" : "Pendiente"}
                  value={bill.detail[0].status ? "Pagado" : "Pendiente"}
                  className="text-darkPurple"
                  classNames={{
                    innerWrapper: "",
                    value: "",
                    base: "bg-[#FFFFFF66] w-[142px] h-[32px] rounded-[5px] text-darkPurple",
                    helperWrapper: "",
                    listbox: "bg-white text-darkPurple",
                    listboxWrapper: "",
                    mainWrapper: "",
                    popoverContent:
                      "bg-white w-[142px] rounded-[5px] p-0 text-darkPurple",
                    selectorIcon: "",
                    spinner: "",
                    trigger:
                      "bg-[#FFFFFF66] rounded-[5px] data-[hover=true]:bg-[#FFFFFF66] text-[#645790] min-h-[32px] h-[10px] py-0",
                  }}
                >
                  <SelectItem key={0}>Pagado</SelectItem>
                  <SelectItem key={1}>Pendiente</SelectItem>
                </Select>
                </div>
              </div>
            ))}
            <div></div>
          </div>
        )}

        <div className="flex w-[1288px] mx-auto items-center justify-end ">
          <div className="flex items-center justify-center gap-2 rounded-[5px] bg-[#FFFFFF66] px-2 py-2">
            <IoIosArrowBack />
            {currentPage} de {total}
            <IoIosArrowForward />
          </div>
        </div>
      </div>
      <PayDetail
        isOpen={detailIsOpen}
        onClose={detailOnClose}
        detail={billDetail}
      ></PayDetail>
    </>
  );
}

export default BillingView;
