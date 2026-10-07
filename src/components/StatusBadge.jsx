import { FiClock, FiLoader, FiCheckCircle } from "react-icons/fi";

const map = {
  pending: { cls: "badge-warning", icon: FiClock, label: "Pending" },
  in_progress: { cls: "badge-info", icon: FiLoader, label: "In progress" },
  resolved: { cls: "badge-success", icon: FiCheckCircle, label: "Resolved" },
};

export default function StatusBadge({ status }) {
  const s = map[status] || map.pending;
  const Icon = s.icon;
  return <span className={`badge ${s.cls} badge-soft gap-1 font-medium`}><Icon /> {s.label}</span>;
}