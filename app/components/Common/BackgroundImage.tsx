import Image from "next/image";
import login_bg from "./../../assets/login_bg.jpg";

const BackgroundImage = ({ isLoginPage = false }: { isLoginPage: boolean }) => {
  return (
    <div className="fixed inset-0 w-full">
      <div className="absolute inset-0">
        <Image
          src={login_bg}
          alt="Background"
          fill
          className="object-cover object-center"
        />
        {/* Overlay gradiente sobre la imagen de fondo */}
        <div
          className={`absolute inset-0 z-10 ${isLoginPage ? "bg-gradient-to-r" : "bg-gradient-to-t"} from-taleniaBlue to-customPurple opacity-60`}
        />
      </div>
    </div>
  );
};

export default BackgroundImage;
