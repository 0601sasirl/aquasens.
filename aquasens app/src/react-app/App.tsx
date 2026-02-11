import { BrowserRouter as Router, Routes, Route } from "react-router";
import Dashboard from "@/react-app/pages/Dashboard";
import CommunityMap from "@/react-app/pages/CommunityMap";
import WaterGuide from "@/react-app/pages/WaterGuide";
import Settings from "@/react-app/pages/Settings";
import BottomNav from "@/react-app/components/BottomNav";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/map" element={<CommunityMap />} />
        <Route path="/guide" element={<WaterGuide />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <BottomNav />
    </Router>
  );
}
