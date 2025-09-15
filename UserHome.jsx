import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getSales } from "../services/salesService";
import { getRequests } from "../services/ingredientService";
import { useNavigate } from "react-router-dom";
import { getBranches } from "../services/branchService";

export default function UserHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [requests, setRequests] = useState([]);
  const [branchDetails, setBranchDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [salesData, requestsData, branchesData] = await Promise.all([
        getSales().catch(() => []), // Fallback to empty array if API fails
        getRequests().catch(() => []), // Fallback to empty array if API fails
        getBranches().catch(() => []) // Fallback to empty array if API fails
      ]);
      
      // Filter data for current user's branch
      const userSales = salesData.filter(sale => sale.branch === user?.branch);
      const userRequests = requestsData.filter(req => req.branch === user?.branch); 
      const userBranch = branchesData.find(branch => branch.name === user?.branch);

      setSales(userSales);
      setRequests(userRequests);
      setBranchDetails(userBranch);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Set empty arrays as fallback
      setSales([]);
      setRequests([]);
      setBranchDetails(null);
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

  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalUnits = sales.reduce((sum, sale) => sum + sale.units, 0);
  const pendingRequests = requests.filter(req => req.status === 'pending').length;

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-rose-50 to-pink-100 relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float">🍦</div>
      <div className="absolute top-32 right-20 text-4xl opacity-15 animate-wave">🍨</div>
      <div className="absolute bottom-40 left-20 text-5xl opacity-12 animate-float">🧁</div>
      <div className="absolute bottom-20 right-10 text-3xl opacity-10 animate-wave">🍰</div>
      
      <div className="text-center max-w-4xl mx-auto px-8 relative z-10">
        <h1 className="text-6xl font-bold text-rose-800 mb-6 animate-fadeIn">
          🍦 Welcome to Our Ice Cream Shop! 🍦
        </h1>
        <p className="text-xl text-rose-700 mb-8 animate-fadeIn delay-200">
          Discover the best ice cream flavors and franchising opportunities with our company. 
          Experience premium quality and exceptional taste at every branch.
        </p>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8 animate-fadeIn delay-400">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-rose-800">₹{totalSales.toLocaleString()}</div>
            <div className="text-sm text-rose-600">Total Sales</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-rose-800">{totalUnits}</div>
            <div className="text-sm text-rose-600">Units Sold</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-rose-800">{pendingRequests}</div>
            <div className="text-sm text-rose-600">Pending Requests</div>
          </div>
        </div>

        {/* Branch Information */}
        {user?.branch && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8 animate-fadeIn delay-500">
            <h3 className="text-2xl font-bold text-rose-800 mb-4">Your Branch: {user.branch}</h3>
            {branchDetails && (
              <div className="bg-rose-50 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div><span className="font-semibold text-rose-700">City:</span> {branchDetails.city}</div>
                  <div><span className="font-semibold text-rose-700">Area:</span> {branchDetails.area}</div>
                  {branchDetails.address && <div><span className="font-semibold text-rose-700">Address:</span> {branchDetails.address}</div>}
                  {branchDetails.phone && <div><span className="font-semibold text-rose-700">Phone:</span> {branchDetails.phone}</div>}
                  {branchDetails.manager && <div><span className="font-semibold text-rose-700">Manager:</span> {branchDetails.manager}</div>}
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Recent Sales */}
              <div>
                <h4 className="text-lg font-semibold text-rose-700 mb-3">Recent Sales</h4>
                <div className="space-y-2">
                  {sales.slice(0, 3).map((sale, index) => (
                    <div key={sale._id} className="flex justify-between items-center bg-rose-50 p-3 rounded-lg">
                      <span className="text-rose-800">{sale.flavor}</span>
                      <span className="font-bold text-rose-600">₹{sale.amount}</span>
                    </div>
                  ))}
                  {sales.length === 0 && (
                    <p className="text-rose-500 text-sm">No sales recorded yet</p>
                  )}
                </div>
              </div>
              
              {/* Recent Requests */}
              <div>
                <h4 className="text-lg font-semibold text-rose-700 mb-3">Recent Requests</h4>
                <div className="space-y-2">
                  {requests.slice(0, 3).map((request, index) => (
                    <div key={request._id} className="flex justify-between items-center bg-rose-50 p-3 rounded-lg">
                      <span className="text-rose-800">{request.ingredient}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'approved' ? 'bg-green-100 text-green-800' :
                        request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>
                  ))}
                  {requests.length === 0 && (
                    <p className="text-rose-500 text-sm">No requests made yet</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Navigation Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 justify-center items-center">
          <button 
            onClick={() => navigate('/branches')}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg animate-bounceIn delay-600"
          >
            🏪 View Branches
          </button>
          <button 
            onClick={() => navigate('/sales')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg animate-bounceIn delay-700"
          >
            💰 View Sales
          </button>
          <button 
            onClick={() => navigate('/ingredients')}
            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg animate-bounceIn delay-800"
          >
            🥛 Request Ingredients
          </button>
        </div>
      </div>
    </div>
  );
}