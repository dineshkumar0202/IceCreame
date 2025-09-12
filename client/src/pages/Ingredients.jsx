import { useState, useEffect } from "react";

const IngredientsPage = () => {
  const [requests, setRequests] = useState([]);
  const [branches, setBranches] = useState([]);
  const [form, setForm] = useState({
    branch: "",
    flavor: "",
    ingredient: "",
    qty: "",
  });

  // Fetch ingredient requests
  useEffect(() => {
    fetch("http://localhost:5000/api/ingredients")
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch branches for dropdown
  useEffect(() => {
    fetch("http://localhost:5000/api/branches")
      .then((res) => res.json())
      .then((data) => setBranches(data))
      .catch((err) => console.error(err));
  }, []);

  // Handle form input
  const handleAction = async (id, action) => {
  try {
    const res = await fetch(
      `http://localhost:5000/api/ingredients/${id}/${action}`,
      { method: "PATCH" }
    );
    const data = await res.json();
    alert(data.message);

    // refresh requests
    setRequests(prev =>
      prev.map(r => (r._id === id ? { ...r, status: action } : r))
    );
  } catch (err) {
    console.error(err);
  }
};


  return (
    <div className="p-6">
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
              <p>
                <b>Status:</b> {req.status || "pending"}
              </p>

              {/* Action buttons */}
              {req.status === "pending" && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleAction(req._id, "approve")}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleAction(req._id, "reject")}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default IngredientsPage;
