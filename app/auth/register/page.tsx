import RegisterForm from "@/components/auth/RegisterForm";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
export const metadata = {
  title: "Account registration | lynxlink",
  description: "Create your lynxlink account",
};
export default async function RegisterPage() {
  const user = await currentUser();
  if (user) {
    redirect("/products");
  }
  return <RegisterForm />;
}
