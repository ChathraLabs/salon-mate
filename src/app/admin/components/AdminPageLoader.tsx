export function AdminPageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="admin-page-loader" role="status" aria-live="polite">
      <span className="admin-page-loader__spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
