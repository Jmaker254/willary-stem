"use client";

export default function ConfirmButton({
  children,
  message = "Are you sure?",
  className = "btn-link",
  name,
  value,
}: {
  children: React.ReactNode;
  message?: string;
  className?: string;
  name?: string;
  value?: string;
}) {
  return (
    <button
      type="submit"
      name={name}
      value={value}
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
