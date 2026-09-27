import { Link, useRouteError } from "react-router";
import errorImage from "../assets/error-page.jpg";
const ErrorPage = () => {
  const error = useRouteError();
  return (
    <>
      <div className="py-24 text-center w-11/12 mx-auto font-plus">
        <img src={errorImage} alt="" className="mx-auto shadow-xl" />
        <h1 className="mb-8 text-3xl md:text-4xl pt-6 font-bold text-red-400">
          {error?.status || "404 - Page Not Found"}
        </h1>
        <p className="mb-3 text-xl text-gray-900">
          {error?.error?.message ||
            "Oops! The page you'r looking for doesn't exist"}
        </p>
        <Link
          to="/"
          className="btn bg-[#176AE5] text-white tracking-wider font-light mt-4"
        >
          Go To Homepage
        </Link>
      </div>
    </>
  );
};

export default ErrorPage;
