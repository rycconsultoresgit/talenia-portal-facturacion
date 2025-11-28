"use client";

import { Modal, ModalContent } from "@heroui/react";

interface Detail {
  id: string;
  transaction_type: string;
  user_id: number;
  name: string;
  price: number;
  date: string;
  status: true;
  cvs: number;
  user_cvs: number;
}
interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  detail: Detail[];
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

  const total = detail.reduce((acc, pay) => acc + pay.price, 0);
  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onClose={onClose}
      placement="center"
      backdrop="blur"
      className="flex h-fit min-h-[346px] flex-col items-center justify-start rounded-xl bg-white/70 backdrop-blur-sm"
      classNames={{
        backdrop: "bg-darkPurple/40 backdrop-blur-sm ",
      }}
    >
      <ModalContent
        className={`my-10 flex h-fit flex-col gap-5 bg-cover px-10 py-8 text-darkPurple`}
      >
        <div className="flex w-full flex-col items-center justify-center gap-6">
          <p className="w-full text-start text-[16px] font-[600] text-[#372AAC]">
            Resumen de pago total
          </p>

          <div className="w-full bg-[#FFFFFF4D] py-4 px-1 rounded-[7px]">
            <div>
              {detail.map((pay: any, index: number) => {
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
            <div className=" px-2 border-t-1 border-t-[#bbbbbb] py-1 my-1">
              <div className="flex w-full items-center justify-between">
                <p>Monto total</p>
                <p>{"$" + moneyParser(total)}</p>
              </div>

              <div className="mx-auto flex w-full items-center gap-2  py-1">
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

          <div className="flex w-full items-center justify-end gap-2">
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
