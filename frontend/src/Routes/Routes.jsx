import { createBrowserRouter, Navigate } from "react-router";

import HomeLayout from "../Layouts/HomeLayout";
import Home from "../Pages/Home";
import Fridge from "../Pages/Fridge";
import Register from "../Pages/Register";
import Login from "../Pages/Login";
import AuthLayout from "../Layouts/AuthLayout";
import PrivateRoute from "../Provider/PrivateRoutes";

import AddFood from "../Pages/AddFood";
import TrackFood from "../Pages/TrackFood";
import MyItems from "../Pages/MyItems";
import FoodDetails from "../Pages/FoodDetails";
import ErrorPage from "../Pages/ErrorPage";
import About from "../Pages/About";
import Faq from "../Pages/Faq";
import GetStarted from "../Pages/GetStarted";

import ShareFood from "../Pages/ShareFood";
import SurplusFood from "../Pages/SurplusFood";
import SharedFoodDetails from "../Pages/SharedFoodDetails";
import NearExpiry from "../Pages/NearExpiry";

import Requests from "../Pages/Requests";
import Impact from "../Pages/Impact";
import Recipes from "../Pages/Recipes";
import Profile from "../Pages/Profile";
import Admin from "../Pages/Admin";
import Chat from "../Pages/Chat";
// =====================================================
// PROTECT PRIVATE PAGES
// =====================================================

const protect = (element) => (
  <PrivateRoute>
    {element}
  </PrivateRoute>
);

// =====================================================
// ROUTER
// =====================================================

const router = createBrowserRouter([
  // ===================================================
  // GET STARTED
  // ===================================================

  {
    path: "/",
    element: <GetStarted />,
  },

  // ===================================================
  // AUTHENTICATION
  // ===================================================

  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },

  // ===================================================
  // MAIN APPLICATION
  // ===================================================

  {
    path: "/home",
    element: protect(<HomeLayout />),

    children: [
      // -----------------------------------------------
      // HOME
      // URL: /home
      // -----------------------------------------------

      {
        index: true,
        element: <Home />,
      },

      // -----------------------------------------------
      // FRIDGE
      // URL: /home/fridge
      // -----------------------------------------------

      {
        path: "fridge",
        element: <Fridge />,
      },


      {
  path: "near-expiry",
  element: <NearExpiry />,
},




      // -----------------------------------------------
      // TRACK FOOD
      // URL: /home/track-food
      // -----------------------------------------------

      {
        path: "track-food",
        element: <TrackFood />,
      },

      // -----------------------------------------------
      // ADD FOOD
      // URL: /home/addFood
      // -----------------------------------------------

      {
        path: "addFood",
        element: <AddFood />,
      },

      // -----------------------------------------------
      // MY ITEMS
      // URL: /home/myItems
      // -----------------------------------------------

      {
        path: "myItems",
        element: <MyItems />,
      },

      // -----------------------------------------------
      // FOOD DETAILS
      // URL: /home/foodDetails/:id
      // -----------------------------------------------

      {
        path: "foodDetails/:id",
        element: <FoodDetails />,
      },

      // -----------------------------------------------
      // ABOUT
      // URL: /home/about
      // -----------------------------------------------

      {
        path: "about",
        element: <About />,
      },

      // -----------------------------------------------
      // FAQ
      // URL: /home/faq
      // -----------------------------------------------

      {
        path: "faq",
        element: <Faq />,
      },

      // =================================================
      // SHARE FOOD
      // URL: /home/share-food
      // =================================================

      {
        path: "share-food",
        element: <ShareFood />,
      },

      // =================================================
      // SHARED FOOD
      // URL: /home/shared-food
      // =================================================

      {
        path: "shared-food",
        element: <SurplusFood />,
      },

      // =================================================
      // SHARED FOOD DETAILS
      // URL: /home/shared-food/:id
      // =================================================

      {
        path: "shared-food/:id",
        element: <SharedFoodDetails />,
      },

      // =================================================
      // SURPLUS
      // URL: /home/surplus
      // =================================================

      {
        path: "surplus",
        element: <SurplusFood />,
      },

      // -----------------------------------------------
      // REQUESTS
      // URL: /home/requests
      // -----------------------------------------------

      {
        path: "requests",
        element: <Requests />,
      },

      // -----------------------------------------------
      // CHAT
      // URL: /home/chat?requestId=123
      // -----------------------------------------------

      {
        path: "chat",
        element: <Chat />,
      },

      // -----------------------------------------------
      // IMPACT
      // URL: /home/impact
      // -----------------------------------------------

      {
        path: "impact",
        element: <Impact />,
      },

      // -----------------------------------------------
      // RECIPES
      // URL: /home/recipes
      // -----------------------------------------------

      {
        path: "recipes",
        element: <Recipes />,
      },

      // -----------------------------------------------
      // PROFILE
      // URL: /home/profile
      // -----------------------------------------------

      {
        path: "profile",
        element: <Profile />,
      },

      // -----------------------------------------------
      // ADMIN
      // URL: /home/admin
      // -----------------------------------------------

      {
        path: "admin",
        element: <Admin />,
      },
    ],
  },

  // ===================================================
  // COMPATIBILITY ROUTES
  // ===================================================

  // Old Share Food URL
  {
    path: "/share-food",
    element: (
      <Navigate
        to="/home/share-food"
        replace
      />
    ),
  },

  // Old Shared Food URL
  {
    path: "/shared-food",
    element: (
      <Navigate
        to="/home/shared-food"
        replace
      />
    ),
  },

  // Old Shared Food Details URL
  {
    path: "/shared-food/:id",
    element: (
      <Navigate
        to="/home/shared-food"
        replace
      />
    ),
  },

  // Old Track Food URL
  {
    path: "/track-food",
    element: (
      <Navigate
        to="/home/track-food"
        replace
      />
    ),
  },

  // Old Add Food URL
  {
    path: "/addFood",
    element: (
      <Navigate
        to="/home/addFood"
        replace
      />
    ),
  },

  // ===================================================
  // 404 PAGE
  // ===================================================

  {
    path: "*",
    element: <ErrorPage />,
  },
]);

export default router;