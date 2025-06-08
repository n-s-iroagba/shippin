import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    // faPhone,
     faEnvelope, faMapMarkerAlt, 
     faPhone} from "@fortawesome/free-solid-svg-icons";

import { companyAddress, companyEmail, telephoneNumber } from "@/data/constants";
const ContactInfo = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg max-w-lg mx-auto text-center md:text-left">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Contact Us</h2>
      
      <div className="flex flex-col gap-4 text-gray-700">
        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faMapMarkerAlt} className="text-black w-5 h-5" />
          <span>{companyAddress}</span>
        </div>

        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faPhone} className="text-green-600 w-5 h-5" />
          <span>{telephoneNumber}</span>
        </div>

        <div className="flex items-center gap-3">
          <FontAwesomeIcon icon={faEnvelope} className="text-black w-5 h-5" />
          <a href={`mailto:${companyEmail}`}className="text-black hover:underline">
         {companyEmail}
</a>

        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
