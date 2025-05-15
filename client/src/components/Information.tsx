import Image, { StaticImageData } from "next/image";
import React from "react";
import '../assets/styles/Information.css'
interface ImageData {
  src: StaticImageData;
  text: string;
}

interface InformationProps {
  title: string;
  text: string;
  images: ImageData[];
}

const Information: React.FC<InformationProps> = ({ title, text, images }) => {
  return (
    <div className="p-4 bg-white text-black my-5">

      <h2 className="text-3xl font-bold text-center mb-2">{title}</h2>
      <div className="h-2 bg-goldenrod mx-auto w-20 mb-4"></div>

      <p className="text-center text-gray-700 mb-8">{text}</p>

      <div className="flex gap-4 overflow-x-auto scrollbar-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className="relative w-[90%] md:w-[45%] lg:w-[22%] h-64 flex-shrink-0"
          >
            <Image
              src={image.src}
              alt='ship'
              width='100'
              height='100'
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <p className="text-white text-lg font-semibold text-wrap text-center">{image.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Information;
