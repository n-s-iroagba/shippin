import { formatDate } from "@/utils/utils";
import React from "react";

const ScheduleCard = () => {
  const columns = [
    { title: "Port of Load (POL)", body: "BREMERHAVEN (DEBRV)" },
    { title: "Port of Discharge (POD)", body: "MUNDRA (INMUN)" },
    { title: "Fastest Transit Time", body: "36 DAYS" },
    { title: "Next Departure", body: formatDate(3) },
    { title: "Service", body: "SWAN-SENTOSA" },
    { title: "Routing Type", body: "DIRECT" },
  ];

  return (
    <div className="container mx-auto mt-6 bg-white">
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {columns.map((col, index) => (
          <div
            key={index}
            className={`relative bg-white shadow-md rounded-md p-4 text-center ${
              index === 1 ? "with-arrow" : ""
            }`}
          >
            <h3 className="font-bold text-sm text-gray-700">{col.title}</h3>
            <p className="text-lg text-gray-900 mt-2">{col.body}</p>
            {index === 1 && (
              <span className="absolute left-[-12px] top-1/2 transform -translate-y-1/2 text-goldenrod text-xl">
                ➜
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleCard;
