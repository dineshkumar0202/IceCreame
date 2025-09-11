import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Branches from "./pages/Branches";
import Sales from "./pages/Sales";
import TopFlavors from "./pages/TopFlavors";
import IngredientRequests from "./pages/IngredientRequests";
import AdminPanel from "./pages/AdminPanel";

function App() {
  return (
    <div className="flex">
      {/* Sidebar */}
      <nav className="w-64 min-h-screen bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6">🍦 Ice Cream</h2>
        <ul className="space-y-4">
          <li><Link to="/" className="hover:underline">Dashboard</Link></li>
          <li><Link to="/branches" className="hover:underline">Branches</Link></li>
          <li><Link to="/sales" className="hover:underline">Sales</Link></li>
          <li><Link to="/top-flavors" className="hover:underline">Top Flavors</Link></li>
        </ul>
      </nav>

      {/* Page Content */}
      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/branches" element={<Branches />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/top-flavors" element={<TopFlavors />} />
          <Route path="/ingredients" element={<IngredientRequests />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
