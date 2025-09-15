import React, { useEffect, useState } from 'react';
import { requestIngredient, getRequests, updateRequestStatus, deleteRequest } from '../services/ingredientService';
import { useAuth } from '../context/AuthContext';
// import HomeImage from '../images/home.png';

export default function Ingredients() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    branch: user?.branch || '',
    city: '',
    flavor: '',
    ingredient: '',
    qty: 0
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.branch || !form.city || !form.flavor || !form.ingredient || !form.qty) return;

    try {
      setLoading(true);
      await requestIngredient(form);
      setForm({
        branch: user?.branch || '',
        city: '',
        flavor: '',
        ingredient: '',
        qty: 0
      });
      setShowForm(false);
      await fetchRequests();
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Error creating request');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      setLoading(true);
      await updateRequestStatus(id, status);
      await fetchRequests();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this request?')) return;

    try {
      setLoading(true);
      await deleteRequest(id);
      await fetchRequests();
    } catch (error) {
      console.error('Error deleting request:', error);
      alert('Error deleting request');
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = user?.role === 'branch' 
    ? requests.filter(req => req.branch === user.branch)
    : requests;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-full bg-gradient-to-br from-rose-50 to-pink-100 relative overflow-y-auto">
      {/* Background Decorations */}
      <div className="absolute top-10 left-10 text-6xl opacity-10 animate-float">🥛</div>
      <div className="absolute top-32 right-20 text-4xl opacity-15 animate-wave">🍦</div>
      <div className="absolute bottom-40 left-20 text-5xl opacity-12 animate-float">🧁</div>
      <div className="absolute bottom-20 right-10 text-3xl opacity-10 animate-wave">🍨</div>
      
      <div className="container mx-auto px-6 py-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 flex items-center">
            Ingredient Management <span className="text-4xl animate-bounce ml-2">🍦</span>
          </h1>
          <p className="text-gray-600 mt-2">
            {user?.role === 'admin' 
              ? 'Manage ingredient requests from all branches' 
              : `Request ingredients for ${user?.username || 'your account'}`
            }
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          {showForm ? 'Cancel' : '+ New Request'}
        </button>
      </div>

       {/* Add Request Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">New Ingredient Request</h3>
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
                    readOnly={user?.role === 'branch'}
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
                  Ingredient
                </label>
                <select
                  value={form.ingredient}
                  onChange={(e) => setForm({ ...form, ingredient: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 text-black"
                  required
                >
                  <option value="">Select ingredient</option>
                  <option value="Milk">Milk</option>
                  <option value="Cream">Cream</option>
                  <option value="Sugar">Sugar</option>
                  <option value="Cocoa powder">Cocoa powder</option>
                  <option value="Vanilla extract">Vanilla extract</option>
                  <option value="Strawberry flavor">Strawberry flavor</option>
                  <option value="Mint extract">Mint extract</option>
                  <option value="Pecans">Pecans</option>
                  <option value="Cookies">Cookies</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  placeholder="Enter quantity"
                  value={form.qty}
                  onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
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
                {loading ? 'Creating...' : 'Create Request'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ingredient Analytics - Admin Only */}
      {user?.role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium">Pending Requests</p>
                <p className="text-3xl font-bold">{filteredRequests.filter(req => req.status === 'pending').length}</p>
              </div>
              <div className="text-4xl opacity-80">⏳</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Approved Requests</p>
                <p className="text-3xl font-bold">{filteredRequests.filter(req => req.status === 'approved').length}</p>
              </div>
              <div className="text-4xl opacity-80">✅</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm font-medium">Rejected Requests</p>
                <p className="text-3xl font-bold">{filteredRequests.filter(req => req.status === 'rejected').length}</p>
              </div>
              <div className="text-4xl opacity-80">❌</div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white transform hover:scale-105 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Total Quantity</p>
                <p className="text-3xl font-bold">{filteredRequests.reduce((sum, req) => sum + req.qty, 0)}</p>
              </div>
              <div className="text-4xl opacity-80">📊</div>
            </div>
          </div>
        </div>
      )}

      {/* Requests List */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            {user?.role === 'admin' ? 'All Ingredient Requests' : 'Your Requests'}
          </h3>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🥛</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Requests Found</h3>
            <p className="text-gray-600">Create your first ingredient request!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request, index) => (
              <div
                key={request._id}
                className="px-6 py-4 hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {request.ingredient.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {request.ingredient} - {request.qty} units
                      </h4>
                      <p className="text-gray-600">
                        {request.branch} - {request.city} • {request.flavor} • {new Date(request.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}>
                      {request.status}
                    </span>
                    {user?.role === 'admin' && request.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'approved')}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(request._id, 'rejected')}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDelete(request._id)}
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
