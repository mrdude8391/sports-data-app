import About from "./pages/About.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";

import { Routes, Route } from "react-router-dom";
import MainLayout from "./pages/layouts/MainLayout.tsx";
import Profile from "./pages/Profile.tsx";
import Athletes from "./pages/Athletes.tsx";
import Register from "./pages/Register.tsx";
import AthleteStats from "./pages/AthleteStats.tsx";

function App() {
  return (
    <>
      <Routes>
        {/* Layout */}
        <Route element={<MainLayout />}>
          {/* Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/athletes" element={<Athletes />} />
          <Route path="/register" element={<Register />} />
          <Route path="/athletes/:athleteId/stats" element={<AthleteStats />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
