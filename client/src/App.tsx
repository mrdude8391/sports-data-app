import { useState } from "react";
import About from "./pages/About.tsx";
import Home from "./pages/Home.tsx";
import Login from "./pages/Login.tsx";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./pages/layouts/MainLayout.tsx";
import Profile from "./pages/Profile.tsx";

function App() {
  return (
    <>
      <div className="flex flex-col h-screen items-center justify-center">
        <p>Hello</p>

        <Routes>
          {/* Layout */}
          <Route element={<MainLayout />}>
            {/* Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
      </div>
    </>
  );
}

export default App;
