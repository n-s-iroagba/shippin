"use client";
import { useState } from "react";
import { WalletIcon } from "@heroicons/react/24/outline";
import ErrorAlert from "@/components/ErrorAlert";
import CryptoWalletForm from "@/components/CryptoWalletForm";
import AdminCryptoWalletCard from "@/components/AdminCryptoWalletCard";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { Spinner } from "@/components/Spinner";
import { useGetList } from "@/hooks/useGet";
import { CryptoWallet } from "@/types/crypto-wallet.types";
import { routes } from "@/data/routes";
import { useAuth } from "@/hooks/useAuth";

export default function CryptoWalletCrudPage() {
  const { id, displayName } = useAuth();
  const {
    data: wallets,
    loading,
    error,
  } = useGetList<CryptoWallet>(routes.cryptoWallet.list(id));
  const [createWallet, setCreateWallet] = useState(false);
  const [walletToDelete, setWalletToDelete] = useState<CryptoWallet | null>(
    null
  );
  const [walletToUpdate, setWalletToUpdate] = useState<CryptoWallet | null>(
    null
  );

  if (loading) {
    return <Spinner className="w-10 h-10 text-blue-600" />;
  }

  if (error) {
    return <ErrorAlert message={error || "Failed to load crypto wallets"} />;
  }

  return (
    <>
      <div className="container mx-auto p-4 bg-blue-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900">
              {displayName}&apos;s Crypto Wallets
            </h1>
            <button
              name="addNewWallet"
              onClick={() => setCreateWallet(true)}
              className="bg-blue-900 text-white px-4 py-2 sm:px-6 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            >
              Add New Wallet
            </button>
          </div>

          {createWallet && (
            <CryptoWalletForm onClose={() => setCreateWallet(false)} />
          )}

          {walletToUpdate && (
            <CryptoWalletForm
              existingWallet={walletToUpdate}
              patch
              onClose={() => setWalletToUpdate(null)}
            />
          )}

          {!wallets || wallets.length === 0 ? (
            <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-100 text-center max-w-md mx-auto">
              <div className="flex justify-center mb-4">
                <WalletIcon className="w-12 h-12 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                No Wallets Yet
              </h3>
              <p className="text-blue-700">
                Crypto wallets will appear here once you add them
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {wallets.map((wallet) => (
                <AdminCryptoWalletCard
                  key={wallet.id}
                  wallet={wallet}
                  onEdit={() => {
                    setWalletToUpdate(wallet);
                  }}
                  onDelete={() => setWalletToDelete(wallet)}
                />
              ))}
            </div>
          )}

          {walletToDelete && (
            <DeleteConfirmationModal
              onClose={() => setWalletToDelete(null)}
              id={walletToDelete.id}
              type={"wallet"}
              message={`${walletToDelete.currency} wallet (${
                walletToDelete.label || "No label"
              })`}
            />
          )}
        </div>
      </div>
    </>
  );
}
