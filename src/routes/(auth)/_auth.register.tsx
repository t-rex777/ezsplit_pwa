import { RegisterForm } from "@/components/register-form";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/_auth/register")({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <RegisterForm />
      </div>
    </div>
  );
}
