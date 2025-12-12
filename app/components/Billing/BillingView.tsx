import React, { useEffect, useState } from "react";
import { billingService } from "@/app/api/billingService";
import { Select, SelectItem, Spinner, useDisclosure } from "@heroui/react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { IoReloadCircleOutline } from "react-icons/io5";
import { CiCircleCheck } from "react-icons/ci";
import { BiSearch } from "react-icons/bi";
import { useBillingAll } from "@/app/api/queries/billingService";
import { FiAlertOctagon } from "react-icons/fi";
import PayDetail from "../AccConfig/modals/PayDetail";
import StatusSelect from "./StatusSelect";

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

function BillingView() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [changedStatus, setchangedStatus] = useState(0)
  const [find, setFind] = useState("");
  const {
    isOpen: detailIsOpen,
    onOpenChange: detailOnOpenChange,
    onClose: detailOnClose,
  } = useDisclosure();
  const [billDetail, setBillDetail] = useState([]);
  const { billingAll, totalBilling, isLoadingBillings, refetch } =
    useBillingAll({
      month: selectedMonth,
      year: selectedYear,
      find: find,
    });
  const months = [
    { key: 1, label: "Ene" },
    { key: 2, label: "Feb" },
    { key: 3, label: "Mar" },
    { key: 4, label: "Abr" },
    { key: 5, label: "May" },
    { key: 6, label: "Jun" },
    { key: 7, label: "Jul" },
    { key: 8, label: "Agu" },
    { key: 9, label: "Sep" },
    { key: 10, label: "Oct" },
    { key: 11, label: "Nov" },
    { key: 12, label: "Dic" },
  ];

  function moneyParser(value: number): string {
    return value.toLocaleString("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  //Actualiza el estado de todos los pagos
  const updateStatus = async (pays: any[]): Promise<void> => {
    Promise.all(
      pays.map(async (pay) => {
        await billingService.updateStatus(pay.id);
      }),
    );
    refetch();
  };

  useEffect(() => {
    refetch();
  }, [selectedMonth,changedStatus]);

  return (
    <>
      <div className="flex h-[633px] w-full flex-col justify-center gap-5 rounded-lg bg-gradient-to-r from-[#E9E3FF] to-[#D9CEFF] px-5 py-4">
        <div className="mx-auto flex h-[32px] w-[1288px] items-center justify-between rounded-lg">
          <p className="text-[18px] font-[500] text-[#645790]">
            Panel de facturacion
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center justify-center gap-2">
              <div className="flex items-center gap-2">
                <Select
                  disallowEmptySelection
                  aria-label="random"
                  placeholder="Dic"
                  onSelectionChange={(e) => {
                    setSelectedMonth(Number(e.currentKey));
                  }}
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
                  {months.map(
                    (month: { key: number; label: string }, index) => (
                      <SelectItem key={index}>{month.label}</SelectItem>
                    ),
                  )}
                </Select>

                <Select
                  aria-label="random"
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

              {/* <div className="flex h-[32px] w-full items-center gap-2 rounded-[5px] bg-white px-3 focus:outline-none">
                <BiSearch color="#CACCFD" />
                <input
                  value={find}
                  onChange={(e) => {
                    setFind(e.target.value);
                  }}
                  className="text-[14px] text-[#333333] focus:outline-none"
                  placeholder="Buscar"
                ></input>
              </div> */}
            </div>
          </div>
        </div>
        {/*Mostramos el spinner mientras carga*/}
        {isLoadingBillings ? (
          <div className="flex h-[500px] w-full flex-col items-center justify-center gap-2 overflow-scroll rounded-[10px] bg-[#FFFFFF66] px-4 py-4">
            <Spinner></Spinner>
          </div>
        ) : totalBilling > 0 ? (
          <div className="mx-auto flex h-[500px] w-[1288px] min-w-fit flex-col items-center gap-2 rounded-[10px] bg-[#FFFFFF66] py-4">
            <div className="grid h-[50px] w-full min-w-[1286px] grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-start items-center rounded-[5px] bg-[#FFFFFF66] px-8 text-[16px] font-[500] text-[#442F8D]">
              <div className="w-full">Cliente</div>
              <div className="w-full">Mes</div>
              <div className="w-full">Pago plan</div>
              <div className="w-full">Analisis extra</div>
              <div className="w-full">Total pago</div>
              <div className="w-full">Fecha de pago</div>
              <div className="w-full">Estado</div>
            </div>

            {billingAll?.map(
              (bill: { user: any; months: any[] }, index: number) => (
                <div key={index} className="w-full">
                  {bill.months.map((month, index) => {
                    return (
                      <div
                        key={index}
                        className="grid h-[50px] w-full grid-cols-[1fr_1fr_1fr_1fr_1fr_1fr_1fr] place-items-start items-center px-8"
                      >
                        <div className="w-full">{bill.user}</div>
                        <div className="w-full">{month.month}</div>
                        <div className="w-full">
                          ${moneyParser(month.plan)} CLP
                        </div>
                        <div className="flex w-full">
                          <div>
                            {month.extra > 0
                              ? "$" + moneyParser(month.extra) + " CLP"
                              : "No adquirido"}{" "}
                          </div>
                        </div>
                        <div className="flex w-full items-center gap-2">
                          <div>
                            ${moneyParser((month.plan + month.extra) * 1.19)}{" "}
                            CLP
                          </div>

                          <div
                            onClick={() => {
                              setBillDetail(month.detail);
                              detailOnOpenChange();
                            }}
                          >
                            <AiOutlineInfoCircle color="#947CE7" />
                          </div>
                        </div>
                        <div className="w-full">{month.detail[0].date}</div>
                        <div>
                          <StatusSelect detail={month.detail} updateStatus={updateStatus} status={month.status}></StatusSelect>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="mx-auto flex h-[500px] w-[1288px] min-w-fit flex-col items-center justify-center gap-2 rounded-[10px] bg-[#FFFFFF66] py-4 text-[14px]">
            <FiAlertOctagon size={24} color="#947CE7" />
            No hay datos disponibles por el momento
          </div>
        )}
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
