// components/ErrorAlert.js


const ErrorAlert:React.FC<{error:string}> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="bg-red-100 text-red-700 px-4 py-2 text-center rounded">
      {error}
    </div>
  );
};



export default ErrorAlert;
