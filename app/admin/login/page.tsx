import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LoginForm from "@/components/forms/LoginForm";

export const metadata = { title: "Admin sign in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const user = await getSession();
  if (user) redirect(next && next.startsWith("/admin") ? next : "/admin");

  return (
    <div className="login-wrap">
      <LoginForm next={next} />
    </div>
  );
}
