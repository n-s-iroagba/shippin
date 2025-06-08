const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white py-6 mt-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            {/* Company Info */}
            <div>
              <h2 className="text-lg font-bold">Shipping Co.</h2>
              <p className="text-sm mt-2">
                Reliable global shipping services ensuring your goods arrive on time.
              </p>
            </div>
  
            {/* Quick Links */}
            <div>
              <h2 className="text-lg font-bold">Quick Links</h2>
              <ul className="mt-2 space-y-2">
                <li><a href="/track" className="hover:text-yellow-500">Track Shipment</a></li>
                <li><a href="/services" className="hover:text-yellow-500">Services</a></li>
                <li><a href="/about" className="hover:text-yellow-500">About Us</a></li>
                <li><a href="/contact" className="hover:text-yellow-500">Contact</a></li>
              </ul>
            </div>
  
            {/* Social Media */}
            <div>
              <h2 className="text-lg font-bold">Follow Us</h2>
              <div className="mt-2 flex justify-center md:justify-start space-x-4">
                <a href="#" className="hover:text-yellow-500">
                  <i className="fab fa-facebook text-xl"></i>
                </a>
                <a href="#" className="hover:text-yellow-500">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="hover:text-yellow-500">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
                <a href="#" className="hover:text-yellow-500">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
              </div>
            </div>
          </div>
  
          <hr className="border-gray-700 my-4" />
  
          {/* Copyright */}
          <div className="text-center text-sm">
            &copy; {new Date().getFullYear()} Shipping Co. All rights reserved.
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
