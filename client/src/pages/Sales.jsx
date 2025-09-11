import { useState } from "react";
import axios from "axios";

function Sales() {
  const [form, setForm] = useState({
    branch: "",
    flavor: "",
    unitsSold: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/sales", form);
      setMessage(res.data.message || "Sale added successfully!");
      setForm({ branch: "", flavor: "", unitsSold: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error adding sale");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">➕ Add Sale</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="branch"
          placeholder="Branch ID"
          value={form.branch}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          name="flavor"
          placeholder="Flavor"
          value={form.flavor}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="unitsSold"
          placeholder="Units Sold"
          value={form.unitsSold}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Sale
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}

export default Sales;
