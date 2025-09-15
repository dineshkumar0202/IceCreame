import React, { useEffect, useState } from "react";
import { getSales, addSale, deleteSale } from "../services/salesService";
import { useAuth } from "../context/AuthContext";


export default function Sales() {
  const { user } = useAuth();
  const [sales, setSales] = useState([]);
  const [form, setForm] = useState({
    branch: user?.branch || "",
    city: "",
    flavor: "",
    units: 0,
    amount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const data = await getSales();
      setSales(data);
    } catch (error) {
      console.error('Error fetching sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.branch || !form.city || !form.flavor || !form.units || !form.amount) return;

    try {
      setLoading(true);
      await addSale(form);
      setForm({ 
        branch: user?.branch || "", 
        city: "", 
        flavor: "", 
        units: 0, 
        amount: 0 
      });
      setShowForm(false);
      await fetchSales();
    } catch (error) {
      console.error('Error adding sale:', error);
      alert('Error adding sale');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sale?')) return;

    try {
      setLoading(true);
      await deleteSale(id);
      await fetchSales();
    } catch (error) {
      console.error('Error deleting sale:', error);
      alert('Error deleting sale');
    } finally {
      setLoading(false);
    }
  };

  const filteredSales = user?.role === 'branch' 
    ? sales.filter(sale => sale.branch === user.branch)
    : sales;

  return (
    <div className="h-full bg-gradient-to-br from-rose-50 to-pink-100 relative overflow-y-auto">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float">💰</div>
      <div className="absolute top-32 right-20 text-4xl opacity-15 animate-wave">🍦</div>
      <div className="absolute bottom-40 left-20 text-5xl opacity-12 animate-float">📊</div>
      <div className="absolute bottom-20 right-10 text-3xl opacity-10 animate-wave">💸</div>
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center">
            Sales Management <span className="text-4xl animate-bounce ml-2">🍦</span>
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'admin' 
              ? 'View and manage all sales across branches' 
              : `Track sales for ${user?.username || 'your account'}`
            }
          </p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            {showForm ? 'Cancel' : '+ Add Sale'}
          </button>
        )}
      </div>

      {/* Add Sale Form - Admin Only */}
      {showForm && user?.role === 'admin' && (
         <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-fadeIn">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Sale</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch
                </label>
                <input
                  type="text"
                  placeholder="Enter branch name"
                  value={form.branch}
                  onChange={(e) => setForm({ ...form, branch: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
                  required
                  disabled={user?.role === 'branch'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Flavor
                </label>
                <select
                  value={form.flavor}
                  onChange={(e) => setForm({ ...form, flavor: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
                  required
                >
                  <option value="">Select flavor</option>
                  <option value="Vanilla">Vanilla</option>
                  <option value="Chocolate">Chocolate</option>
                  <option value="Strawberry">Strawberry</option>
                  <option value="Mint">Mint</option>
                  <option value="Butter Pecan">Butter Pecan</option>
                  <option value="Cookies & Cream">Cookies & Cream</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Units
                </label>
                <input
                  type="number"
                  placeholder="Enter units sold"
                  value={form.units}
                  onChange={(e) => setForm({ ...form, units: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
                  required
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
                  required
                  min="1"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Sale'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Sales Analytics - Admin Only */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Sales</p>
                <p className="text-3xl font-bold">₹{filteredSales.reduce((sum, sale) => sum + sale.amount, 0).toLocaleString()}</p>
              </div>
              <div className="text-4xl opacity-80">💰</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Units</p>
                <p className="text-3xl font-bold">{filteredSales.reduce((sum, sale) => sum + sale.units, 0)}</p>
              </div>
              <div className="text-4xl opacity-80">📦</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Active Branches</p>
                <p className="text-3xl font-bold">{new Set(filteredSales.map(sale => sale.branch)).size}</p>
              </div>
              <div className="text-4xl opacity-80">🏪</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-rose-100 text-sm font-medium">Avg Sale</p>
                <p className="text-3xl font-bold">₹{filteredSales.length > 0 ? Math.round(filteredSales.reduce((sum, sale) => sum + sale.amount, 0) / filteredSales.length) : 0}</p>
              </div>
              <div className="text-4xl opacity-80">📊</div>
            </div>
          </div>
        </div>
      )}

      {/* Sales List */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {user?.role === 'admin' ? 'All Sales' : 'Your Sales'}
          </h3>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : filteredSales.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Sales Found</h3>
            <p className="text-gray-600">Add your first sale to get started!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredSales.map((sale, index) => (
              <div
                key={sale._id}
                className="px-6 py-4 hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {sale.flavor.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {sale.flavor} - {sale.units} units
                      </h4>
                      <p className="text-gray-600">
                        {sale.branch} - {sale.city} • {new Date(sale.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">₹{sale.amount}</p>
                      <p className="text-sm text-gray-500">Total Revenue</p>
                    </div>
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDelete(sale._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
