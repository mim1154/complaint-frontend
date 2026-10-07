export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="join flex justify-center mt-4">
      <button className="join-item btn btn-sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>«</button>
      <button className="join-item btn btn-sm">Page {page} / {totalPages}</button>
      <button className="join-item btn btn-sm" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>»</button>
    </div>
  );
}