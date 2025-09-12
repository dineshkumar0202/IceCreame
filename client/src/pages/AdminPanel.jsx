import { useEffect, useState } from "react";

const AdminPage = () => {
  const [branches, setBranches] = useState([]);
  const [sales, setSales] = useState([]);
  const [requests, setRequests] = useState([]);
  const [editingBranch, setEditingBranch] = useState(null);
  const [editName, setEditName] = useState("");
  const [editCity, setEditCity] = useState("");

  const startEdit = (branch) => {
    setEditingBranch(branch._id);
    setEditName(branch.name);
    setEditCity(branch.city);
  };

  // Fetch all branches
  useEffect(() => {
    fetch("http://localhost:5000/api/branches")
      .then((res) => res.json())
      .then((data) => setBranches(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch all sales
  useEffect(() => {
    fetch("http://localhost:5000/api/sales")
      .then((res) => res.json())
      .then((data) => setSales(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch all ingredient requests
  useEffect(() => {
    fetch("http://localhost:5000/api/ingredients")
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/branches");
      const data = await res.json();
      setBranches(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBranch = async (id) => {
    if (!window.confirm("Are you sure you want to delete this branch?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/branches/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      alert(data.message);
      fetchBranches(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateBranch = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/branches/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editName, city: editCity }),
      });
      const data = await res.json();
      alert(data.message);
      setEditingBranch(null);
      fetchBranches();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">⚙️ Admin Panel</h1>

      {/* Branch Management */}
      <section>
        <h2 className="text-xl font-semibold mb-2">🏪 Branches</h2>
        <ul className="space-y-2">
          {branches.map((branch) => (
            <li key={branch._id} className="border p-2 rounded">
              {branch.name} - {branch.city}
            </li>
          ))}
        </ul>
      </section>

      {/* Sales Management */}
      <section>
        <h2 className="text-xl font-semibold mb-2">📊 Sales</h2>
        <ul className="space-y-2">
          {sales.map((sale) => (
            <li key={sale._id} className="border p-2 rounded">
              {sale.flavor} ({sale.unitsSold}) - Branch:{" "}
              {sale.branch?.name || sale.branch}
            </li>
          ))}
        </ul>
      </section>

      {/* Ingredient Requests */}
      <section>
        <h2 className="text-xl font-semibold mb-2">🍦 Ingredient Requests</h2>
        <ul className="space-y-2">
          {requests.map((req) => (
            <li key={req._id} className="border p-2 rounded">
              <p>
                <b>Branch:</b> {req.branch?.name || req.branch}
              </p>
              <p>
                <b>Flavor:</b> {req.flavor}
              </p>
              <p>
                <b>Ingredient:</b> {req.ingredient}
              </p>
              <p>
                <b>Qty:</b> {req.qty}
              </p>
              {/* Later we’ll add Approve/Reject buttons here */}
            </li>
          ))}
        </ul>
      </section>

      {/* Create Branch */}
      {/* Branch List */}
      <section>
        <h2 className="text-xl font-semibold mb-2">📋 Branch List</h2>
        <ul className="space-y-2">
          {branches.map((branch) => (
            <li
              key={branch._id}
              className="flex justify-between items-center border p-2 rounded"
            >
              {editingBranch === branch._id ? (
                <div className="flex gap-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="border p-1 rounded"
                  />
                  <input
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="border p-1 rounded"
                  />
                  <button
                    onClick={() => handleUpdateBranch(branch._id)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingBranch(null)}
                    className="bg-gray-400 text-white px-2 py-1 rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span>
                    {branch.name} ({branch.city})
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(branch)}
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteBranch(branch._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPage;
