import { useForm } from "react-hook-form";
import type { FieldValues, UseFormProps } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { AnyObjectSchema } from "yup";

export function useYupForm<TFieldValues extends FieldValues>({
  schema,
  ...options
}: { schema: AnyObjectSchema } & UseFormProps<TFieldValues>) {
  return useForm<TFieldValues>({
    resolver: yupResolver(schema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    ...options,
  });
}
