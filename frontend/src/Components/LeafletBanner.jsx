import React from "react";
import { Link } from "react-router";

const LeafletBanner = ({
  pageTitle = "About Us",
  breadcrumb = ["Home", "About"],
}) => {
  return (
    <div
      className="w-full min-h-[20vh] lg:min-h-[40vh] bg-cover bg-center relative mb-24 object-cover"
      style={{ backgroundImage: `url('/bgOtherRoute.jpeg')` }}
    >
      <div className="absolute top-12 md:top-20 px-6 md:px-20 font-lexend">
        <h1 className="text-2xl md:text-4xl font-bold text-green-900 mb-4 font-vibe">
          {pageTitle}
        </h1>
        <nav className="hidden lg:inline text-lg">
          <Link to="/home" className="hover:text-green-900 text-gray-400 cursor-pointer">   
            {breadcrumb[0]}
          </Link>
          <span className="mx-2">{">>"}</span>
          <span>{breadcrumb[1]}</span>
        </nav>
      </div>
    </div>
  );
};

export default LeafletBanner;
