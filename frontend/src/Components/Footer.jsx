import React, { useContext } from "react";
import { Link, NavLink } from "react-router";
import { IoMdPaperPlane } from "react-icons/io";
import { FaPinterestP } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { CiLocationOn } from "react-icons/ci";
import { CiPhone } from "react-icons/ci";
import { CiMail } from "react-icons/ci";
import { IoTimeOutline } from "react-icons/io5";
import { AuthContext } from "../Provider/AuthProvider";
import logo from "/logo.png";
const Footer = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="font-roboto">
      <div
        className="text-white  flex items-center justify-center"
        style={{
          backgroundImage: "url('/footer2.png')",
          backgroundColor: "#0a472e",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="w-11/12 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 py-12 gap-8 text-white">
            <div>
              <div className="flex justify-start items-center mb-2">
                {/* Logo */}
                <img className="w-10 h-10" src={logo} alt="" />

                {/* Brand Name */}
                <Link to="/home" className="text-2xl font-semibold">
                  Nouriva
                </Link>
              </div>

              <div className="space-y-2">
                <p className="text-gray-300">
                  Raise awareness about food waste impact through smart
                  reminders and usage insights.
                </p>
                <div className="flex gap-8">
                  <a
                    href="https://www.pinterest.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaPinterestP size={20} className="text-[#E60023]" />
                  </a>
                  <a
                    href="https://x.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaTwitter size={20} className="text-[#1DA1F2]" />
                  </a>
                  <a
                    href="https://www.facebook.com/saidebinsabid"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook size={20} className="text-[#1877F2]" />
                  </a>
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram size={20} className="text-[#C13584]" />
                  </a>
                  <a
                    href="https://www.youtube.com/@ProgrammingHeroCommunity"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaYoutube size={20} className="text-[#FF0000]" />
                  </a>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-gray-300">
              <h1 className="text-white mb-4">CONTACT US</h1>
              <div className="flex items-center gap-2">
                <CiPhone size={20} />
                <p>(480) 555-010308</p>
              </div>
              <div className="flex items-center gap-2">
                <CiMail size={20} />
                <p>nouriva@gmail.com</p>
              </div>
              <div className="flex items-center gap-2">
                <IoTimeOutline size={20} />
                <p>24/7 Support</p>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="mb-4">CATEGORIES</h1>
              <ul className="menu-vertical px-1 gap-2">
                <li>
                  <NavLink
                    to="/home"
                    className={({ isActive }) =>
                      isActive
                        ? "font-semibold text-[#a8b324] border-b-2"
                        : "text-gray-300"
                    }
                  >
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/home/fridge"
                    className={({ isActive }) =>
                      isActive
                        ? "font-semibold text-[#a8b324] border-b-2"
                        : "text-gray-300"
                    }
                  >
                    Fridge
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/home/about"
                    className={({ isActive }) =>
                      isActive
                        ? "font-semibold text-[#a8b324] border-b-2"
                        : "text-gray-300"
                    }
                  >
                    About
                  </NavLink>
                </li>

                {user && (
                  <>
                    <li>
                      <NavLink
                        to="/home/addFood"
                        className={({ isActive }) =>
                          isActive
                            ? "font-semibold text-[#a8b324] border-b-2"
                            : "text-gray-300"
                        }
                      >
                        Add Food
                      </NavLink>{" "}
                    </li>

                    <li>
                      <NavLink
                        to="/home/myItems"
                        className={({ isActive }) =>
                          isActive
                            ? "font-semibold text-[#a8b324] border-b-2"
                            : "text-gray-300"
                        }
                      >
                        My Items
                      </NavLink>{" "}
                    </li>
                  </>
                )}
              </ul>
            </div>

           
          </div>
        </div>
      </div>
      <div className="bg-gradient-to-r from-[#0a472e] via-[#25694d] to-[#0a472e] w-full py-4">
        <div className="max-w-screen-xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-white">
          <h1 className="mb-2 md:mb-0">
            Copyright © 2025. All rights reserved
          </h1>
          <div className="flex gap-4">
            <p className="cursor-pointer hover:underline">Privacy Policy</p>
            <p className="cursor-pointer hover:underline">Term & Condition</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
