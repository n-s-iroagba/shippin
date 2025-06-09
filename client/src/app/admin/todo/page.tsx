"use client"
import { routes } from "@/data/routes"
import { useAuth } from "@/hooks/useAuth"
import { useGetList } from "@/hooks/useGet"
import { useRouter } from "next/navigation"
import { ShippingStage } from '@/types/shipment.types';
import TodoAlert from "@/components/TodoAlert"
import { ReactNode, useEffect } from "react"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { Spinner } from "@/components/Spinner"
import { CryptoWallet } from "@/types/crypto-wallet.types"
import { SocialMedia } from "@/types/social-media.types"


const Todo= () => {
  const { loading: authLoading, isAdmin, displayName,id:adminId } = useAuth()
  console.log(displayName, isAdmin)


  const {
    data: wallets,
    error: walletError,
    loading: walletLoading,
  } = useGetList<CryptoWallet>(routes.cryptoWallet.list(adminId))

  const { data: payments, error: paymentError, loading: paymentLoading } = useGetList<ShippingStage>(routes.stage.unapprovedPayments(adminId))
  const {
    data: socialmedias,
    error: socialMediaError,
    loading: socialMediaLoading,
  } = useGetList<SocialMedia>(routes.socialMedia.list(adminId))




const router = useRouter()


useEffect(() => {

        if (!authLoading && !isAdmin) {
          
          window.location.reload()
        }
    
    

}, [authLoading, isAdmin,  router])


  const todos: ReactNode[] = []

  if (!wallets.length) {
    todos.push(
      <TodoAlert
        key="wallet-alert"
        message="You do not have any wallets, add wallets to start managing transactions"
        link="/admin/crypto-wallets"
      />,
    )
  }

  if (!socialmedias.length) {
    todos.push(
      <TodoAlert
        key="socialmedia-alert"
        message="You do not have any social media links, add social media to start managing transactions"
        link="/admin/social-media"
      />,
    )
  }

  if (payments.length) {
    todos.push(
      <TodoAlert
        key="Pending-payment"
        message="You have pending payments"
        link="/admin/pending-payments"
      />,
    )
  }

  if (authLoading) {
    return (
  
      <div className="flex justify-center items-center h-screen px-4">
        <Spinner className="w-8 h-8 text-blue-600" />
      </div>
 
    )
  }

  if (!isAdmin) {
    return null // Will redirect
  }

  return (
  <>
      {/* Mobile-optimized content container */}
      <div className="w-full">
        {/* Header - Responsive text sizing */}
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 mb-2 flex items-center gap-2 flex-wrap">
            <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0" />
            <span className="break-words">Welcome back, {displayName}!</span>
          </h2>
          <h3 className="text-base sm:text-lg font-semibold text-blue-700">Admin Tasks</h3>
        </div>

        {/* Loading/Error States */}
        {walletLoading || socialMediaLoading||paymentLoading   ? (
          <div className="flex justify-center items-center h-32">
            <Spinner className="w-8 h-8 text-blue-600" />
          </div>
        ) : walletError ||  socialMediaError || paymentError ? (
          <div className="p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200 text-red-700 text-sm sm:text-base">
            Error loading information
          </div>
        ) : (
          /* Tasks Grid - Mobile responsive */
          <div className="space-y-3 sm:space-y-4">
            {todos.length > 0 ? (
              <div className="grid gap-3 sm:gap-4">
                {todos.map((todo, index) => (
                  <div key={index} className="w-full">
                    {todo}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 sm:p-6 bg-blue-50 rounded-lg sm:rounded-xl border border-blue-200 text-center">
                <p className="text-blue-700 font-medium text-sm sm:text-base">
                  🎉 All caught up! No pending tasks
                </p>
              </div>
            )}
          </div>
        )}
      </div>
   </>
  )
}

export default Todo