import React, { useEffect, useState } from "react";
import { getTotals, getTopFlavors } from "../services/dashboardService";
import { getSales } from "../services/salesService";
import { getRequests } from "../services/ingredientService";
import { getBranches } from "../services/branchService"; // ✅ added
import { useAuth } from "../context/AuthContext";
import Chart from "../components/Chart";

export default function Dashboard() {
  const { user } = useAuth();
  const [totals, setTotals] = useState({
    totalOutlets: 0,
    totalSales: { totalUnits: 0, totalAmount: 0 },
    branchInfo: null, // ✅ added
  });
  const [top, setTop] = useState([]);
  const [userSales, setUserSales] = useState([]);
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      if (user?.role === "admin") {
        // Admin dashboard - show all data
        const [totalsData, topFlavors] = await Promise.all([
          getTotals().catch(() => ({
            totalOutlets: 0,
            totalSales: { totalUnits: 0, totalAmount: 0 },
          })),
          getTopFlavors().catch(() => []),
        ]);

        setTotals(totalsData);
        setTop(
          topFlavors.slice(0, 10).map((x) => ({
            name: x._id.city + " - " + x._id.flavor,
            value: x.units,
          }))
        );
      } else {
        // User dashboard - show only user's data
        const [salesData, requestsData, branchesData] = await Promise.all([
          getSales().catch(() => []),
          getRequests().catch(() => []),
          getBranches().catch(() => []), // ✅ fetch branch info
        ]);

        const userSalesData = salesData.filter(
          (sale) => sale.branch === user?.branch
        );
        const userRequestsData = requestsData.filter(
          (req) => req.branch === user?.branch
        );
        const userBranch = branchesData.find((b) => b._id === user?.branch);

        setUserSales(userSalesData);
        setUserRequests(userRequestsData);

        // Calculate user totals
        const userTotalAmount = userSalesData.reduce(
          (sum, sale) => sum + sale.amount,
          0
        );
        const userTotalUnits = userSalesData.reduce(
          (sum, sale) => sum + sale.units,
          0
        );

        setTotals({
          totalOutlets: 1,
          totalSales: {
            totalUnits: userTotalUnits,
            totalAmount: userTotalAmount,
          },
          branchInfo: userBranch || null, // ✅ save branch info
        });
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (user?.role === "admin") {
    return (
      <div className="h-full overflow-y-auto p-6 space-y-8 animate-fadeIn">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="text-6xl animate-bounce delay-100">📊</div>
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2 animate-slideIn delay-200">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg animate-fadeIn delay-300">
            Complete overview of your ice cream franchise operations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 animate-bounceIn delay-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-100 text-sm font-medium">Total Outlets</p>
                <p className="text-3xl font-bold">{totals.totalOutlets}</p>
              </div>
              <div className="text-4xl opacity-80">🏪</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 animate-bounceIn delay-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-pink-100 text-sm font-medium">Total Units Sold</p>
                <p className="text-3xl font-bold">{totals.totalSales.totalUnits}</p>
              </div>
              <div className="text-4xl opacity-80">📦</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300 animate-bounceIn delay-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-100 text-sm font-medium">Total Revenue</p>
                <p className="text-3xl font-bold">
                  ₹{totals.totalSales.totalAmount.toLocaleString()}
                </p>
              </div>
              <div className="text-4xl opacity-80">💰</div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-fadeIn delay-700">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Top Flavors Across Cities
            </h3>
            <div className="text-2xl">🍦</div>
          </div>
          <div className="h-96">
            <Chart data={top} />
          </div>
        </div>
      </div>
    );
  }

  // User Dashboard
  const totalSales = userSales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalUnits = userSales.reduce((sum, sale) => sum + sale.units, 0);
  const pendingRequests = userRequests.filter(
    (req) => req.status === "pending"
  ).length;
  const approvedRequests = userRequests.filter(
    (req) => req.status === "approved"
  ).length;

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="text-6xl animate-bounce delay-100">🍦</div>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2 animate-slideIn delay-200">
          {totals.branchInfo?.name || "Your Branch"} Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg animate-fadeIn delay-300">
          {totals.branchInfo?.city
            ? `${totals.branchInfo.city} • ${new Date(
                totals.branchInfo.createdAt
              ).toLocaleDateString()}`
            : `Welcome back, ${user?.username}!`}
        </p>
      </div>

      {/* ✅ rest of your user stats cards and recent activity stays same */}
      {/* ... */}
    </div>
  );
}
