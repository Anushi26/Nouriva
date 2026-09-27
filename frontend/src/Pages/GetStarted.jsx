import React from "react";
import { Link } from "react-router";

const GetStarted = () => {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#f4f8e8] via-white to-[#e7f2df] flex items-center">
      <div className="w-11/12 max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center py-16">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
            <img src="/logo.png" alt="Nouriva logo" className="w-16 h-16 object-contain" />
            <span className="text-4xl font-bold text-[#0a472e]">NOURIVA</span>
          </div>

          <p className="inline-block px-4 py-2 rounded-full bg-[#dfe9b0] text-[#0a472e] font-semibold text-sm mb-5">
            FOOD TODAY, BETTER TOMORROW
          </p>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight text-[#0a472e]">
            Save Food.
            <br />
            <span className="text-[#8c9d20]">Reduce Waste.</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
            Nouriva helps you keep track of food, discover items nearing expiry,
            and build smarter habits that keep good food from going to waste.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              to="/auth/register"
              className="px-8 py-4 rounded-full bg-[#0a472e] text-white font-semibold text-lg shadow-lg hover:bg-[#083b26] transition text-center"
            >
              Get Started
            </Link>
            <Link
              to="/auth/login"
              className="px-8 py-4 rounded-full border-2 border-[#0a472e] text-[#0a472e] font-semibold text-lg hover:bg-[#0a472e] hover:text-white transition text-center"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-6 bg-[#cbd88a]/40 rounded-[3rem] blur-2xl" />
          <div className="relative bg-white rounded-[2rem] shadow-2xl p-6 md:p-10">
            <img
              src="/banner1.jpeg"
              alt="Fresh food"
              className="w-full h-[420px] object-cover rounded-3xl"
            />
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-2xl bg-[#eef5dc] p-4">
                <div className="text-2xl font-bold text-[#0a472e]">Track</div>
                <div className="text-sm text-gray-600">Food expiry</div>
              </div>
              <div className="rounded-2xl bg-[#f5f7e9] p-4">
                <div className="text-2xl font-bold text-[#0a472e]">Save</div>
                <div className="text-sm text-gray-600">Good food</div>
              </div>
              <div className="rounded-2xl bg-[#eef5dc] p-4">
                <div className="text-2xl font-bold text-[#0a472e]">Reduce</div>
                <div className="text-sm text-gray-600">Food waste</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GetStarted;
