import { Suspense } from "react";
import { AuthCard } from "@/components/AuthCard";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <AuthCard title="Log in">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthCard>
  );
}
