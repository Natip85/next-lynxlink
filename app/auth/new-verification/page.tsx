import NewVerificationForm from "@/components/auth/NewVerificationForm";
export const metadata = {
  title: "Email verification | lynxlink",
  description: "Verifying your email address",
};
export default function page() {
  return <NewVerificationForm />;
}
