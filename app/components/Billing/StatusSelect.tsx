import { Select, SelectItem } from "@heroui/react";
import React, { useEffect, useState } from "react";
import { CiCircleCheck } from "react-icons/ci";
import { IoReloadCircleOutline } from "react-icons/io5";

function StatusSelect({ status, updateStatus, detail }) {
  const [state, setState] = useState(status);
  const [hasChanged, sethasChanged] = useState(false);

  // useEffect(() => {
  //   const changeStatus = async () => {
  //     await updateStatus(detail);
  //   };
  //   changeStatus();
  // }, [state]);

  return (
    <Select
      disallowEmptySelection
      aria-label="meh"
      startContent={
        state ? (
          <CiCircleCheck color="green" />
        ) : (
          <IoReloadCircleOutline color="orange" />
        )
      }
      onChange={async (e) => {
        if (hasChanged) {
          setState(!state);
          await updateStatus(detail);
        } else {
          sethasChanged(true);
          if (e.target.value == "0" && !state) {
            setState(true);
            await updateStatus(detail);
          }
          if (e.target.value == "1" && state) {
            setState(false);
            await updateStatus(detail);
          }
        }
      }}
      placeholder={state ? "Pagado" : "Pendiente"}
      className="text-darkPurple"
      classNames={{
        base: "bg-[#FFFFFF66] w-[142px] h-[32px] rounded-[5px] text-darkPurple",
        listbox: "bg-white text-darkPurple",
        popoverContent: "bg-white w-[142px] rounded-[5px] p-0 text-darkPurple",
        trigger:
          "bg-[#FFFFFF66] rounded-[5px] data-[hover=true]:bg-[#FFFFFF66] text-[#645790] min-h-[32px] h-[10px] py-0",
      }}
    >
      <SelectItem key={0} aria-label="meh">
        Pagado
      </SelectItem>
      <SelectItem key={1} aria-label="meh">
        Pendiente
      </SelectItem>
    </Select>
  );
}

export default StatusSelect;
