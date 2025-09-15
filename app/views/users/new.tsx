import React, { useState } from "react";
import { useContent } from "@thoughtbot/superglue";
import { Layout } from "@components/layouts/Layout";
import Container from "@components/Container";
import { Form, FieldBase, SubmitButton } from "@components/Inputs";

interface SignupFormData {
  form: any;
  extras: any;
  inputs: any;
  errors: {
    email_address?: string[];
    password?: string[];
    password_confirmation?: string[];
  };
}

interface SignupPageContent {
  signup_form: SignupFormData;
  login_path: string;
}

export default function UsersNew() {
  const { signup_form, login_path } = useContent<SignupPageContent>();
  const { form, extras, inputs, errors } = signup_form;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [clientErrors, setClientErrors] = useState<{ [key: string]: string }>(
    {}
  );
  const [touchedFields, setTouchedFields] = useState<{
    [key: string]: boolean;
  }>({});

  const validateEmail = (email: string) => {
    if (!email) {
      return "Email address is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (password.length > 128) {
      return "Password must be less than 128 characters";
    }
    // Check for at least one letter and one number
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    if (!hasLetter || !hasNumber) {
      return "Password must contain at least one letter and one number";
    }
    return null;
  };

  const validatePasswordConfirmation = (
    password: string,
    confirmation: string
  ) => {
    if (!confirmation) {
      return "Password confirmation is required";
    }
    if (password !== confirmation) {
      return "Password confirmation does not match";
    }
    return null;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Only validate on change if the field has been touched
    if (touchedFields.email_address) {
      const emailError = validateEmail(value);
      setClientErrors((prev) => ({
        ...prev,
        email_address: emailError || "",
      }));
    }
  };

  const handleEmailBlur = () => {
    setTouchedFields((prev) => ({
      ...prev,
      email_address: true,
    }));

    const emailError = validateEmail(email);
    setClientErrors((prev) => ({
      ...prev,
      email_address: emailError || "",
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    // Only validate on change if the field has been touched
    if (touchedFields.password) {
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
    }
  };

  const handlePasswordBlur = () => {
    setTouchedFields((prev) => ({
      ...prev,
      password: true,
    }));

    const passwordError = validatePassword(password);
    const confirmationError = validatePasswordConfirmation(
      password,
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

    // Only validate on change if the field has been touched
    if (touchedFields.password_confirmation) {
      const confirmationError = validatePasswordConfirmation(password, value);

      setClientErrors((prev) => ({
        ...prev,
        password_confirmation: confirmationError || "",
      }));
    }
  };

  const handlePasswordConfirmationBlur = () => {
    setTouchedFields((prev) => ({
      ...prev,
      password_confirmation: true,
    }));

    const confirmationError = validatePasswordConfirmation(
      password,
      passwordConfirmation
    );

    setClientErrors((prev) => ({
      ...prev,
      password_confirmation: confirmationError || "",
    }));
  };

  const getFieldError = (fieldName: string) => {
    // Only show client errors if the field has been touched
    const clientError = touchedFields[fieldName] ? clientErrors[fieldName] : "";
    const serverError = errors[fieldName as keyof typeof errors]?.[0];

    return clientError || serverError;
  };

  const getFieldClassName = (fieldName: string, baseClassName: string) => {
    const hasError = getFieldError(fieldName);
    const isTouched = touchedFields[fieldName];

    if (hasError && isTouched) {
      return `${baseClassName} border-red-500 focus:border-red-500 focus:ring-red-500`;
    }

    return baseClassName;
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return { strength: 0, label: "", color: "" };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-zA-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    const levels = [
      { strength: 0, label: "Very Weak", color: "bg-red-500" },
      { strength: 1, label: "Weak", color: "bg-red-400" },
      { strength: 2, label: "Fair", color: "bg-yellow-400" },
      { strength: 3, label: "Good", color: "bg-yellow-500" },
      { strength: 4, label: "Strong", color: "bg-green-400" },
      { strength: 5, label: "Very Strong", color: "bg-green-500" },
    ];

    return levels[Math.min(strength, 5)];
  };

  const passwordStrength = getPasswordStrength(password);

  const isFormValid = () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const confirmationError = validatePasswordConfirmation(
      password,
      passwordConfirmation
    );

    return (
      !emailError &&
      !passwordError &&
      !confirmationError &&
      email &&
      password &&
      passwordConfirmation
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (!isFormValid()) {
      e.preventDefault();
      // Mark all fields as touched and trigger validation
      setTouchedFields({
        email_address: true,
        password: true,
        password_confirmation: true,
      });
      setClientErrors({
        email_address: validateEmail(email) || "",
        password: validatePassword(password) || "",
        password_confirmation:
          validatePasswordConfirmation(password, passwordConfirmation) || "",
      });
    }
  };

  return (
    <Layout>
      <Container>
        <div className="max-w-lg mx-auto border border-gray-300 rounded-lg p-8 mt-16 mb-24">
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-base text-slate-500 mb-4">
            Enter your email address and password to create your account.
          </p>
          <Form
            {...form}
            extras={extras}
            className="flex flex-col"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col space-y-2">
              <FieldBase
                {...inputs.emailAddress}
                label="Email address"
                className={getFieldClassName(
                  "email_address",
                  "px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                )}
                error={getFieldError("email_address")}
                onChange={handleEmailChange}
                onBlur={handleEmailBlur}
              />
              <div className="flex flex-col space-y-2">
                <FieldBase
                  {...inputs.password}
                  label="Password"
                  type="password"
                  className={getFieldClassName(
                    "password",
                    "px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                  )}
                  error={getFieldError("password")}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                />
                {password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                          style={{
                            width: `${(passwordStrength.strength / 5) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 font-medium">
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Password requirements: 8+ characters, letters, numbers
                    </div>
                  </div>
                )}
              </div>
              <FieldBase
                {...inputs.passwordConfirmation}
                label="Confirm Password"
                type="password"
                className={getFieldClassName(
                  "password_confirmation",
                  "px-3 py-2 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
                )}
                error={getFieldError("password_confirmation")}
                onChange={handlePasswordConfirmationChange}
                onBlur={handlePasswordConfirmationBlur}
              />
              <SubmitButton
                text="Create Account"
                className={`font-semibold mt-6 py-2 px-6 rounded-full transition-colors ${
                  isFormValid()
                    ? "bg-indigo-700 text-white hover:bg-indigo-800"
                    : "bg-gray-400 text-gray-200 cursor-not-allowed"
                }`}
                type="submit"
                name="commit"
                disabled={!isFormValid()}
              />
            </div>
          </Form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href={login_path}
                data-sg-visit
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Sign in
              </a>
            </p>
          </div>
        </div>
      </Container>
    </Layout>
  );
}
