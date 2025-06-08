import React, { useState } from "react";
import Navbar from "./Navbar";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useRouter } from "next/navigation";
import Image, { StaticImageData } from "next/image";
import image1 from '../assets/images/header.jpg'
import image2 from '../assets/images/transporttradefair.jpg'
import image3 from '../assets/images/ship.png'

const Header: React.FC = () => {
  const [trackingId,setTrackingId] = useState('')
  const router = useRouter()
  

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/tracking-dashboard/${trackingId}`)
    
  };
  const images:StaticImageData[] = [image1, image2, image3]

  return (
    <header className="relative bg-cover bg-center h-screen lg:h-[80vh] bg-image flex flex-col py-4">
  
      <Navbar />
      {/* Background Carousel */}
      <div className="absolute inset-0 z-0">
        <Carousel
          autoPlay
          infiniteLoop
          showThumbs={false}
          showArrows={false}
          showIndicators={false}
          showStatus={false}
          interval={5000}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full h-full">
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-screen lg:h-[80vh] object-cover"
              />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

   

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between flex-grow text-center text-white">
        <div className="mt-8">
          <h1 className="text-4xl my-4">LEADER IN</h1>
          <h1 className="text-4xl font-bold mb-4">SHIPPING LOGISTICS</h1>
        </div>

        {/* Tracking Form */}
        <div className="relative z-10 flex items-center justify-center mb-4">
          <form
            onSubmit={handleFormSubmit}
            className="w-full max-w-lg bg-white bg-opacity-90 p-6 rounded-lg border-b-4 border-yellow-500"
          >
            <div className="mb-4">
              <h2 className="text-black text-center">TRACK YOUR SHIPMENT</h2>
            </div>
            <div className="mb-4">
              <label
                htmlFor="booking-id"
                className="block text-sm font-medium text-gray-700"
              >
                TRACKING ID
              </label>
              <input
                type="text"
                id="booking-id"
                className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Your Tracking Id"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-500 text-black py-2 px-4 rounded-md"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </header>
  );
};

export default Header;
