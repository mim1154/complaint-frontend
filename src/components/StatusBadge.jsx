const styles = {
  pending: "badge-warning",
  in_progress: "badge-info",
  resolved: "badge-success",
};

export default function StatusBadge({ status }) {
  return <span className={`badge ${styles[status] || ""}`}>{status.replace("_", " ")}</span>;
}