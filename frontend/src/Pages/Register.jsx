import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../Provider/AuthProvider";
import { toast } from "react-toastify";
import { FaUserPlus } from "react-icons/fa";

const Register = () => {
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setErrors({});
    setSubmitting(true);

    const form = e.target;

    const name = form.name.value.trim();
    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const photoURL = form.photo.value.trim();

    const nextErrors = {};

    if (name.length < 2) {
      nextErrors.name =
        "Please enter your full name.";
    }

    if (
      password.length < 6 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password)
    ) {
      nextErrors.password =
        "Password needs 6+ characters, including uppercase and lowercase letters.";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitting(false);
      return;
    }

    try {
      // Save user in MongoDB
      await createUser(
        name,
        email,
        password,
        photoURL
      );

      // Show success message
      toast.success(
        "Account created successfully!"
      );

      // Immediately open Login page
      navigate("/auth/login", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      const message =
        error.response?.data?.message ||
        "Registration failed.";

      toast.error(message);

      setErrors({
        form: message,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-11/12 max-w-md mx-auto my-12">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-green-100">

        <div className="text-center space-y-3 mb-7">
          <p className="text-sm font-semibold tracking-widest text-green-700">
            JOIN
          </p>

          <h2 className="text-4xl font-bold text-[#0a472e]">
            Nouriva
          </h2>

          <p className="text-gray-600">
            Create your account and start reducing food waste.
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-5"
        >

          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>

            <input
              name="name"
              type="text"
              required
              autoComplete="name"
              className="input w-full px-4 py-3 rounded-lg border border-gray-300"
              placeholder="Your full name"
            />

            {errors.name && (
              <p className="text-red-500 text-xs mt-1">
                {errors.name}
              </p>
            )}
          </div>

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

          {/* PHOTO */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Photo URL{" "}
              <span className="text-gray-400">
                (optional)
              </span>
            </label>

            <input
              name="photo"
              type="url"
              autoComplete="url"
              className="input w-full px-4 py-3 rounded-lg border border-gray-300"
              placeholder="https://..."
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
              autoComplete="new-password"
              className="input w-full px-4 py-3 rounded-lg border border-gray-300"
              placeholder="Create a password"
            />

            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* SERVER ERROR */}
          {errors.form && (
            <p className="text-red-500 text-sm">
              {errors.form}
            </p>
          )}

          {/* SUBMIT */}
          <button
            disabled={submitting}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-[#a8b324] to-[#0a472e] text-white font-semibold rounded-lg shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <FaUserPlus />

            {submitting
              ? "Creating account..."
              : "Sign Up"}
          </button>

          {/* LOGIN */}
          <p className="text-center text-gray-600">
            Already have an account?{" "}

            <Link
              className="font-semibold text-[#0a472e] hover:underline"
              to="/auth/login"
            >
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;