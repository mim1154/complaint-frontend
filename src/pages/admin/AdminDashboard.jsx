import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";
import api from "../../api/axios";
import Layout from "../../components/Layout";
import StatusBadge from "../../components/StatusBadge";
import Pagination from "../../components/Pagination";
import ConfirmModal from "../../components/ConfirmModal";

export default function AdminDashboard() {
  const [data, setData] = useState({ items: [], total: 0, total_pages: 0 });
  const [categories, setCategories] = useState([]);
  const [counts, setCounts] = useState({ pending: 0, in_progress: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ search: "", status: "", category_id: "", date_from: "", date_to: "", sort_by: "newest" });
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const pageSize = 8;

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

  const loadCounts = useCallback(async () => {
    try {
      const results = await Promise.all(
        ["pending", "in_progress", "resolved"].map((s) =>
          api.get("/complaints", { params: { status: s, page: 1, page_size: 1 } })
        )
      );
      setCounts({
        pending: results[0].data.total,
        in_progress: results[1].data.total,
        resolved: results[2].data.total,
      });
    } catch {
      /* summary card না এলেও চলবে */
    }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { loadCounts(); }, [loadCounts]);
  useEffect(() => {
    api.get("/categories").then((r) => setCategories(r.data)).catch(() => {});
  }, []);

  const setFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value }));
    setPage(1);
  };

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/admin/complaints/${id}/status`, { status });
      toast.success("Status updated");
      load();
      loadCounts();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/complaints/${deleteId}`);
      toast.success("Complaint deleted");
      setDeleteId(null);
      load();
      loadCounts();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Delete failed");
    }
  };

  const catName = (id) => categories.find((c) => c.id === id)?.name || "-";

  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Pending</div>
          <div className="stat-value text-warning">{counts.pending}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">In progress</div>
          <div className="stat-value text-info">{counts.in_progress}</div>
        </div>
        <div className="stat bg-base-100 rounded-box shadow">
          <div className="stat-title">Resolved</div>
          <div className="stat-value text-success">{counts.resolved}</div>
        </div>
      </div>

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
              <tr><th>ID</th><th>Title</th><th>Category</th><th>User</th><th>Status</th><th>Change status</th><th></th></tr>
            </thead>
            <tbody>
              {data.items.map((c) => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td className="font-medium">{c.title}</td>
                  <td>{catName(c.category_id)}</td>
                  <td>#{c.user_id}</td>
                  <td><StatusBadge status={c.status} /></td>
                  <td>
                    <select className="select select-bordered select-sm" value={c.status}
                      onChange={(e) => changeStatus(c.id, e.target.value)}>
                      <option value="pending">Pending</option>
                      <option value="in_progress">In progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn btn-ghost btn-sm text-error" onClick={() => setDeleteId(c.id)}><FiTrash2 /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Pagination page={page} totalPages={data.total_pages} onChange={setPage} />

      <ConfirmModal open={!!deleteId} title="Delete complaint?" message="This action cannot be undone."
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </Layout>
  );
}