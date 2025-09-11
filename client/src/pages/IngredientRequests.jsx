import { useState } from "react";
import axios from "axios";

function IngredientRequests() {
  const [form, setForm] = useState({
    branch: "",
    flavor: "",
    ingredient: "",
    qtyNeeded: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/ingredients", form);
      setMessage(res.data.message || "Ingredient request added!");
      setForm({ branch: "", flavor: "", ingredient: "", qtyNeeded: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error submitting request");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">📦 Request Ingredient</h1>
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
          type="text"
          name="ingredient"
          placeholder="Ingredient"
          value={form.ingredient}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="number"
          name="qtyNeeded"
          placeholder="Quantity Needed"
          value={form.qtyNeeded}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Submit Request
        </button>
      </form>
      {message && <p className="mt-4 text-green-600">{message}</p>}
    </div>
  );
}

export default IngredientRequests;
