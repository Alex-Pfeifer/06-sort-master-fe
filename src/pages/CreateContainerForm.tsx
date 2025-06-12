import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";

const CreateContainerForm = () => {
  const [message, setMessage] = useState<{ type: string; text: string } | null>(
    null
  );

  const formik = useFormik({
    initialValues: {
      name: "",
      color: "",
      description: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      color: Yup.string()
        .matches(/^#([0-9A-F]{3}){1,2}$/i, "Invalid color hex")
        .required("Color is required"),
      description: Yup.string().required("Description is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const response = await fetch("/api/containers", {
          method: "POST",
          headers: { "Content-Type": "application/json", accept: "*/*" },
          body: JSON.stringify(values),
        });

        if (!response.ok) throw new Error("Failed to create container");

        setMessage({
          type: "success",
          text: "Container created successfully!",
        });
        resetForm();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        setMessage({ type: "error", text: error.message });
      }
    },
  });

  return (
    <div className="mx-auto max-w-sm space-y-6 p-6 rounded-lg border bg-white shadow-sm mt-10">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">
          Create Container
        </h1>
        <p className="text-sm text-muted-foreground text-gray-500">
          Fill out the form to create a new rubbish container
        </p>
      </div>

      {message && (
        <div
          className={`text-sm p-2 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            id="name"
            type="text"
            {...formik.getFieldProps("name")}
            className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm ${
              formik.touched.name && formik.errors.name
                ? "border-red-500"
                : "border-input"
            }`}
            placeholder="Plastic, Paper..."
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-sm text-red-500">{formik.errors.name}</p>
          )}
        </div>

        {/* Color Field */}
        <div className="space-y-2">
          <label
            htmlFor="color"
            className="block text-sm font-medium text-gray-700"
          >
            Color (Hex)
          </label>
          <input
            id="color"
            type="text"
            {...formik.getFieldProps("color")}
            className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm ${
              formik.touched.color && formik.errors.color
                ? "border-red-500"
                : "border-input"
            }`}
            placeholder="#FFA500"
          />
          {formik.touched.color && formik.errors.color && (
            <p className="text-sm text-red-500">{formik.errors.color}</p>
          )}
        </div>

        {/* Description Field */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </label>
          <input
            id="description"
            type="text"
            {...formik.getFieldProps("description")}
            className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm ${
              formik.touched.description && formik.errors.description
                ? "border-red-500"
                : "border-input"
            }`}
            placeholder="Orange container for plastic"
          />
          {formik.touched.description && formik.errors.description && (
            <p className="text-sm text-red-500">{formik.errors.description}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
        >
          Create Container
        </button>
      </form>
    </div>
  );
};

export default CreateContainerForm;
