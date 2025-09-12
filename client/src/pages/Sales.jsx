import { useEffect, useState } from "react";

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [branches, setBranches] = useState([]);
  const [branch, setBranch] = useState("");
  const [flavor, setFlavor] = useState("");
  const [unitsSold, setUnitsSold] = useState("");

  // Fetch sales
  const fetchSales = async () => {
    const res = await fetch("http://localhost:5000/api/sales");
    const data = await res.json();
    setSales(data);
  };

  // Fetch branches for dropdown
  const fetchBranches = async () => {
    const res = await fetch("http://localhost:5000/api/branches");
    const data = await res.json();
    setBranches(data);
  };

  useEffect(() => {
    fetchSales();
    fetchBranches();
  }, []);

  // Add sale
  const handleAddSale = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ branch, flavor, unitsSold }),
    });
    const data = await res.json();
    alert(data.message);
    fetchSales();
    setBranch("");
    setFlavor("");
    setUnitsSold("");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">📊 Manage Sales</h2>

      <form onSubmit={handleAddSale} className="mb-6 space-y-2">
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          className="border p-2 w-full rounded"
          required
        >
          <option value="">Select Branch</option>
          {branches.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name} ({b.city})
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Flavor"
          value={flavor}
          onChange={(e) => setFlavor(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />

        <input
          type="number"
          placeholder="Units Sold"
          value={unitsSold}
          onChange={(e) => setUnitsSold(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          ➕ Add Sale
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2">All Sales</h3>
      <ul className="space-y-1">
        {sales.map((s) => (
          <li key={s._id} className="border p-2 rounded">
            {s.branch?.name} ({s.branch?.city}) → {s.flavor} ({s.unitsSold} units)
          </li>
        ))}
      </ul>
    </div>
  );
}
