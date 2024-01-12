import {
  faInstagramSquare,
  faFacebookSquare,
  faTwitterSquare,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function Footer() {
  return (
    <div className="mt-3 mb-18 sm:mb-0">
    <footer className="bottom-0 w-full left-0 py-3 px-6 border-t border-gray-300 bg-gray-200 text-sm text-gray-500">
      <div className="flex-1">&copy; 2022 Rainsoft. Allright Reserved</div>
    </footer>
    </div>
  );
}

export default Footer;
