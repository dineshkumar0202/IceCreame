import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:5000/api/dashboard/summary")
      .then(res => setData(res.data))
      .catch(err => console.error("Error fetching dashboard data:", err));
  }, []);

  if (!data) {
    return <p className="p-6">Loading dashboard...</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard</h1>
      <div className="grid grid-cols-3 gap-6">
        
        <div className="bg-blue-100 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">🏪 Total Branches</h2>
          <p className="text-2xl">{data.totalBranches}</p>
        </div>

        <div className="bg-green-100 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">💰 Total Sales</h2>
          <p className="text-2xl">{data.totalSales}</p>
        </div>

        <div className="bg-yellow-100 p-6 rounded-2xl shadow">
          <h2 className="text-lg font-semibold">🍦 Top Flavor</h2>
          <p className="text-2xl">{data.topFlavor}</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
