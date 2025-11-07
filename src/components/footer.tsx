import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900/95 to-black/95 backdrop-blur-sm border-t border-[#bfa14a]/30 font-['Tahoma']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
                <img 
                  src="/logo.png" 
                  alt="Super Wheels Logo" 
                  className="w-8 h-8 object-contain"
                  onError={(e) => {
                    // Fallback to text if logo fails to load
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextSibling && ((target.nextSibling as HTMLElement).style.display = 'block');
                  }}
                />
                <span className="text-white font-bold text-sm hidden">CM</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-['Tahoma']">Super Wheels Car Maintenance</h3>
                <p className="text-sm text-gray-300 font-['Tahoma']">Management System</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm mb-4 max-w-md font-['Tahoma']">
              Streamline your vehicle maintenance operations with our comprehensive management system. 
              Track records, manage parts, and optimize your maintenance workflow.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/superwheelsae/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[#bfa14a] transition-colors duration-200 transform hover:scale-110"
              >
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a 
                href="https://x.com/superwheelsae" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[#bfa14a] transition-colors duration-200 transform hover:scale-110"
              >
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a 
                href="https://www.instagram.com/superwheelsae/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-[#bfa14a] transition-colors duration-200 transform hover:scale-110"
              >
                <span className="sr-only">Instagram</span>
<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
</svg>
              </a>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 font-['Tahoma']">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="/help-center" className="text-gray-300 hover:text-[#bfa14a] transition-colors duration-200 text-sm flex items-center group font-['Tahoma']">
                  <span className="w-1 h-1 bg-[#bfa14a] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Help Center
                </a>
              </li>
              <li>
                <a href="/documentation" className="text-gray-300 hover:text-[#bfa14a] transition-colors duration-200 text-sm flex items-center group font-['Tahoma']">
                  <span className="w-1 h-1 bg-[#bfa14a] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Documentation
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-[#bfa14a] transition-colors duration-200 text-sm flex items-center group font-['Tahoma']">
                  <span className="w-1 h-1 bg-[#bfa14a] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/status" className="text-gray-300 hover:text-[#bfa14a] transition-colors duration-200 text-sm flex items-center group font-['Tahoma']">
                  <span className="w-1 h-1 bg-[#bfa14a] rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Status
                </a>
              </li>
            </ul>
          </div>

          {/* Location Map */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4 font-['Tahoma']">
              Our Location
            </h3>
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3437.918676888924!2d55.205351875155785!3d24.970236977857795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f73005fbfbea7%3A0xfaddf774f57488cc!2sSuper%20Wheels%20Luxury%20Transport!5e1!3m2!1sen!2sae!4v1762490070583!5m2!1sen!2sae"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Super Wheels Luxury Transport Location"
                className="rounded-lg"
              ></iframe>
            </div>
            <div className="mt-3 text-sm text-gray-300 font-['Tahoma']">
              <p className="font-medium text-white">Super Wheels Luxury Transport</p>
              <p className="mt-1">Dubai, United Arab Emirates</p>
              <p className="mt-2">📞 +971 XX XXX XXXX</p>
              <p>📧 info@superwheels.ae</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm font-['Tahoma']">
            © {currentYear} Car Maintenance System. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-gray-400 font-['Tahoma']">
            <span className="hover:text-[#bfa14a] transition-colors duration-200">Created by:</span>
            <span className="hover:text-[#bfa14a] transition-colors duration-200">Tj Brandon Monteclar</span>
            <span className="hover:text-[#bfa14a] transition-colors duration-200">Yousuf Khan</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;