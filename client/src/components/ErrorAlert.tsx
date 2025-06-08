import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

interface ErrorAlertProps {
  message: string;
}

const ErrorAlert = ({ message }: ErrorAlertProps) => (
  <div className="bg-red-50 p-6 rounded-2xl border-2 border-red-100 text-center max-w-md mx-auto">
    <div className="flex justify-center mb-4">
      <ExclamationCircleIcon className="w-12 h-12 text-red-600" />
    </div>
    <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Data</h3>
    <p className="text-red-700">{message}</p>
  </div>
);

export default ErrorAlert