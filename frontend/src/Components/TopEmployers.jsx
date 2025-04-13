// Import logos
import mastercard from '../images/mastercard-logo.jpg';
import spotify from '../images/spotify-logo.png';
import verizon from '../images/verizon.png';
import microsoft from '../images/microsoft.jpeg';
import amazon from '../images/amazon-logo.jpg';
import cisco from '../images/cisco.png';
import swarovsk from '../images/swarovsk.png';
import google from '../images/google.png';
import ibm from '../images/ibm.png';
import iphone from '../images/iphone.png';
import peugeot from '../images/peugeot.png';

import Logo from "./Logo.jsx";

export default function TopEmployers() {
  const employers = [
    { id: 1, source: amazon, title: "Amazon" },
    { id: 2, source: mastercard, title: "Mastercard" },
    { id: 3, source: spotify, title: "Spotify" },
    { id: 4, source: microsoft, title: "Microsoft" },
    { id: 5, source: verizon, title: "Verizon" },
    { id: 6, source: cisco, title: "Cisco" },
    { id: 7, source: swarovsk, title: "Swarovski" },
    { id: 8, source: ibm, title: "IBM" },
    { id: 9, source: iphone, title: "Apple" },
    { id: 10, source: peugeot, title: "Peugeot" },
    { id: 11, source: google, title: "Google" },
  ];

  // Duplicate the employers array to create a seamless loop
  const duplicatedEmployers = [...employers, ...employers];

  return (
    <section className="w-full text-center py-8 sm:py-10 bg-white">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-teal-600 mb-3 sm:mb-4 tracking-tight">
          Top Employers
        </h2>
        <p className="text-gray-600 text-sm sm:text-base lg:text-lg font-medium mb-6 sm:mb-8 max-w-xl mx-auto">
          Discover leading companies hiring now
        </p>

        {/* Scrolling Logos Container */}
        <div className="w-full mt-6 sm:mt-8 overflow-hidden relative">
          <div className="animate-scroll flex gap-4 sm:gap-6 items-center">
            {duplicatedEmployers.map((employer, index) => (
              <div
                key={index}
                className="flex-shrink-0 border border-teal-200 rounded-lg bg-white p-2 sm:p-3 hover:shadow-md transition-all duration-200 hover:scale-[1.05]"
              >
                <Logo
                  source={employer.source}
                  title={employer.title}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                />
              </div>
            ))}
          </div>
          {/* Gradient Overlays for Scroll Hint */}
          <div className="absolute inset-y-0 left-0 w-12 sm:w-16 bg-gradient-to-r from-white/80 to-transparent pointer-events-none hidden sm:block" />
          <div className="absolute inset-y-0 right-0 w-12 sm:w-16 bg-gradient-to-l from-white/80 to-transparent pointer-events-none hidden sm:block" />
        </div>
      </div>
    </section>
  );
}