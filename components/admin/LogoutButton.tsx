"use client";

import { logoutAction } from "@/actions/auth";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button className="btn btn--ghost btn--sm" type="submit">
        Sign out
      </button>
    </form>
  );
}
