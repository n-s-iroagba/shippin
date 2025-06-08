"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authApi } from "@/utils/apiUtils"
import ErrorAlert from "@/components/ErrorAlert"


export default function LoginPage() {
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (formData: Record<string, string>) => {
    try {
      const { data, error: apiError } = await authApi.login({
        email: formData.email,
        password: formData.password,
      })

      if (data?.loginToken) {
        localStorage.setItem("admin_token", data.loginToken)
        router.push("/admin/dashboard")
      } else if (apiError) {
        handleApiError(apiError, data as { verificationToken: string })
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred. Please try again later.")
    }
  }

  const handleApiError = (error: string, data?: { verificationToken: string }) => {
    if (error.includes("Invalid credentials")) {
      setError("Incorrect email or password.")
    } else if (error.includes("Email not verified")) {
      alert("Please verify your email before logging in.")
      router.push(`/admin/verify-email/${data?.verificationToken || ""}`)
    } else {
      setError("An error occurred. Please try again later.")
    }
  }

  return (
           <div className="flex justify-center align-center pt-5">
        <form
        className="w-full max-w-lg bg-white bg-opacity-90 p-6 rounded-lg border-b-4 border-goldenrod"
        >
          {error && <ErrorAlert error={error}/>}
          <div className="mb-4">
            <h2 className="text-black text-center">ADMIN LOGIN</h2>
          </div>
          <div className="mb-4">
            <label
              htmlFor="booking-id"
              className="block text-sm font-medium text-gray-700"
            >
              EMAIL
            </label>
            <input
              type="text"
              id="booking-id"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text- text-black"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="booking-id"
              className="block text-sm font-medium text-gray-700"
            >
              PASSWORD
            </label>
            <input
              type="text"
              id="booking-id"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text- text-black"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-goldenrod text-black py-2 px-4 rounded-md"
            onClick={()=>handleSubmit}
          >
            Submit
          </button>
        </form>
        </div>
  )
}
