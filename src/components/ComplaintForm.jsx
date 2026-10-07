import { useEffect, useState } from "react";

export default function ComplaintForm({ open, categories, initial, onSubmit, onClose }) {
  const [form, setForm] = useState({ title: "", description: "", category_id: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      setForm(initial
        ? { title: initial.title, description: initial.description, category_id: initial.category_id }
        : { title: "", description: "", category_id: "" });
      setErrors({});
    }
  }, [open, initial]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    const err = {};
    if (form.title.trim().length < 3) err.title = "Title must be at least 3 characters";
    if (form.description.trim().length < 10) err.description = "Description must be at least 10 characters";
    if (!form.category_id) err.category_id = "Select a category";
    setErrors(err);
    if (Object.keys(err).length === 0) onSubmit({ ...form, category_id: Number(form.category_id) });
  };

  return (
    <div className="modal modal-open">
      <form onSubmit={submit} className="modal-box space-y-3">
        <h3 className="font-bold text-lg">{initial ? "Edit Complaint" : "New Complaint"}</h3>

        <div>
          <input className="input input-bordered w-full" placeholder="Title"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          {errors.title && <p className="text-error text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <textarea className="textarea textarea-bordered w-full" rows={4} placeholder="Describe the problem"
            value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          {errors.description && <p className="text-error text-sm mt-1">{errors.description}</p>}
        </div>

        <div>
          <select className="select select-bordered w-full"
            value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {errors.category_id && <p className="text-error text-sm mt-1">{errors.category_id}</p>}
        </div>

        <div className="modal-action">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary">{initial ? "Update" : "Submit"}</button>
        </div>
      </form>
    </div>
  );
}