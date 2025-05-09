"use client"
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Information from "@/components/Information";
import Schedule from "@/components/Schedule";
import ScheduleCard from "@/components/ScheduleCard";
import image1 from '@/assets/images/auto.png'
import image2 from '@/assets/images/ship.png'
import image3 from '@/assets/images/ireefers.jpg'
import image4 from '@/assets/images/restoftheworld.jpg'
import image5 from '@/assets/images/transporttradefair.jpg'
import TestimonialCarousel from "@/components/TestimonialCarousel";
import ContactInfo from "@/components/Contact";


export default function H() {
  const images = [
    { src: image1, text: "Automobile Shipping Services" },
    { src: image2, text: "Goods and valuables logistics" },
    { src: image3, text: "Container shipping and logistics" },
    { src: image4, text: 'International all over the world' },
    { src: image5, text: "Trade facilitation" },

  ];
  return (
    <div className="bg-white">
    <Header/>
    
    <Information
        title="Meeting Your Shiping needs"
        text="Discover the best shipping solutions tailored for your needs."
        images={images}
      />
      <Schedule/>
      <ContactInfo/>
      <TestimonialCarousel/>
     
      <ScheduleCard/>
      <Footer/>
    </div>
  );
}
