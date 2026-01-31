import { Button, Stack, TextField, Typography } from "@mui/material";
import { FormProvider, Controller } from "react-hook-form";
import { useYupForm } from "../../hooks/useYupForm";
import { signupSchema, type SignupValues } from "./schemas";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "./AuthLayout";
import type { IApiError } from "../../types/apiError";
import { PageHead } from "../../components/ui/PageHead";

export default function Signup() {
  const form = useYupForm<SignupValues>({
    schema: signupSchema,
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });
  const { handleSubmit, control, setError, formState } = form;
  const { signup } = useAuth();
  const nav = useNavigate();

  const onSubmit = async (values: SignupValues) => {
    try {
      await signup(values.name, values.email, values.password);
      nav("/2fa/setup", { replace: true });
    } catch (e) {
      const err = e as IApiError;
      if (err.fieldErrors) {
        Object.entries(err.fieldErrors).forEach(([name, message]) =>
          setError(name as keyof SignupValues, { type: "server", message }),
        );
      }
      if (err.message) {
        setError("root", { type: "server", message: err.message });
      }
    }
  };

  return (
    <AuthLayout title="Sign up">
      <PageHead
        title="Sign Up"
        description="Create a new account to get started with our platform and access all features"
        keywords="signup, register, create account, new user, registration"
      />
      <FormProvider {...form}>
        <Stack component="form" gap={2} onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <TextField
                label="Name"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
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
                autoComplete="new-password"
                fullWidth
              />
            )}
          />
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field, fieldState }) => (
              <TextField
                label="Confirm Password"
                type="password"
                {...field}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                autoComplete="new-password"
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
            Create account
          </Button>
        </Stack>
      </FormProvider>
    </AuthLayout>
  );
}
