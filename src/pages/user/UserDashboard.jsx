import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import Pagination from "../../components/Pagination";
import ConfirmModal from "../../components/ConfirmModal";
import ComplaintForm from "../../components/ComplaintForm";

export default function UserDashboard() {
  const [data, setData] = useState({ items: [], total: 0, total_pages: 0 });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({ search: "", status: "", category_id: "", date_from: "", date_to: "", sort_by: "newest" });
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { page, page_size: pageSize, sort_by: filters.sort_by };
      ["search", "status", "category_id", "date_from", "date_to"].forEach((k) => {
        if (filters[k]) params[k] = filters[k];
      });
      const res = await api.get("/complaints", { params });
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const setFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const handleSubmit = async (values) => {
    try {
      if (editing) {
        await api.put(`/complaints/${editing.id}`, values);
        toast.success("Complaint updated");
      } else {
        await api.post("/complaints", values);
        toast.success("Complaint submitted");
      }
      setFormOpen(false);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/complaints/${deleteId}`);
      toast.success("Complaint deleted");
      setDeleteId(null);
      load();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Delete failed");
    }
  };

  const catName = (id) => categories.find((c) => c.id === id)?.name || "-";

  return (
    <Layout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Complaints</h1>
        <button className="btn btn-primary" onClick={() => { setEditing(null); setFormOpen(true); }}>
          <FiPlus /> New Complaint
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
        <input className="input input-bordered" placeholder="Search by title or ID"
          value={filters.search} onChange={(e) => setFilter("search", e.target.value)} />
        <select className="select select-bordered" value={filters.status} onChange={(e) => setFilter("status", e.target.value)}>
          <option value="">All status</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In progress</option>
          <option value="resolved">Resolved</option>
        </select>
        <select className="select select-bordered" value={filters.category_id} onChange={(e) => setFilter("category_id", e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="date" className="input input-bordered" value={filters.date_from} onChange={(e) => setFilter("date_from", e.target.value)} />
        <input type="date" className="input input-bordered" value={filters.date_to} onChange={(e) => setFilter("date_to", e.target.value)} />
        <select className="select select-bordered" value={filters.sort_by} onChange={(e) => setFilter("sort_by", e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="title_asc">Title A-Z</option>
          <option value="title_desc">Title Z-A</option>
        </select>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-10"><span className="loading loading-spinner loading-lg"></span></div>
      ) : error ? (
        <div className="alert alert-error">{error}</div>
      ) : data.items.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No complaints found.</div>
      ) : (
        <div className="overflow-x-auto bg-base-100 rounded-box shadow">
          <table className="table">
            <thead>
              <tr><th>ID</th><th>Title</th><th>Category</th><th>Status</th><th>Date</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {data.items.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td className="font-medium">{c.title}</td>
                  <td>{catName(c.category_id)}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  <td className="flex gap-1">
                    <button className="btn btn-ghost btn-sm" onClick={() => { setEditing(c); setFormOpen(true); }}><FiEdit2 /></button>
                    <button className="btn btn-ghost btn-sm text-error" onClick={() => setDeleteId(c.id)}><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={data.total_pages} onChange={setPage} />

      <ComplaintForm open={formOpen} categories={categories} initial={editing}
        onSubmit={handleSubmit} onClose={() => { setFormOpen(false); setEditing(null); }} />

      <ConfirmModal open={!!deleteId} title="Delete complaint?" message="This action cannot be undone."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </Layout>
  );
}