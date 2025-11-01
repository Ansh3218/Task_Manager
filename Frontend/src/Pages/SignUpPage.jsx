import React, { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { Button } from "../Components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../Components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "../Components/ui/field";
import { Input } from "../Components/ui/input";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import { SignUp } from "../Validation/Auth";
import { api } from "../api/axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { OrbitProgress } from "react-loading-indicators";

export function SignUpPage({ className, ...props }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: SignUp,
    onSubmit: async (values, { resetForm }) => {
      try {
        setLoading(true);
        const response = await api.post("/user/signup", values);
        toast.success("User SignUp successfully");
        resetForm();

        setTimeout(() => {
          setLoading(true);
          setTimeout(() => {
            setLoading(false);
          }, 2500);
          navigate("/login");
        }, 2500);
      } catch (error) {
        console.error("Registration failed: ", error?.response?.data || error);
        toast.error(error?.response?.data?.message || "Something went wrong");
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      }
    },
  });

  useEffect(() => {
    // console.log("Signup response:", response.data);
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, []);

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
            "flex flex-col overflow-y-hidden gap-6 items-center justify-center min-h-screen bg-gray-950",
            className
          )}
          {...props}
        >
          <Card className="w-full max-w-md bg-gray-900 text-gray-300 shadow-xl border border-gray-800 rounded-2xl p-4">
            <CardHeader>
              <CardTitle className="text-3xl font-semibold text-white text-center">
                SignUp
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form className="space-y-4" onSubmit={formik.handleSubmit}>
                <FieldGroup>
                  {/* Name */}
                  <Field>
                    <FieldLabel htmlFor="name" className="text-gray-300">
                      Name
                    </FieldLabel>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter your name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 rounded-lg"
                    />
                    {formik.touched.name && formik.errors.name ? (
                      <p className="text-red-500 text-sm">
                        {formik.errors.name}
                      </p>
                    ) : null}
                  </Field>

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
                    {formik.touched.email && formik.errors.email ? (
                      <p className="text-red-500 text-sm">
                        {formik.errors.email}
                      </p>
                    ) : null}
                  </Field>

                  {/* Password */}
                  <Field>
                    <FieldLabel htmlFor="password" className="text-gray-300">
                      Password
                    </FieldLabel>
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
                    {formik.touched.password && formik.errors.password ? (
                      <p className="text-red-500 text-sm">
                        {formik.errors.password}
                      </p>
                    ) : null}
                  </Field>

                  {/* Buttons */}
                  <Field className="flex flex-col gap-3 mt-4">
                    <Button
                      variant="default"
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg cursor-pointer"
                    >
                      Sign Up
                    </Button>
                    <FieldDescription className="text-center text-gray-400">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="underline cursor-pointer text-white hover:text-blue-500 hover:!text-blue-500 transition-colors duration-200"
                      >
                        Log in
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
