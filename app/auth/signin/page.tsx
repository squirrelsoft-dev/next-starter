import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SignInForm } from "@/components/auth/signin-form";

export default async function SignInPage() {
  const session = await auth();

  // If already signed in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <SignInForm />
    </div>
  );
}
