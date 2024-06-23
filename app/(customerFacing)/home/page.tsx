import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
export const metadata = {
  title: "Home | lynxlink",
  description: "lynxlink home page",
};
export default async function HomePage() {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  return <div>HomePage</div>;
}
