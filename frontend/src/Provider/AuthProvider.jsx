import React, {
  createContext,
  useEffect,
  useState,
} from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check existing login when application starts
  useEffect(() => {
    const token =
      localStorage.getItem("nouriva_token");

    if (!token) {
      setLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const response = await api.get(
          "/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setUser(response.data.user);
      } catch (error) {
        console.error(
          "Session restoration failed:",
          error
        );

        localStorage.removeItem(
          "nouriva_token"
        );

        localStorage.removeItem(
          "nouriva_user"
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // REGISTER
  const createUser = async (
    name,
    email,
    password,
    photoURL = ""
  ) => {
    const response = await api.post(
      "/auth/register",
      {
        name,
        email,
        password,
        photoURL,
      }
    );

    return response.data;
  };

  // LOGIN
  const signInUser = async (
    email,
    password
  ) => {
    const response = await api.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    const {
      token,
      user: loggedInUser,
    } = response.data;

    // Store token
    localStorage.setItem(
      "nouriva_token",
      token
    );

    // Store user
    localStorage.setItem(
      "nouriva_user",
      JSON.stringify(loggedInUser)
    );

    // Update React state immediately
    setUser(loggedInUser);

    return response.data;
  };

  // LOGOUT
  const logoutUser = () => {
    localStorage.removeItem(
      "nouriva_token"
    );

    localStorage.removeItem(
      "nouriva_user"
    );

    setUser(null);
  };

  // UPDATE PROFILE
  const updateUser = async (
    updatedData
  ) => {
    const token =
      localStorage.getItem(
        "nouriva_token"
      );

    const response = await api.put(
      "/auth/profile",
      updatedData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const updatedUser =
      response.data.user;

    setUser(updatedUser);

    localStorage.setItem(
      "nouriva_user",
      JSON.stringify(updatedUser)
    );

    return response.data;
  };

  // CHANGE PASSWORD
  const changePassword = async (
    currentPassword,
    newPassword
  ) => {
    const token =
      localStorage.getItem(
        "nouriva_token"
      );

    return api.put(
      "/auth/change-password",
      {
        currentPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  };

  // RESET PASSWORD
  // MongoDB version doesn't currently
  // have a reset-password endpoint.
  const resetPassword = async () => {
    throw new Error(
      "Password reset is not available yet."
    );
  };

  const authData = {
    user,
    setUser,

    loading,
    setLoading,

    createUser,
    signInUser,
    logoutUser,

    updateUser,
    changePassword,

    resetPassword,
  };

  return (
    <AuthContext.Provider
      value={authData}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;