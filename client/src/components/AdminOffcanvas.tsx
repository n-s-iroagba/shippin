"use client"
import { useState, useEffect } from "react"
import type React from "react"

import {
  XMarkIcon,
  Bars3Icon,
  UserCircleIcon,
  WalletIcon,
  LinkIcon,
  CurrencyDollarIcon,
  UserMinusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { protectedApi } from "@/utils/apiUtils"
import { routes } from "@/data/routes"

interface AdminOffcanvasProps {
  children: React.ReactNode
}

export default function AdminOffcanvas({ children }: AdminOffcanvasProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const router = useRouter()
  useEffect(() => {
    const handleResize = () => {
      const isLargeScreen = window.innerWidth >= 1024
      setIsDesktop(isLargeScreen)
      setIsOpen(isLargeScreen)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleNavClick = () => {
    if (!isDesktop) {
      setIsOpen(false)
    }
  }

  const logout= async ()=>{
    try{
   await  protectedApi.get(routes.auth.logout)
   
    router.push('/login')
    }
    catch(err){
      alert('Unable to log out an error occured')
      console.log(err)
    }
    
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Menu Button - Adjusted positioning */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-2 left-2 z-50 p-2 rounded-lg bg-blue-100 border border-blue-900 text-blue-900 shadow-lg hover:bg-blue-200 transition-all"
        aria-label="Toggle navigation"
      >
        {isOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
      </button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 lg:hidden z-40" onClick={() => setIsOpen(false)} />}

      {/* Sidebar - Optimized for mobile */}
      <aside
        className={`fixed lg:relative top-0 left-0 h-full z-50 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          lg:translate-x-0 w-64 sm:w-72 lg:w-64 bg-blue-900 border-r border-blue-700 shadow-xl lg:shadow-none`}
      >
        <nav className="h-full overflow-y-auto p-3 lg:p-4 flex flex-col">
          {/* Header - Compact on mobile */}
          <div className="mb-4 p-3 lg:p-4 border-b border-blue-700">
            <UserCircleIcon className="h-8 w-8 lg:h-10 lg:w-10 text-blue-100 mx-auto" />
            <h2 className="mt-2 text-center text-base lg:text-lg font-semibold text-blue-100">Admin Dashboard</h2>
          </div>

          {/* Navigation Items - Improved mobile spacing */}
          <div className="flex flex-col gap-1">
            {[
              { href: "/admin/shipment-details", text: "My Shipments", icon: UserPlusIcon },
              { href: "/admin/pending-payments", text: "My Pending Payments", icon: CurrencyDollarIcon },
              { href: "/admin/document-templates", text: "My Document Templates", icon: UserCircleIcon },
              { href: "/admin/social-media", text: "Social Media Links", icon: LinkIcon },
              { href: "/admin/crypto-wallets", text: "My Wallet", icon: WalletIcon },
            ].map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center gap-3 text-blue-900 p-3 rounded-lg
                         bg-blue-100/10 hover:bg-blue-100/20 active:bg-blue-100/30 transition-all
                         border border-transparent hover:border-blue-100/30 touch-manipulation"
                onClick={handleNavClick}
              >
                <item.icon className="h-4 w-4 lg:h-5 lg:w-5 text-blue-100 flex-shrink-0" />
                <span className="text-blue-100 font-medium text-sm lg:text-base truncate">{item.text}</span>
              </Link>
            ))}
                <Link
              href={''}
             
                className="flex items-center gap-3 text-blue-900 p-3 rounded-lg
                         bg-blue-100/10 hover:bg-blue-100/20 active:bg-blue-100/30 transition-all
                         border border-transparent hover:border-blue-100/30 touch-manipulation"
                onClick={()=>logout()}
              >
                <UserMinusIcon className="h-4 w-4 lg:h-5 lg:w-5 text-blue-100 flex-shrink-0" />
                <span className="text-blue-100 font-medium text-sm lg:text-base truncate">Log out</span>
              </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content Area - Mobile optimized */}
      <main className={`flex-1 transition-all duration-300 ${isOpen && !isDesktop ? 'overflow-hidden' : ''}`}>
        <div className="p-3 sm:p-4 lg:p-6 min-h-screen">
          {/* Mobile top padding to account for menu button */}
          <div className="pt-12 lg:pt-0">
            <div className="max-w-6xl mx-auto bg-white rounded-lg lg:rounded-xl shadow-sm border border-blue-100 p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}