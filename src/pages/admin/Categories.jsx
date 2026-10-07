import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import ConfirmModal from "../../components/ConfirmModal";

export default function Categories() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    try {
      const res = await api.get("/categories");
      setItems(res.data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (name.trim().length < 2) return setError("Name must be at least 2 characters");
    setError("");
    try {
      if (editingId) {
        await api.put(`/admin/categories/${editingId}`, { name });
        toast.success("Category updated");
      } else {
        await api.post("/admin/categories", { name });
        toast.success("Category added");
      }
      setName("");
      setEditingId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/admin/categories/${deleteId}`);
      toast.success("Category deleted");
      setDeleteId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Delete failed");
      setDeleteId(null);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Categories</h1>

      <form onSubmit={submit} className="flex gap-2 mb-1">
        <input className="input input-bordered flex-1" placeholder="Category name"
          value={name} onChange={(e) => setName(e.target.value)} />
        <button className="btn btn-primary"><FiPlus /> {editingId ? "Update" : "Add"}</button>
        {editingId && (
          <button type="button" className="btn" onClick={() => { setEditingId(null); setName(""); }}>Cancel</button>
        )}
      </form>
      {error && <p className="text-error text-sm mb-3">{error}</p>}

      {loading ? (
        <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg"></span></div>
      ) : items.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No categories yet.</div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-box shadow mt-3">
          <table className="table">
            <thead><tr><th>ID</th><th>Name</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.name}</td>
                  <td className="flex gap-1">
                    <button className="btn btn-ghost btn-sm" onClick={() => { setEditingId(c.id); setName(c.name); }}><FiEdit2 /></button>
                    <button className="btn btn-ghost btn-sm text-error" onClick={() => setDeleteId(c.id)}><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal open={!!deleteId} title="Delete category?" message="Complaints using this category may be affected."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </Layout>
  );
}