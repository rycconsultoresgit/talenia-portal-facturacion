"use client";

import { Button, useDisclosure } from "@heroui/react";
import { IoIosArrowBack} from "react-icons/io";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { SHA512 } from "crypto-js";
import { userService } from "@/app/api/userService";
import { useAuth } from "@/app/context/AuthContext";
import { FormPasswordSection } from "./FormPasswordSection";
import { CiLock } from "react-icons/ci";
import { CiMoneyCheck1 } from "react-icons/ci";
import { HiOutlineClipboardDocumentList } from "react-icons/hi2";
import { PiStarFourLight } from "react-icons/pi";
import BillingSection from "./BillingSection";
import AnalysisSection from "./AnalysisSection";
import AcquireCvModal from "./modals/AcquireCvModal";

interface ConfigSectionProps {
  onGoBack: () => void;
}

type PasswordField = "current" | "new" | "repeat";

interface FormData {
  userName: string;
  email: string;
  currentPassword: string;
  newPassword: string;
  repeatPassword: string;
}

const ConfigSection: React.FC<ConfigSectionProps> = ({ onGoBack }) => {
  const {
    userId,
    username: contextUsername,
    userEmail: contextUserEmail,
    setUsername,
    setUserEmail,
  } = useAuth();

  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    userName: contextUsername || "",
    email: contextUserEmail || "",
    currentPassword: "",
    newPassword: "",
    repeatPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    repeat: false,
  });

  const [menuSelected, setMenuSelected] = useState<
    "Seguridad" | "Facturacion" | "Analisis" | "Acerca"
  >("Seguridad");

  const { isOpen : isAcquireOpen , onClose : onAcquireCLose , onOpenChange : onAcquireOpenChange} = useDisclosure()


  // Cargar los datos del usuario al montar el componente
  useEffect(() => {
    if (contextUsername || contextUserEmail) {
      setFormData((prev) => ({
        ...prev,
        userName: contextUsername || "",
        email: contextUserEmail || "",
      }));
    }
  }, [contextUsername, contextUserEmail]);

  const togglePasswordVisibility = (passwordType: PasswordField) => {
    setShowPasswords((prev) => ({
      ...prev,
      [passwordType]: !prev[passwordType],
    }));
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    // Si se llama desde un evento de formulario, prevenir el comportamiento por defecto
    if (e) {
      e.preventDefault();
    }

    // Validar que las contraseñas coincidan
    if (formData.newPassword !== formData.repeatPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    // Validar longitud mínima de la contraseña
    if (formData.newPassword && formData.newPassword.length < 8) {
      toast.error("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    if (!userId) {
      toast.error("No se pudo identificar al usuario");
      return;
    }

    try {
      setIsLoading(true);
      // Asegurarse de que userId sea un número
      const userIdNumber = Number(userId);
      if (isNaN(userIdNumber)) {
        throw new Error("ID de usuario no válido");
      }

      // Si hay contraseña para actualizar
      if (formData.currentPassword && formData.newPassword) {
        const hashedActualPassword = SHA512(
          formData.currentPassword,
        ).toString();
        const hashedNewPassword = SHA512(formData.newPassword).toString();

        await userService.updatePassword({
          userId: userIdNumber,
          currentPassword: hashedActualPassword,
          newPassword: hashedNewPassword,
        });

        // Limpiar solo los campos de contraseña
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          repeatPassword: "",
        }));

        toast.success("Contraseña actualizada correctamente");
      }

      // Si hay datos de usuario para actualizar
      if (
        formData.userName !== contextUsername ||
        formData.email !== contextUserEmail
      ) {
        const updateData: { username?: string; email?: string } = {};

        // Solo incluir los campos que han cambiado
        if (formData.userName !== contextUsername) {
          updateData.username = formData.userName;
        }

        if (formData.email !== contextUserEmail) {
          updateData.email = formData.email;
        }

        // Solo hacer la llamada si hay algo que actualizar
        if (Object.keys(updateData).length > 0) {
          await userService.updateUser(userIdNumber, updateData);

          // Refrescar el token para que contenga los datos actualizados del usuario
          try {
            await userService.refreshToken();
            console.log("Token refrescado con datos actualizados");
          } catch (refreshError) {
            console.error("Error al refrescar el token:", refreshError);
            // No lanzar error, ya que la actualización fue exitosa
          }

          // Actualizar el contexto con los nuevos valores
          if (updateData.username) {
            setUsername(updateData.username);
          }
          if (updateData.email) {
            setUserEmail(updateData.email);
          }

          toast.success("Información de usuario actualizada correctamente");
        }
      }
    } catch (error: unknown) {
      console.error("Error al actualizar la información:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error al actualizar la información";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div className="my-2 flex h-full w-full flex-col rounded-md bg-gradient-to-r from-[#E9E3FF]/50 via-[#EEE9FF]/30 to-[#D9CEFF]/50 px-4 ring-1 ring-white/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex w-full flex-row items-center justify-between gap-2 my-2 px-[8px]">
        <div className="flex items-center gap-2">
          <Button
            variant="light"
            isIconOnly
            size="sm"
            radius="full"
            onPress={onGoBack}
            className="group data-[hover]:bg-purple"
            aria-label="Volver"
          >
            <IoIosArrowBack
              size={20}
              className="text-lightGray group-hover:text-white"
            />
          </Button>
          <p
            className="cursor-pointer text-lg capitalize text-darkPurple"
            onClick={onGoBack}
          >
            Cuenta
          </p>
        </div>
        <div onClick={onAcquireOpenChange} className="flex h-[32px] w-[175px] items-center justify-center rounded-[5px] bg-gradient-to-r from-[#384DF6] to-[#987EE6] px-1 text-[14px] font-[500] text-white hover:cursor-pointer">
          Adquirir analisis CV
        </div>
      </div>

      <div className="flex h-full w-full flex-col items-center justify-center gap-10 py-2">
        <div className="flex h-full w-full items-start">
          <div className="flex h-fit w-[251px] flex-col gap-2 border-r-1 px-5 text-[16px] font-[400] text-darkPurple">
            <div
              onClick={() => {
                setMenuSelected("Seguridad");
              }}
              className={`flex h-[45px] w-[208px] items-center gap-2 rounded-[5px] border bg-[#FFFFFF3D] ${menuSelected == "Seguridad" ? "bg-gradient-to-r from-[#947CE750] to-[#eeeeee80]" : ""} cursor-pointer`}
            >
              <div
                className={`h-full w-[10px] rounded-bl-md rounded-tl-md ${menuSelected == "Seguridad" ? "bg-lightPurple2" : ""} `}
              ></div>
              <CiLock color="#384DF6" />
              Seguridad
            </div>
            <div
              onClick={() => {
                setMenuSelected("Facturacion");
              }}
              className={`flex h-[45px] w-[208px] items-center gap-2 rounded-[5px] border bg-[#FFFFFF3D] ${menuSelected == "Facturacion" ? "bg-gradient-to-r from-[#947CE750] to-[#eeeeee80]" : ""} cursor-pointer`}
            >
              <div
                className={`h-full w-[10px] rounded-bl-md rounded-tl-md ${menuSelected == "Facturacion" ? "bg-lightPurple2" : ""} `}
              ></div>
              <CiMoneyCheck1 color="#384DF6" />
              Facturación
            </div>
            <div
              onClick={() => {
                setMenuSelected("Analisis");
              }}
              className={`flex h-[45px] w-[208px] items-center gap-2 rounded-[5px] border bg-[#FFFFFF3D] ${menuSelected == "Analisis" ? "bg-gradient-to-r from-[#947CE750] to-[#eeeeee80]" : ""} cursor-pointer`}
            >
              <div
                className={`h-full w-[10px] rounded-bl-md rounded-tl-md ${menuSelected == "Analisis" ? "bg-lightPurple2" : ""} `}
              ></div>
              <HiOutlineClipboardDocumentList color="#384DF6" />
              Mis análisis
            </div>
            <div
              onClick={() => {
                setMenuSelected("Acerca");
              }}
              className={`flex h-[45px] w-[208px] items-center gap-2 rounded-[5px] border bg-[#FFFFFF3D] ${menuSelected == "Acerca" ? "bg-gradient-to-r from-[#947CE750] to-[#eeeeee80]" : ""} cursor-pointer`}
            >
              <div
                className={`h-full w-[10px] rounded-bl-md rounded-tl-md ${menuSelected == "Acerca" ? "bg-lightPurple2" : ""} `}
              ></div>
              <PiStarFourLight color="#384DF6" />
              Acerca de TalenIA
            </div>
          </div>
          <div className="flex w-full justify-center items-center ">
            {menuSelected == "Seguridad" ? (
            <div className="mb-2  flex w-[450px] max-w-xl justify-center rounded-2xl bg-gradient-to-br from-white/40 to-[#D9CEFF]/50 py-6 ring-1 ring-white/50 backdrop-blur-sm">
              <FormPasswordSection
                formData={{
                  currentPassword: formData.currentPassword,
                  newPassword: formData.newPassword,
                  repeatPassword: formData.repeatPassword,
                }}
                showPasswords={showPasswords}
                isLoading={isLoading}
                onPasswordChange={(field, value) =>
                  setFormData((prev) => ({ ...prev, [field]: value }))
                }
                onTogglePassword={togglePasswordVisibility}
                onSubmit={handleSubmit}
              />
            </div>
          ) : (
            <></>
          )}

          {menuSelected == "Facturacion" ? (
            <BillingSection></BillingSection>
          ) : (
            <></>
          )}

          {menuSelected == "Analisis" ? <AnalysisSection /> : <></>}

          {menuSelected == "Acerca" ? (
            <div className="text-darkPurple mb-2 flex w-[450px] max-w-xl justify-center rounded-2xl bg-gradient-to-br from-white/40 to-[#D9CEFF]/50 py-6 ring-1 ring-white/50 backdrop-blur-sm">
              Proximamente ...
            </div>
          ) : (
            <></>
          )}
          </div>
          
        </div>
      </div>
    </div>
    <AcquireCvModal isOpen={isAcquireOpen} onClose={onAcquireCLose}></AcquireCvModal>
    </>
    
  );
};

export default ConfigSection;
