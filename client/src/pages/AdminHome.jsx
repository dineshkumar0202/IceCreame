import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getTotals, getTopFlavors } from "../services/dashboardService";
import { getBranches } from "../services/branchService";
import { getSales } from "../services/salesService";
import { getRequests } from "../services/ingredientService";
import Chart from "../components/Chart";

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [totals, setTotals] = useState({
    totalOutlets: 0,
    totalSales: { totalUnits: 0, totalAmount: 0 },
  });
  const [top, setTop] = useState([]);
  const [branches, setBranches] = useState([]);
  const [recentSales, setRecentSales] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [totalsData, topFlavors, branchesData, salesData, requestsData] =
        await Promise.all([
          getTotals(),
          getTopFlavors(),
          getBranches(),
          getSales(),
          getRequests(),
        ]);

      setTotals(totalsData || {});
      setTop(
        (topFlavors || []).slice(0, 10).map((x) => ({
          name: x._id.city + " - " + x._id.flavor,
          value: x.units,
        }))
      );
      setBranches(branchesData || []);
      setRecentSales((salesData || []).slice(0, 5));
      setRecentRequests((requestsData || []).slice(0, 5));
    } catch (error) {
      console.error("Error fetching admin data:", error);
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

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="text-6xl">🍦</div>
        </div>
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Manage your ice cream franchise operations
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-6 rounded-xl shadow-lg text-white">
          <p className="text-rose-100 text-sm font-medium">Total Outlets</p>
          <p className="text-3xl font-bold">{totals.totalOutlets}</p>
        </div>

        <div className="bg-gradient-to-r from-pink-500 to-pink-600 p-6 rounded-xl shadow-lg text-white">
          <p className="text-pink-100 text-sm font-medium">Total Units Sold</p>
          <p className="text-3xl font-bold">{totals.totalSales?.totalUnits}</p>
        </div>

        <div className="bg-gradient-to-r from-rose-600 to-rose-700 p-6 rounded-xl shadow-lg text-white">
          <p className="text-rose-100 text-sm font-medium">Total Revenue</p>
          <p className="text-3xl font-bold">
            ₹{(totals.totalSales?.totalAmount || 0).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Top Flavors Across Cities 🍦
        </h3>
        <div className="h-96">
          <Chart data={top} />
        </div>
      </div>

      {/* Branches Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          All Branches 🏪
        </h3>
        <div className="space-y-3">
          {branches.map((b) => (
            <div
              key={b._id}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {b.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {b.city} - {b.area}
                </p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {b.manager || "No Manager"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sales */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Sales 💰
            </h3>
            <button
              onClick={() => navigate("/sales")}
              className="text-sm text-rose-600 hover:text-rose-700 font-medium"
            >
              View All →
            </button>
          </div>
          {recentSales.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No sales yet.</p>
          ) : (
            recentSales.map((sale) => (
              <div
                key={sale._id}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2"
              >
                <div>
                  <p className="font-medium">{sale.flavor}</p>
                  <p className="text-xs text-gray-500">{sale.branch}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600 dark:text-green-400">
                    ₹{sale.amount}
                  </p>
                  <p className="text-xs">{sale.units} units</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Recent Requests */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Recent Requests 🥛
            </h3>
            <button
              onClick={() => navigate("/ingredients")}
              className="text-sm text-rose-600 hover:text-rose-700 font-medium"
            >
              View All →
            </button>
          </div>
          {recentRequests.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">No requests yet.</p>
          ) : (
            recentRequests.map((request) => (
              <div
                key={request._id}
                className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-2"
              >
                <div>
                  <p className="font-medium">{request.ingredient}</p>
                  <p className="text-xs text-gray-500">{request.branch}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : request.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {request.status}
                  </span>
                  <p className="text-xs mt-1">{request.qty} units</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
