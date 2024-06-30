import { currentUser } from "@/lib/auth";
import { UserRole } from "@prisma/client";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await currentUser();
  if (user?.role !== UserRole.ADMIN) {
    return redirect("/");
  }
  return (
    <div className="flex flex-col gap-10">
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
      <div>gfrgeger</div>
    </div>
  );
}
