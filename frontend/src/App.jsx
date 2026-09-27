import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Fridge from "./Pages/Fridge";
import ShareFood from "./Pages/ShareFood";
import SharedFood from "./Pages/SharedFood";
import SharedFoodDetails from "./Pages/SharedFoodDetails";
import TrackFood from "./Pages/TrackFood";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />

        <Route path="/login" element={<Login />} />

        <Route path="/home" element={<Home />} />

        <Route path="/fridge" element={<Fridge />} />

        <Route path="/track-food" element={<TrackFood />} />

        <Route path="/share-food" element={<ShareFood />} />

        <Route path="/shared-food" element={<SharedFood />} />

        <Route
          path="/shared-food/:id"
          element={<SharedFoodDetails />}
        />

        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;