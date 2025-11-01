import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { Login } from "../Validation/Auth";
import { api } from "../api/axios";
import toast from "react-hot-toast";
import { OrbitProgress } from "react-loading-indicators";

export function LoginPage({ className, ...props }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Login,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);

        // 👇 Call API
        const response = await api.post("/user/login", values);

        // 👇 Assuming API returns token in response.data.token
        const token = response?.data?.token;

        if (token) {
          // ✅ Save token in localStorage
          localStorage.setItem("token", token);

          toast.success("Login successful!");

          // Reset form fields
          resetForm();

          // 👇 Smooth loading + redirect effect
          setTimeout(() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              navigate("/");
            }, 1000);
          }, 1500);
        } else {
          toast.error("No token received from server!");
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Invalid credentials");
      } finally {
        // stop loading animation
        setTimeout(() => setLoading(false), 3000);
      }
    },
  });

  // 👇 Auto redirect if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-[95vh] bg-[#0A0A0A]">
          <OrbitProgress
            variant="disc"
            color="#32cd32"
            size="medium"
            text=""
            textColor="#ffffff"
          />
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col gap-6 items-center justify-center min-h-screen bg-gray-950",
            className
          )}
          {...props}
        >
          <Card className="w-full max-w-md bg-gray-900 text-gray-300 shadow-xl border border-gray-800 rounded-2xl p-4">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold text-white text-center">
                Login
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form className="space-y-4" onSubmit={formik.handleSubmit}>
                <FieldGroup>
                  {/* Email */}
                  <Field>
                    <FieldLabel htmlFor="email" className="text-gray-300">
                      Email
                    </FieldLabel>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="m@example.com"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 rounded-lg"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.email}
                      </p>
                    )}
                  </Field>

                  {/* Password */}
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password" className="text-gray-300">
                        Password
                      </FieldLabel>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      placeholder="••••••••"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 rounded-lg"
                    />
                    {formik.touched.password && formik.errors.password && (
                      <p className="text-red-500 text-sm">
                        {formik.errors.password}
                      </p>
                    )}
                  </Field>

                  {/* Submit */}
                  <Field className="flex flex-col gap-3 mt-4">
                    <Button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer"
                    >
                      Login
                    </Button>
                    <FieldDescription className="text-center text-gray-400">
                      Don&apos;t have an account?{" "}
                      <Link
                        to="/signup"
                        className="underline cursor-pointer text-white hover:text-blue-500 hover:!text-blue-500 transition-colors duration-200"
                      >
                        Sign Up
                      </Link>
                    </FieldDescription>
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
