import Image, { StaticImageData } from "next/image";
import React from "react";

interface BackgroundOverlayProps {
  imageSrc: StaticImageData;
  overlayColor?: string;
  imageClassName?: string;
  priority?: boolean;
}

const BackgroundOverlay = ({
  imageSrc,
  overlayColor = "bg-[#211D2F66]",
  imageClassName = "object-cover",
  priority = false,
}: BackgroundOverlayProps) => {
  return (
    <div className="fixed inset-0 z-0">
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt="Background"
          fill
          priority={priority}
          quality={100}
          className={imageClassName}
        />
      </div>
      <div className={`absolute inset-0 ${overlayColor}`}></div>
    </div>
  );
};

export default BackgroundOverlay;
