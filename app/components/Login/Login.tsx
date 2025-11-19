"use client";

import { Input } from "@heroui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
// import { useAuth } from "@/app/context/AuthContext";
import { toast } from "sonner";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { SHA512 } from "crypto-js";

import { PrimaryButton } from "../Common/Buttons";
import { userService } from "@/app/api/userService";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const { checkAuth } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      toast.error("Por favor ingresa tu correo electrónico");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Por favor ingresa un correo electrónico válido");
      return false;
    }

    if (!formData.password) {
      toast.error("Por favor ingresa tu contraseña");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Realizar el inicio de sesión
      await userService.loginUser({
        email: formData.email.trim(),
        password: SHA512(formData.password).toString(),
      });

      // Verificar que la autenticación fue exitosa
      // const isAuthenticated = await checkAuth();
      const isAuthenticated = true;
      if (isAuthenticated) {
        toast.success("¡Inicio de sesión exitoso!");
        router.push("/home");
      } else {
        throw new Error("Error en la autenticación");
      }
    } catch (error: unknown) {
      let errorMessage =
        "Error al iniciar sesión. Por favor, inténtalo de nuevo.";

      if (error && typeof error === "object" && "response" in error) {
        const apiError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };
        errorMessage = apiError.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-10 rounded-2xl bg-gradient-to-br from-white/50 to-[#DBCFFF]/50 p-14 shadow-sm ring-1 ring-white/80 backdrop-blur-[1px]">
      <h2 className="text-3xl font-semibold text-purple">¡Bienvenido!</h2>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center gap-6"
      >
        <Input
          id="email"
          type="email"
          name="email"
          label="E-mail"
          labelPlacement="outside"
          classNames={{
            label: "text-xl pl-4 font-normal !text-darkPurple",
            input: "focus:outline-none px-4 !text-lightGray placeholder:text-[#bbbbbb]",
            inputWrapper: "rounded-md p-0 shadow-none",
          }}
          value={formData.email}
          onChange={handleChange}
          placeholder="Ingresa tu correo electrónico"
        />

        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          label="Contraseña"
          labelPlacement="outside"
          classNames={{
            label: "text-xl pl-4 font-normal !text-darkPurple ",
            input: "focus:outline-none px-4 !text-lightGray placeholder:text-[#bbbbbb]",
            inputWrapper: "rounded-md p-0 shadow-none",

          }}
          value={formData.password}
          onChange={handleChange}
          placeholder="Ingresa tu contraseña"
          endContent={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={
                showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
              }
            >
              {showPassword ? (
                <FiEyeOff className="h-5 w-5" />
              ) : (
                <FiEye className="h-5 w-5" />
              )}
            </button>
          }
        />

        <h3 className="hidden text-sm font-normal text-lightGray">
          Olvide mi contraseña
        </h3>

        <PrimaryButton
          label={`${isLoading ? "Iniciando..." : "Iniciar Sesión"}`}
          onClick={() => handleSubmit}
          disabled={isLoading}
        />

        {/* TODO: DECOMENTAR PARA HABILITAR ENLACE REGISTRO */}
        <h3 className="hidden text-sm font-normal text-darkPurple">
          ¿No tienes una cuenta? <span className="text-purple">Regístrate</span>
        </h3>
      </form>
    </div>
  );

  /*
  return (
    <div className="h-[435px] w-[369px] rounded-xl bg-primary px-11">
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <Image src={logoPurple} alt="Logo" className="h-[34px] w-[134px]" />
        <h2 className="text-lg font-medium text-white">¡Bienvenido!</h2>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col items-center gap-3"
        >
          <Input
            id="email"
            type="email"
            name="email"
            label="Email"
            labelPlacement="outside"
            classNames={{
              label: "text-xs pl-4 font-light !text-white",
              input: "focus:outline-none pl-2 pr-2",
              inputWrapper: "rounded-md p-0",
            }}
            value={formData.email}
            onChange={handleChange}
            placeholder="Ingresa tu correo electrónico"
          />

          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            label="Contraseña"
            labelPlacement="outside"
            classNames={{
              label: "text-xs pl-4 font-light !text-white",
              input: "focus:outline-none pl-2 pr-2",
              inputWrapper: "rounded-md p-0",
            }}
            value={formData.password}
            onChange={handleChange}
            placeholder="Ingresa tu contraseña"
            endContent={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                aria-label={
                  showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            }
          />

          <PrimaryButton
            label={`${isLoading ? "Iniciando..." : "Iniciar Sesión"}`}
            onClick={() => handleSubmit}
            disabled={isLoading}
            className="mt-6"
          />
        </form>
      </div>
    </div>
  );*/
};

export default Login;
