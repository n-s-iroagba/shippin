"use client"




export default function LoginPage() {


  const handleSubmit = async () => {

  }


  return (
           <div className="flex justify-center align-center pt-5">
        <form
        className="w-full max-w-lg bg-white bg-opacity-90 p-6 rounded-lg border-b-4 border-goldenrod"
        >
          {/* {error && <ErrorAlert error={error}/>} */}
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
