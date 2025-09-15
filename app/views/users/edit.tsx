import React, { useState } from "react";
import { useContent } from "@thoughtbot/superglue";
import { AppLayout } from "../../frontend/components/layouts/AppLayout";
import { Form, FieldBase, SubmitButton } from "@components/Inputs";
import { ArrowLeft } from "lucide-react";

interface EditUserFormData {
  form: any;
  extras: any;
  inputs: any;
  errors: {
    email_address?: string[];
    password?: string[];
    password_confirmation?: string[];
  };
}

interface User {
  id: number;
  email_address: string;
  created_at: string;
  updated_at: string;
}

interface EditUserPageContent {
  edit_user_form: EditUserFormData;
  user: User;
  back_path: string;
}

export default function UsersEdit() {
  const { edit_user_form, user, back_path } = useContent<EditUserPageContent>();
  const { form, extras, inputs, errors } = edit_user_form;

  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [clientErrors, setClientErrors] = useState<{ [key: string]: string }>(
    {}
  );

  const validatePassword = (password: string) => {
    if (password && password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return null;
  };

  const validatePasswordConfirmation = (
    password: string,
    confirmation: string
  ) => {
    if (password && password !== confirmation) {
      return "Password confirmation does not match";
    }
    return null;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    const passwordError = validatePassword(value);
    const confirmationError = validatePasswordConfirmation(
      value,
      passwordConfirmation
    );

    setClientErrors((prev) => ({
      ...prev,
      password: passwordError || "",
      password_confirmation: confirmationError || "",
    }));
  };

  const handlePasswordConfirmationChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setPasswordConfirmation(value);

    const confirmationError = validatePasswordConfirmation(password, value);

    setClientErrors((prev) => ({
      ...prev,
      password_confirmation: confirmationError || "",
    }));
  };

  const getFieldError = (fieldName: string) => {
    return (
      clientErrors[fieldName] || errors[fieldName as keyof typeof errors]?.[0]
    );
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-6 px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <a
              href={back_path}
              data-sg-visit
              className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Users
            </a>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit User</h1>
          <p className="text-gray-600">Update user information and password</p>
        </div>

        {/* Form */}
        <div className="max-w-2xl">
          <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                User Information
              </h2>
              <p className="text-sm text-gray-500">
                User ID: {user.id} | Created:{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>

            <Form {...form} extras={extras} className="space-y-6">
              <div>
                <FieldBase
                  {...inputs.emailAddress}
                  label="Email Address"
                  className="px-3 py-2 border border-gray-300 rounded-lg w-full"
                  error={getFieldError("email_address")}
                />
              </div>

              <div>
                <FieldBase
                  {...inputs.password}
                  label="New Password"
                  type="password"
                  className="px-3 py-2 border border-gray-300 rounded-lg w-full"
                  error={getFieldError("password")}
                  onChange={handlePasswordChange}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave blank to keep current password
                </p>
              </div>

              <div>
                <FieldBase
                  {...inputs.passwordConfirmation}
                  label="Confirm New Password"
                  type="password"
                  className="px-3 py-2 border border-gray-300 rounded-lg w-full"
                  error={getFieldError("password_confirmation")}
                  onChange={handlePasswordConfirmationChange}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Leave blank to keep current password
                </p>
              </div>

              <div className="flex items-center space-x-4 pt-4">
                <SubmitButton
                  text="Update User"
                  className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors"
                  type="submit"
                  name="commit"
                />
                <a
                  href={back_path}
                  data-sg-visit
                  className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </a>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
