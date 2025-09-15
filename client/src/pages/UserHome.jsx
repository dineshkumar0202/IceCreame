import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getSales } from "../services/salesService";
import { getRequests } from "../services/ingredientService";
import { useNavigate } from "react-router-dom";

export default function UserHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sales, setSales] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [salesData, requestsData] = await Promise.all([
        getSales().catch(() => []), // Fallback to empty array if API fails
        getRequests().catch(() => []) // Fallback to empty array if API fails
      ]);
      
      // Filter data for current user's branch
      const userSales = salesData.filter(sale => sale.branch === user?.branch);
      const userRequests = requestsData.filter(req => req.branch === user?.branch);
      
      setSales(userSales);
      setRequests(userRequests);
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Set empty arrays as fallback
      setSales([]);
      setRequests([]);
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
            <div className="text-3xl font-bold text-rose-800">{totalSales.toLocaleString()}</div>
            <div className="text-sm text-rose-600">Total Sales</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-rose-800">{totalUnits}</div>
            <div className="text-sm text-rose-600">Units Sold</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="text-3xl font-bold text-rose-800">{pendingRequests}</div>
            <div className="text-sm text-rose-600">Requests</div>
          </div>
        </div>
        
        {/* Recent Requests */}
        {requests.length > 0 && (
          <div className="bg-white rounded-xl p-6 shadow-lg mb-8 animate-fadeIn delay-500">
            <h3 className="text-2xl font-bold text-rose-800 mb-4 flex items-center">
              Recent Ingredient Requests <span className="text-2xl animate-bounce ml-2">🥛</span>
            </h3>
            <div className="space-y-3">
              {requests.slice(0, 3).map((request, index) => (
                <div
                  key={request._id}
                  className="flex items-center justify-between p-3 bg-rose-50 rounded-lg hover:bg-rose-100 transition-all duration-300"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {request.ingredient.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-rose-900 text-sm">{request.ingredient}</p>
                      <p className="text-xs text-rose-600">{request.flavor} • {request.qty} units</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === 'approved' ? 'bg-green-100 text-green-800' :
                    request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {request.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => navigate('/ingredients')}
            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg animate-bounceIn delay-600"
          >
            🥛 Request Ingredients
          </button>
          <button 
            onClick={() => navigate('/sales')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg animate-bounceIn delay-700"
          >
            💰 View Sales
          </button>
        </div>
      </div>
    </div>
  );
}