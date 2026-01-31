import { Button, Stack, TextField, Typography } from "@mui/material";
import { FormProvider, Controller } from "react-hook-form";
import { useYupForm } from "../../hooks/useYupForm";
import { loginSchema, type LoginValues } from "./schemas";
import { useAuth } from "../../hooks/useAuth";
import { useLocation, useNavigate, type Location } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import type { IApiError } from "../../types/apiError";
import { PageHead } from "../../components/ui/PageHead";

export default function Login() {
  const form = useYupForm<LoginValues>({
    schema: loginSchema,
    defaultValues: { email: "", password: "" },
  });
  const { handleSubmit, control, setError, formState } = form;
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation() as Location;

  const onSubmit = async (values: LoginValues) => {
    try {
      const result = await login(values.email, values.password);
      console.log("Login result:", result);
      // Check if 2FA is required
      if (result?.requiresTwoFactor) {
        // Navigate to 2FA verification page with email in state
        nav("/2fa/verify", {
          replace: true,
          state: {
            email: values.email,
            from: location.state?.from,
          },
        });
        return;
      }

      // Normal login success
      const redirectTo = location.state?.from?.pathname ?? "/dashboard";
      nav(redirectTo, { replace: true });
    } catch (e) {
      const err = e as IApiError;
      if (err.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([name, message]) =>
          setError(name as keyof LoginValues, { type: "server", message }),
        );
      }
      if (err.message) {
        setError("root", { type: "server", message: err.message });
      }
    }
  };

  return (
    <AuthLayout title="Login" maxWidth={420}>
      <PageHead
        title="Login"
        description="Sign in to your account to access your dashboard and manage your profile"
        keywords="login, signin, authentication, access, account"
      />
      <FormProvider {...form}>
        <Stack component="form" gap={2} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="email"
            render={({ field, fieldState }) => (
              <TextField
                label="Email"
                type="email"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                autoComplete="email"
                fullWidth
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field, fieldState }) => (
              <TextField
                label="Password"
                type="password"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                autoComplete="current-password"
                fullWidth
              />
            )}
          />
          {formState.errors.root?.message && (
            <Typography color="error">
              {formState.errors.root.message}
            </Typography>
          )}
          <Button type="submit" variant="contained">
            Login
          </Button>
        </Stack>
      </FormProvider>
    </AuthLayout>
  );
}
