import React, { useEffect, useState } from "react";
import LeafletBanner from "../Components/LeafletBanner";

const Item = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b">
      <button
        type="button"
        aria-label="Open item"
        title="Open item"
        className="flex items-center justify-between w-full p-4 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <p className="text-lg font-medium">{title}</p>
        <svg
          viewBox="0 0 24 24"
          className={`w-3 text-gray-600 transform transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeMiterlimit="10"
            points="2,7 12,17 22,7"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 pt-0">
          <p className="text-gray-700">{children}</p>
        </div>
      )}
    </div>
  );
};

const Faq = () => {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    fetch("/faq.json")
      .then((res) => res.json())
      .then((data) => setFaqs(data))
      .catch((err) => console.error("Failed to load FAQs:", err));
  }, []);
  return (
    <>
      <LeafletBanner
        pageTitle="Faq"
        breadcrumb={["Home", "Faq"]}
      ></LeafletBanner>

      <div className="w-11/12 mx-auto text-center font-lexend">
        <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400">
          Need Help?
        </p>

        <div className="max-w-xl md:mx-auto text-center lg:max-w-2xl mb-12">
          <h2 className="text-3xl font-bold text-center mb-6">
            Common Questions About Using Nouriva
          </h2>
          <p className="text-base text-gray-700 md:text-lg">
            Learn how to manage your food— all in one place.
          </p>
        </div>
      </div>

      <div>
        <div className="mx-auto mb-24 font-roboto">
          <div className=" w-11/12 px-4 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8">
            <div className="max-w-xl sm:mx-auto lg:max-w-2xl">
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <Item key={faq.id} title={faq.question}>
                    {faq.answer}
                  </Item>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;
