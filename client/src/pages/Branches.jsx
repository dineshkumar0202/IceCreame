import { useEffect, useState } from "react";
import axios from "axios";

function Branches() {
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/branches")
      .then(res => setBranches(res.data))
      .catch(err => console.error("Error fetching branches:", err));
  }, []);

  if (branches.length === 0) {
    return <p className="p-6">No branches found.</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🏪 Branches</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">City</th>
            <th className="border p-2">Total Sales</th>
          </tr>
        </thead>
        <tbody>
          {branches.map(branch => (
            <tr key={branch._id} className="text-center">
              <td className="border p-2">{branch.name}</td>
              <td className="border p-2">{branch.city}</td>
              <td className="border p-2">{branch.totalSales || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Branches;
