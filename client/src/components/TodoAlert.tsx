"use client"
import { CheckCircleIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"

interface TodoAlertProps {
  message: string
  link: string
}

export default function TodoAlert({ message, link }: TodoAlertProps) {
  const router = useRouter()
  return (
    <div
      className="relative group bg-blue-900/10 rounded-lg border-2 border-blue-800 backdrop-blur-sm transition-all hover:bg-blue-900/20"
      onClick={() => router.push(link)}
    >
      <div className="flex flex-col items-center gap-4">
        {" "}
        {/* Changed from items-start to items-center */}
        {/* Icon Container */}
        <div className="flex-wrap p-2 bg-blue-100 rounded-full">
          <CheckCircleIcon className="w-6 h-6 text-blue-900 mx-auto" /> {/* Added mx-auto */}
        </div>
        {/* Centered Content */}
        <div className="flex-1 text-center">
          {" "}
          {/* Added text-center here */}
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Admin Action Required</h3>
          <p className="text-blue-800">{message}</p>
        </div>
        {/* Centered Link Button */}
        <a
          href={link}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-900 rounded-md hover:bg-blue-200 transition-colors self-center" /* Changed from self-start */
        >
          <span>Take Action</span>
          <ArrowTopRightOnSquareIcon className="w-4 h-4" />
        </a>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-blue-800 opacity-20" />
      <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-blue-800 opacity-20" />
    </div>
  )
}