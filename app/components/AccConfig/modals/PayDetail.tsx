"use client";

import { Modal, ModalContent } from "@heroui/react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";
import { BsDownload } from "react-icons/bs";
import type { BillingPayDetail } from "@/app/types/billing.types";
interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  detail: BillingPayDetail[];
}

const PayDetail = ({
  isOpen,
  onClose,
  detail,
}: Readonly<RoadmapModalProps>) => {
  function moneyParser(value: number): string {
    return value.toLocaleString("es-CL", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  const pdfref = useRef(null);
  const handleDownloadPDF = async () => {
    if (!pdfref.current) return;

    // Capturar el contenido del modal como canvas
    const canvas = await html2canvas(pdfref.current, { scale: 2 });

    const imgData = canvas.toDataURL("image/png");

    // Crear PDF
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("detalle_pago.pdf");
  };

  const total = detail.reduce((acc, pay) => acc + pay.price, 0);
  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      className="flex h-fit min-h-[346px] flex-col items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm"
      classNames={{
        backdrop: "bg-darkPurple/40 backdrop-blur-sm ",
      }}
    >
      <ModalContent
        className={`my-10 flex h-fit flex-col gap-5 bg-cover px-10 py-8 text-darkPurple`}
      >
        <div className="flex w-full flex-col items-center justify-center gap-5">
          <div className="w-full  flex flex-col gap-2 px-2" ref={pdfref}>
            <p className="w-full text-start text-[16px] font-[600] text-[#372AAC]">
              Resumen de pago total
            </p>

            <div className="w-full rounded-[7px] bg-[#FFFFFF4D] px-1 py-4">
              <div>
                {detail.map((pay: BillingPayDetail, index: number) => {
                  return (
                    <div
                      key={index}
                      className="flex w-full items-center justify-between px-2"
                    >
                      <div className="flex items-center gap-2">
                        <p>{pay.date}-</p>
                        <p>
                          {pay.transaction_type == "plan" ? "Plan " : "Pack "}
                          {pay.name}
                        </p>
                      </div>
                      <p>{"$" + moneyParser(pay.price)}</p>
                    </div>
                  );
                })}
              </div>
              <div className="my-1 border-t-1 border-t-[#bbbbbb] px-2 py-1">
                <div className="flex w-full items-center justify-between">
                  <p>Monto total</p>
                  <p>{"$" + moneyParser(total)}</p>
                </div>

                <div className="mx-auto flex w-full items-center gap-2 py-1">
                  <div className="flex w-full items-center justify-between">
                    <p>I.V.A 19%</p>
                    <p>{"$" + moneyParser(total * 0.19)}</p>
                  </div>
                </div>
              </div>

              <div className="mx-auto flex w-full items-center gap-2 border-t-1 border-t-[#bbbbbb] px-2 py-1">
                <div className="flex w-full items-center justify-between">
                  <p>Total</p>
                  <p>{"$" + moneyParser(total + total * 0.19)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-between gap-2 px-2">
            <div className="hover:cursor-pointer flex items-center gap-2 bg-[#FFFFFF66] px-2 py-1 rounded-[5px] h-[32px] text-[14px]"
              onClick={() => {
                handleDownloadPDF();
              }}
            >
              <BsDownload /> Descargar resumen
            </div>
            <div
              onClick={onClose}
              className="flex h-[32px] w-[102px] items-center justify-center rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-2 py-1 text-[14px] font-[500] text-white hover:cursor-pointer"
            >
              Entendido
            </div>
            
          </div>
        </div>
      </ModalContent>
    </Modal>
  );
};

export default PayDetail;
