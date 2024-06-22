import LoginForm from "@/components/auth/LoginForm";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await currentUser();
  if (user) {
    redirect("/home");
  }
  return (
    <div className="h-screen flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
