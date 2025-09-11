import { useEffect, useState } from "react";
import axios from "axios";

function AdminPanel() {
  const [branches, setBranches] = useState([]);
  const [sales, setSales] = useState([]);
  const [newBranch, setNewBranch] = useState({ name: "", city: "" });
  const [newSale, setNewSale] = useState({
    branch: "",
    flavor: "",
    unitsSold: "",
  });

  useEffect(() => {
    fetchBranches();
    fetchSales();
  }, []);

  const fetchBranches = async () => {
    const res = await axios.get("http://localhost:5000/api/branches");
    setBranches(res.data);
  };

  const fetchSales = async () => {
    const res = await axios.get("http://localhost:5000/api/sales");
    setSales(res.data);
  };

  const addBranch = async () => {
    if (!newBranch.name || !newBranch.city) {
      alert("Please fill all fields");
      return;
    }
    await axios.post("http://localhost:5000/api/branches", newBranch);
    setNewBranch({ name: "", city: "" });
    fetchBranches();
  };

  const deleteBranch = async (id) => {
    await axios.delete(`http://localhost:5000/api/branches/${id}`);
    fetchBranches();
  };

  const addSale = async () => {
    if (!newSale.branch || !newSale.flavor || !newSale.unitsSold) {
      alert("All fields required");
      return;
    }
    await axios.post("http://localhost:5000/api/sales", newSale);
    setNewSale({ branch: "", flavor: "", unitsSold: "" });
    fetchSales();
  };

  const deleteSale = async (id) => {
    await axios.delete(`http://localhost:5000/api/sales/${id}`);
    fetchSales();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">⚙️ Admin Panel</h1>

      {/* Branches Section */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">🏪 Branches</h2>

        {/* Add Branch Form */}
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Branch Name"
            value={newBranch.name}
            onChange={(e) =>
              setNewBranch({ ...newBranch, name: e.target.value })
            }
            className="border px-3 py-2 rounded w-1/3"
          />
          <input
            type="text"
            placeholder="City"
            value={newBranch.city}
            onChange={(e) =>
              setNewBranch({ ...newBranch, city: e.target.value })
            }
            className="border px-3 py-2 rounded w-1/3"
          />
          <button
            onClick={addBranch}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Branch
          </button>
        </div>

        {/* List Branches */}
        <ul className="space-y-2">
          {branches.map((b) => (
            <li
              key={b._id}
              className="p-3 border rounded flex justify-between items-center"
            >
              {b.city} – {b.name}
              <button
                onClick={() => deleteBranch(b._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Sales Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">📊 Sales</h2>

        {/* Add Sale Form */}
        <div className="mb-4 flex gap-2">
          <select
            value={newSale.branch}
            onChange={(e) => setNewSale({ ...newSale, branch: e.target.value })}
            className="border px-3 py-2 rounded w-1/3"
          >
            <option value="">Select Branch</option>
            {branches.map((b) => (
              <option key={b._id} value={b._id}>
                {b.city} – {b.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Flavor"
            value={newSale.flavor}
            onChange={(e) => setNewSale({ ...newSale, flavor: e.target.value })}
            className="border px-3 py-2 rounded w-1/3"
          />
          <input
            type="number"
            placeholder="Units Sold"
            value={newSale.unitsSold}
            onChange={(e) =>
              setNewSale({ ...newSale, unitsSold: e.target.value })
            }
            className="border px-3 py-2 rounded w-1/3"
          />
          <button
            onClick={addSale}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Sale
          </button>
        </div>

        {/* List Sales */}
        <ul className="space-y-2">
          {sales.map((s) => (
            <li
              key={s._id}
              className="p-3 border rounded flex justify-between items-center"
            >
              {s.flavor} – {s.unitsSold} units ({s.branch?.city})
              <button
                onClick={() => deleteSale(s._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default AdminPanel;
