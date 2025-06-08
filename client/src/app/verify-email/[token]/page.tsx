"use client"
import { authApi } from "@/utils/apiUtils"
import type React from "react"

import { useParams, useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"

const VerifyEmail = () => {
  const params = useParams()
  const urlToken = params.token
  const [code, setCode] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef<HTMLInputElement[]>([])
  const [message, setMessage] = useState("")
  const [timeLeft, setTimeLeft] = useState(300) // 5-minute countdown
  const [canResend, setCanResend] = useState(false)
  const [token, setToken] = useState<string>("")
  const router = useRouter()

  useEffect(() => {
    if (!urlToken) {
      alert("You are not authorised to view this page")
      router.push("/")
    } else {
      setToken(Array.isArray(urlToken) ? urlToken[0] : urlToken)
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router, urlToken])

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return // Allow only numbers

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    const verificationCode = code.join("")
    try {
      const { loginToken } = await authApi.verifyEmail({ code: verificationCode, verificationToken: token })
      localStorage.setItem("admin_token", loginToken)
      router.push(`/admin/dashboard`)
    } catch (err) {
      console.error(err)
    }
  }

  const handleResendCode = async () => {
    setCanResend(false)
    setTimeLeft(300)

    const res = await fetch("/api/resend-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })

    const data = await res.json()
    setMessage(data.message)
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-bold text-center text-black">Verify Your Email</h2>
        {message && <p className="text-center mt-2 text-red-600">{message}</p>}
        {
          // token &&
          <form onSubmit={handleVerify} className="mt-4">
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el!
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-lg text-black border border-black rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                />
              ))}
            </div>
            <button type="submit" className="w-full bg-goldenrod text-black p-2 rounded mt-4 text-black">
              Verify
            </button>
          </form>
        }

        {/* Countdown Timer */}
        <p className="text-center text-gray-600 mt-2">
          {canResend ? "Didn't receive a code?" : `Resend code in ${Math.floor(timeLeft / 60)}:${timeLeft % 60}`}
        </p>

        {/* Resend Code Button */}
        <button
          onClick={handleResendCode}
          disabled={!canResend}
          className={`w-full mt-2 p-2 rounded ${canResend ? "bg-blue-500 text-white" : "bg-gray-300 text-gray-500"}`}
        >
          Resend Code
        </button>
      </div>
    </div>
  )
}

export default VerifyEmail
