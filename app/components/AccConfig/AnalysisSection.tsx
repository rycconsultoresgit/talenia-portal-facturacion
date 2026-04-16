import { billingService } from "@/app/api/billingService";
import { Billing } from "@/app/types/billing.types";
import { Select, SelectItem } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { BsClipboardCheck } from "react-icons/bs";
import { CiCalendarDate } from "react-icons/ci";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { TbCalendarMonth } from "react-icons/tb";

function AnalysisSection() {
  const [currentPage] = useState(1);
  const [total] = useState(10);
  const [billing, setBilling] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  function moneyParser(value: number): string {
    return value.toLocaleString("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  function getMonthName(monthNumber: number): string {
    const months = [
      "ENEro",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ];

    if (monthNumber < 0 || monthNumber > 11) {
      throw new Error("El número de mes debe estar entre 1 y 12");
    }
    return months[monthNumber];
  }

  useEffect(() => {
    const getFiltredBillings = async (user_id: number): Promise<void> => {
      //Obtenemos todas las compras del usuario
      const bills: Billing[] = await billingService.getBillings(user_id);
      setBilling([...bills]);
      //Armamos el objeto que ira en la tabla
      //Agrupamos por mes
      bills.map((bill: Billing) => {
        const month = new Date(bill.date).getMonth();
        console.log(month);
      });
    };

    getFiltredBillings(2);
  }, []);

  return (
    <div className="ml-[40px] flex h-full max-h-[590px] w-[75%] flex-col items-start justify-start gap-4 text-[16px] text-darkPurple">
      <div className="grid w-full grid-cols-3 gap-[5%]">
        <div className="flex flex-col gap-5 rounded-[10px] border bg-[#FFFFFF4D] p-2">
          <div className="flex items-center gap-2 border-b-1 border-b-[#FFFFFF] py-1">
            <BsClipboardCheck color="#38BD57" />
            CV restantes de este mes
          </div>
          <div>
            <div className="flex items-center gap-2 border-b-[#FFFFFF] text-[20px]">
              5 CVs disponibles
            </div>
            <div className="flex items-center gap-2 border-b-[#FFFFFF] text-[14px]">
              Si no alcanzas a usar tus análisis este mes, ¡no te preocupes!
              Podrás utilizarlos el próximo.
            </div>
          </div>
        </div>
        <div className="flex h-[158px] flex-col gap-4 rounded-[10px] border bg-[#FFFFFF4D] p-2">
          <div className="flex items-center gap-2 border-b-1 border-b-[#FFFFFF] py-1">
            <CiCalendarDate color="#38BD57" />
            CV analizados este año
          </div>
          <div>
            <div className="flex items-center gap-2 border-b-[#FFFFFF] text-[20px]">
              15 CVs analizados
            </div>
            <div className="flex items-center gap-2 border-b-[#FFFFFF] text-[14px]">
              Has analizado 128 CV durante 2025. Último análisis: 2 de noviembre
            </div>
          </div>
        </div>
        <div className="flex h-[158px] flex-col gap-4 rounded-[10px] border bg-[#FFFFFF4D] p-2">
          <div className="flex items-center gap-2 border-b-1 border-b-[#FFFFFF] py-1">
            <TbCalendarMonth color="#38BD57" />
            CV analizados este mes
          </div>
          <div>
            <div className="flex items-center gap-2 border-b-[#FFFFFF] text-[20px]">
              5 CVs analizados
            </div>
            <div className="flex items-center gap-2 border-b-[#FFFFFF] text-[14px]">
              Has analizado 24 CV en lo que va de noviembre. Último análisis: 2
              de noviembre
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <p>Plan Actual</p>
        <div className="flex items-center gap-2">
          <Select
            value={getMonthName(selectedMonth)}
            onChange={(e) => {
              setSelectedMonth(Number(e.target.value));
            }}
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
      </div>
      {billing.length > 0 ? (
        <div className="flex h-fit min-h-[300px] w-full flex-col gap-2 rounded-[10px] bg-[#FFFFFF66] px-2 py-3">
          <div className="grid h-fit w-full grid-cols-5 place-items-center rounded-[5px] bg-[#FFFFFF66] py-1 font-[500] text-[#442F8D]">
            <p>Analisis adquiridos</p>
            <p>Progreso de uso</p>
            <p>Origen de analisis</p>
            <p>Total pago</p>
            <p>Fecha de adquisicion</p>
          </div>

          {billing.map((billing: Billing, index: number) => (
            <div
              key={index}
              className="grid h-fit w-full grid-cols-5 place-items-center rounded-[5px] py-1 text-[16px] font-[300] text-darkPurple"
            >
              <p className="text-[#372AAC]">(+{billing.cvs} CV)</p>
              <div className="flex items-center gap-2">
                <p className="text-[#372AAC]">
                  ({billing.used_cvs + "/" + billing.cvs} CV)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <p>{billing.detail}</p>
              </div>
              <div className="flex items-center gap-2">
                {moneyParser(billing.amount)} CLP
              </div>
              <p>{billing.date.toString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-fit min-h-[300px] w-full flex-col gap-2 rounded-[10px] bg-[#FFFFFF66] px-2 py-3">
          <p>No hay datos disponibles</p>
        </div>
      )}
      <div className="flex w-full items-center justify-end">
        <div className="flex items-center justify-center gap-2 rounded-[5px] bg-[#FFFFFF66] px-2 py-2 text-darkPurple">
          <IoIosArrowBack className="hover:cursor-pointer" />
          {currentPage} de {total}
          <IoIosArrowForward className="hover:cursor-pointer" />
        </div>
      </div>
    </div>
  );
}

export default AnalysisSection;
