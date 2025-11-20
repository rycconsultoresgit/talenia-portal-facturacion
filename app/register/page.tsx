import Image from "next/image";
import { AiFillCheckCircle } from "react-icons/ai";

import logo_gradiente from "../assets/logo_gradient.png";
import MainContainer from "../components/Common/MainContainer";
import LoginFooter from "../components/Login/LoginFooter";
import Register from "../components/Register/Register";
import BackgroundImage from "../components/Common/BackgroundImage";

import login_bg from "../assets/login_container_bg.png";

const RegisterPage = () => {
  return (
    <div className="relative min-h-screen w-full select-none overflow-hidden">
      <BackgroundImage isLoginPage />

      <MainContainer src={login_bg} isLoginPage>
        <div className="z-20 flex w-full flex-col items-center justify-center">
          <div className="flex w-full flex-row items-center justify-center">
            <div className="flex w-1/2 flex-col items-start justify-center px-52">
              <Image
                src={logo_gradiente}
                alt="Logo TalenIA"
                className="pointer-events-none w-56 rounded-lg object-cover object-center pb-20"
              />

              <div className="flex flex-col gap-2">
                <h2 className="text-5xl font-semibold text-lightPurple2">
                  Analiza
                </h2>
                <h2 className="text-5xl font-semibold text-lightPurple2">
                  Compara
                </h2>
                <div className="relative inline-block">
                  <AiFillCheckCircle className="pointer-events-none absolute -left-12 top-1/2 size-8 -translate-y-1/2 select-none text-purple" />
                  <h3 className="text-5xl font-semibold text-purple">
                    Selecciona
                  </h3>
                </div>
              </div>
              <p className="py-5 text-3xl font-medium text-lightGray">
                El mejor talento con datos reales.
              </p>
            </div>

            <div className="flex w-1/2 items-center justify-center">
              <Register />
            </div>
          </div>

          <LoginFooter />
        </div>
      </MainContainer>
    </div>
  );
};

export default RegisterPage;
