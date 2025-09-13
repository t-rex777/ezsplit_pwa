import { authService } from "@/api/services/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { FieldInfo } from "./formFieldInfo";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const searchParams = new URL(window.location.href).searchParams;

  const form = useForm({
    defaultValues: {
      email_address: searchParams.get("email_address") ?? "",
      password: "",
      password_confirmation: "",
      first_name: searchParams.get("email_address")?.split("@")[0] ?? "",
      last_name: "",
      phone: "",
      date_of_birth: "",
    },
    onSubmit: async ({ value }) => {
      const token = searchParams.get("token");

      try {
        const response = await authService.register({
          email_address: value.email_address,
          password: value.password,
          password_confirmation: value.password_confirmation,
          first_name: value.first_name,
          last_name: value.last_name,
          phone: value.phone || undefined,
          date_of_birth: value.date_of_birth || undefined,
          ...(token !== null && { token }),
        });

        await queryClient.setQueryData(["session"], response);
        await navigate({ to: "/home" });
      } catch (error) {
        console.error("Registration failed:", error);
        // Handle error - you might want to show a toast or error message
      }
    },
  });

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            className="p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-balance">
                  Join EZSplit and start managing your expenses
                </p>
              </div>

              {/* Name Fields */}
              <div className="grid gap-3">
                <form.Field name="first_name">
                  {(field) => {
                    return (
                      <>
                        <Label htmlFor={field.name}>First Name</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="John"
                        />
                        <FieldInfo field={field} />
                      </>
                    );
                  }}
                </form.Field>

                <form.Field name="last_name">
                  {(field) => {
                    return (
                      <>
                        <Label htmlFor={field.name}>Last Name</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Doe"
                        />
                        <FieldInfo field={field} />
                      </>
                    );
                  }}
                </form.Field>
              </div>

              {/* Email Field */}
              <div className="grid gap-3">
                <form.Field name="email_address">
                  {(field) => {
                    return (
                      <>
                        <Label htmlFor={field.name}>Email Address</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="john.doe@example.com"
                        />
                        <FieldInfo field={field} />
                      </>
                    );
                  }}
                </form.Field>
              </div>

              {/* Password Fields */}
              <div className="grid gap-3">
                <form.Field name="password">
                  {(field) => {
                    return (
                      <>
                        <Label htmlFor={field.name}>Password</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Enter your password"
                        />
                        <FieldInfo field={field} />
                      </>
                    );
                  }}
                </form.Field>

                <form.Field name="password_confirmation">
                  {(field) => {
                    return (
                      <>
                        <Label htmlFor={field.name}>Confirm Password</Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="password"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Confirm your password"
                        />
                        <FieldInfo field={field} />
                      </>
                    );
                  }}
                </form.Field>
              </div>

              {/* Optional Fields */}
              <div className="grid gap-3">
                <form.Field name="phone">
                  {(field) => {
                    return (
                      <>
                        <Label htmlFor={field.name}>
                          Phone Number (Optional)
                        </Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="tel"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="+1 (555) 123-4567"
                        />
                        <FieldInfo field={field} />
                      </>
                    );
                  }}
                </form.Field>

                <form.Field name="date_of_birth">
                  {(field) => {
                    return (
                      <>
                        <Label htmlFor={field.name}>
                          Date of Birth (Optional)
                        </Label>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="date"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                        <FieldInfo field={field} />
                      </>
                    );
                  }}
                </form.Field>
              </div>

              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {() => {
                  return (
                    <Button type="submit" className="w-full">
                      Create Account
                    </Button>
                  );
                }}
              </form.Subscribe>

              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/login" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
          <div
            className="h-full w-full"
            style={{
              background: "linear-gradient(135deg, #f0abfc 0%, #818cf8 100%)",
              borderRadius: "inherit",
            }}
            aria-hidden="true"
          />
        </CardContent>
      </Card>
    </div>
  );
}
