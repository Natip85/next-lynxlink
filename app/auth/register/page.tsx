import RegisterForm from "@/components/auth/RegisterForm";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function RegisterPage() {
  const user = await currentUser();
  if (user) {
    redirect("/home");
  }
  return <RegisterForm />;
}
