import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuthStore } from "@/features/auth/stores/auth.store";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const navigate = useNavigate();
  const signIn = useAuthStore((state) => state.signIn);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await signIn(data);
      navigate("/", { replace: true });
    } catch {
      setError("root", {
        message: "Invalid username or password",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <Input
        id="username"
        label="Username"
        placeholder="Enter your username"
        autoComplete="username"
        {...register("username")}
        error={errors.username?.message}
      />

      <Input
        id="password"
        label="Password"
        type="password"
        placeholder="Enter your password"
        autoComplete="current-password"
        {...register("password")}
        error={errors.password?.message}
      />

      {errors.root?.message && (
        <p className="text-sm text-red-light">
          {errors.root.message}
        </p>
      )}

      <Button type="submit" loading={isSubmitting}>
        LOGIN
      </Button>
    </form>
  );
}
