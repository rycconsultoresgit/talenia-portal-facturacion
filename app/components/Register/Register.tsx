"use client";

import Link from "next/link";
import { Input } from "@heroui/react";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PrimaryButton } from "../Common/Buttons";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Por favor ingresa tu nombre completo");
      return false;
    }

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
      toast.error("Por favor ingresa una contraseña");
      return false;
    }

    if (formData.password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres");
      return false;
    }

    if (!/[A-Z]/.test(formData.password)) {
      toast.error("La contraseña debe contener al menos una letra mayúscula");
      return false;
    }

    if (!/[a-z]/.test(formData.password)) {
      toast.error("La contraseña debe contener al menos una letra minúscula");
      return false;
    }

    if (!/[0-9]/.test(formData.password)) {
      toast.error("La contraseña debe contener al menos un número");
      return false;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      toast.error("La contraseña debe contener al menos un carácter especial");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
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
      // Call the registration API
      /*await userService.registerUser({
        username: formData.name.trim(),
        email: formData.email.trim(),
        password: hashedPassword,
      });*/

      toast.success("¡Registro exitoso! Por favor inicia sesión.");
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/");
    } catch (error: unknown) {
      console.error("Error during registration:", error);
      let errorMessage = "Error al registrar el usuario";

      // Verificar si es un error de Axios
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };
        errorMessage = axiosError.response?.data?.message || errorMessage;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-10 rounded-2xl bg-gradient-to-br from-white/50 to-[#DBCFFF]/50 p-14 shadow-sm ring-1 ring-white/80 backdrop-blur-[1px]">
      <h2 className="text-3xl font-semibold text-purple">¡Regístrate!</h2>
      <form
        onSubmit={handleSubmit}
        className="flex w-full flex-col items-center gap-5"
      >
        <Input
          id="name"
          type="text"
          name="name"
          label="Nombre completo"
          labelPlacement="outside"
          classNames={{
            label: "text-xl pl-4 font-normal !text-darkPurple",
            input: "focus:outline-none px-4 !text-lightGray",
            inputWrapper: "rounded-md p-0 shadow-none",
          }}
          value={formData.name}
          onChange={handleChange}
          placeholder="Ingresa tu nombre completo"
        />

        <Input
          id="email"
          type="email"
          name="email"
          label="E-mail"
          labelPlacement="outside"
          classNames={{
            label: "text-xl pl-4 font-normal !text-darkPurple",
            input: "focus:outline-none px-4 !text-lightGray",
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
            label: "text-xl pl-4 font-normal !text-darkPurple",
            input: "focus:outline-none px-4 !text-lightGray",
            inputWrapper: "rounded-md p-0 shadow-none",
          }}
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••••••"
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

        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          label="Confirmar contraseña"
          labelPlacement="outside"
          classNames={{
            label: "text-xl pl-4 font-normal !text-darkPurple",
            input: "focus:outline-none px-4 !text-lightGray",
            inputWrapper: "rounded-md p-0 shadow-none",
          }}
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••••••"
          endContent={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={
                showConfirmPassword
                  ? "Ocultar contraseña"
                  : "Mostrar contraseña"
              }
            >
              {showConfirmPassword ? (
                <FiEyeOff className="h-5 w-5" />
              ) : (
                <FiEye className="h-5 w-5" />
              )}
            </button>
          }
        />

        <PrimaryButton
          label={`${isLoading ? "Registrando..." : "Crear cuenta"}`}
          onClick={() => handleSubmit}
          disabled={isLoading}
        />

        <h3 className="text-sm font-normal text-darkPurple">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/" className="text-purple hover:underline">
            Inicia sesión
          </Link>
        </h3>
      </form>
    </div>
  );
};

export default Register;
