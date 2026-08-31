import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { setUserRole, deleteUser } from "@/actions/admin/users";
import { CreateUserForm, ResetPasswordForm } from "@/components/admin/UserAdmin";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const me = await requireUser("ADMIN");
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <>
      <h1>Staff &amp; roles</h1>

      <div className="panel">
        <h2>Add a staff member</h2>
        <CreateUserForm />
      </div>

      <div className="panel">
        <h2>Team</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Password</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>
                  {u.name}
                  {u.id === me.id ? " (you)" : ""}
                </td>
                <td>{u.email}</td>
                <td>
                  <span className="inline-actions">
                    {Object.values(Role).map((r) => (
                      <form key={r} action={setUserRole.bind(null, u.id, r)}>
                        <button
                          className="btn-link"
                          type="submit"
                          disabled={u.role === r || u.id === me.id}
                          style={{ fontWeight: u.role === r ? 700 : 400 }}
                        >
                          {r.toLowerCase()}
                        </button>
                      </form>
                    ))}
                  </span>
                </td>
                <td>
                  <ResetPasswordForm id={u.id} />
                </td>
                <td>
                  {u.id !== me.id && (
                    <form action={deleteUser.bind(null, u.id)}>
                      <ConfirmButton className="btn-link" message={`Delete ${u.email}?`}>
                        delete
                      </ConfirmButton>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
