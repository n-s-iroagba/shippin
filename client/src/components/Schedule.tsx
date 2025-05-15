import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";

const portOptions = [
  { value: "Aarhus, Denmark (DKAAR)", label: "Aarhus, Denmark (DKAAR)" },
  { value: "Adelaide, Australia (AUADL)", label: "Adelaide, Australia (AUADL)" },
  { value: "Shanghai, China (CNSHA)", label: "Shanghai, China (CNSHA)" },
  { value: "Los Angeles, USA (USLAX)", label: "Los Angeles, USA (USLAX)" },
];

const Schedule: React.FC = () => {
  const [fromPort, setFromPort] = useState<string>('');
  const [toPort, setToPort] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState(new Date())

  useEffect(() => {
   
    setSelectedDate(new Date())
  }, []);
  const handleSearch = () => {
    alert('No shipping from this port on this date')
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
   
      <h2 className="text-2xl font-bold text-center mb-4 relative">
        Point-to-Point
        <div className="absolute left-1/2 transform -translate-x-1/2 mt-1 h-1 w-24 bg-goldenrod rounded-full"></div>
      </h2>


      <div className="flex items-center justify-between gap-4">
  
        <div className="flex flex-col w-1/3">
          <label className="text-sm font-medium mb-1">From Port</label>
          <select
            
            value={fromPort}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFromPort(e.target.value)}
       
            className="text-sm text-black bg-white"
          >.
          {portOptions.map((option, idx)=>{
            return <option key={idx} value={option.value}>{option.label}</option>
          }
          
          )}
          </select>
          <div className="mt-2">
            <input
              value={selectedDate.toDateString()}
              className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-goldenrod text-black"
           
            />
          </div>
        </div>

     
        <div className="flex items-center justify-center w-1/6">
          <button className="w-12 h-12 bg-goldenrod text-white rounded-full flex-col flex items-center justify-center focus:outline-none hover:bg-goldenrod-dark">
            <div>
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
            <div>
              <FontAwesomeIcon icon={faArrowRight} />
            </div>
          </button>
        </div>

    
        <div className="flex flex-col w-1/3">
          <label className="text-sm font-medium mb-1">To Port</label>
          <select
            
            value={toPort}
            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setToPort(e.target.value)}
       
            className="text-sm text-black bg-white"
          >.
          {portOptions.map((option, idx)=>{
            return <option key={idx} value={option.value}>{option.label}</option>
          }
          
          )}
          </select>
          <button
            onClick={handleSearch}
            className="mt-4 bg-goldenrod text-white py-2 px-4 rounded-md hover:bg-goldenrod-dark focus:outline-none"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
