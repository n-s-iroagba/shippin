"use client"
import Footer from "@/components/Footer"
import type React from "react"

import Header from "@/components/Header"
import Information from "@/components/Information"
import Schedule from "@/components/Schedule"
import ScheduleCard from "@/components/ScheduleCard"
import image1 from "@/assets/images/auto.png"
import image2 from "@/assets/images/ship.png"
import image3 from "@/assets/images/ireefers.jpg"
import image4 from "@/assets/images/restoftheworld.jpg"
import image5 from "@/assets/images/transporttradefair.jpg"
import TestimonialCarousel from "@/components/TestimonialCarousel"
import ContactInfo from "@/components/Contact"
import { useState } from "react"


export default function Home() {
  const images = [
    { src: image1, text: "Automobile Shipping Services" },
    { src: image2, text: "Goods and valuables logistics" },
    { src: image3, text: "Container shipping and logistics" },
    { src: image4, text: "International all over the world" },
    { src: image5, text: "Trade facilitation" },
  ]

  const [trackingId, setTrackingId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTrackShipment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingId.trim()) return

    setLoading(true)
    setError("")
    try {

      // Redirect to tracking dashboard
      window.location.href = `/tracking-dashboard/${trackingId}`
    } catch (err) {
      console.error(err)
      setError("Shipment not found or tracking ID is invalid")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white">
      <Header />

      <Information
        title="Meeting Your Shiping needs"
        text="Discover the best shipping solutions tailored for your needs."
        images={images}
      />
      <Schedule />
      <ContactInfo />
      <TestimonialCarousel />

      <div className="flex justify-center items-center h-48">
        <form onSubmit={handleTrackShipment} className="flex items-center">
          <input
            type="text"
            placeholder="Enter Tracking ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <button
            type="submit"
            disabled={loading}
            className={`ml-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Tracking..." : "Track Shipment"}
          </button>
        </form>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <ScheduleCard />
      <Footer />
    </div>
  )
}
