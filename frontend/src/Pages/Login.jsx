import React, {
  useContext,
  useState,
} from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router";

import { AuthContext } from "../Provider/AuthProvider";

import { toast } from "react-toastify";

import { FaSignInAlt } from "react-icons/fa";

const Login = () => {
  const {
    signInUser,
  } = useContext(AuthContext);

  const navigate = useNavigate();

  const location = useLocation();

  const [errorMessage, setErrorMessage] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    setErrorMessage("");
    setSubmitting(true);

    const email =
      e.target.email.value
        .trim()
        .toLowerCase();

    const password =
      e.target.password.value;

    try {
      // Login through Node + MongoDB
      await signInUser(
        email,
        password
      );

      toast.success(
        "Login successful!"
      );

      // Open Nouriva website/home
      const destination =
        location.state?.from?.pathname ||
        "/home";

      navigate(destination, {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      const message =
        error.response?.data
          ?.message ||
        "Invalid email or password.";

      setErrorMessage(message);

      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-11/12 max-w-md mx-auto my-16">

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">

        {/* HEADER */}

        <div className="text-center space-y-3 mb-7">

          <p className="text-sm font-semibold tracking-widest text-green-700">
            WELCOME TO
          </p>

          <h2 className="text-4xl font-bold text-[#0a472e]">
            Nouriva
          </h2>

          <p className="text-gray-600">
            Login to continue to your
            food-saving dashboard.
          </p>

        </div>

        {/* FORM */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* EMAIL */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              className="input w-full px-4 py-3 rounded-lg border border-gray-300"
              placeholder="you@example.com"
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="input w-full px-4 py-3 rounded-lg border border-gray-300"
              placeholder="Enter your password"
            />

          </div>

          {/* ERROR */}

          {errorMessage && (
            <p className="text-red-500 text-sm">
              {errorMessage}
            </p>
          )}

          {/* BUTTON */}

          <button
            disabled={submitting}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#a8b324] to-[#0a472e] text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
          >

            <FaSignInAlt />

            {submitting
              ? "Logging in..."
              : "Login"}

          </button>

          {/* SIGN UP */}

          <p className="text-center text-gray-600">

            Don't have an account?{" "}

            <Link
              className="font-semibold text-[#0a472e] hover:underline"
              to="/auth/register"
            >
              Sign up
            </Link>

          </p>

        </form>

      </div>

    </div>
  );
};

export default Login;