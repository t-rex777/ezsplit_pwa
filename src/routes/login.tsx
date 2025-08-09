import { LoginForm } from "@/components/login-form";
import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    const session = queryClient.getQueryData(["session"]);
    console.log(session, "LOGGER");
    if (session) {
      navigate({ to: "/home" });
    }
  }, []);

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
}
