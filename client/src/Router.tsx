import About from "./pages/About.tsx";
import Home from "./pages/Home.tsx";
import Login from "./features/auth/pages/Login.tsx";

import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import Profile from "./features/auth/pages/Profile.tsx";
import Athletes from "./features/athletes/pages/Athletes.tsx";
import Register from "./features/auth/pages/Register.tsx";
import AthleteStats from "./features/stats/pages/AthleteStats.tsx";
import GameLog from "./features/athletes/pages/MultipleAthleteStats.tsx";
import NotFound from "./pages/NotFound.tsx";
import Test from "./pages/Test.tsx";

function Router() {
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
          <Route path="/teamstats" element={<GameLog />} />
          <Route path="/test" element={<Test />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

export default Router;
