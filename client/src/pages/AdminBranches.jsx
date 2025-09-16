import React, { useEffect, useState } from "react";
import { getBranches, addBranch, deleteBranch } from "../services/branchService";

export default function AdminBranches() {
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({ name: "", city: "", area: "", manager: "" });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    const data = await getBranches();
    setBranches(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addBranch(form);
    setForm({ name: "", city: "", area: "", manager: "" });
    fetchBranches();
  };

  const handleDelete = async (id) => {
    await deleteBranch(id);
    fetchBranches();
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Manage Branches 🏪</h2>

      {/* Add Branch Form */}
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          type="text"
          placeholder="Branch Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="text"
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="text"
          placeholder="Area"
          value={form.area}
          onChange={(e) => setForm({ ...form, area: e.target.value })}
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          placeholder="Manager Name"
          value={form.manager}
          onChange={(e) => setForm({ ...form, manager: e.target.value })}
          className="w-full border rounded p-2"
        />
        <button className="bg-rose-600 text-white px-4 py-2 rounded">Add Branch</button>
      </form>

      {/* Branch List */}
      <div className="space-y-2">
        {branches.map((b) => (
          <div key={b._id} className="flex justify-between items-center bg-gray-50 p-3 rounded">
            <div>
              <p className="font-semibold">{b.name}</p>
              <p className="text-sm text-gray-600">{b.city} - {b.area}</p>
              <p className="text-xs text-gray-500">{b.manager || "No Manager"}</p>
            </div>
            <button
              onClick={() => handleDelete(b._id)}
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
