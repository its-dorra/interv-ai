import { AnyFieldApi } from "@tanstack/react-form";

export default function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <div>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <p className="text-red-500 text-sm">
          {field.state.meta.errors.map((err) => err.message).join(",")}
        </p>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </div>
  );
}
