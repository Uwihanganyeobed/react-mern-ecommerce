// validations.js
import { z } from "zod";

export const formSchema = (type) => {
  const baseSchema = {
    email: z.string().email("Invalid email format"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
  };

  const signupSchema = {
    name: z.string().nonempty("Name is required"),
    confirmPassword: z.string().nonempty("Please confirm your password"),
    phone: z.string().nonempty("Phone number is required"),
    role: z.string().optional(),
  };

  return z.object(
    type === "login"
      ? baseSchema
      : {
          ...baseSchema,
          ...signupSchema,
        }
  ).refine((data) => data.password === data.confirmPassword || type === "login", {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });
};


// import { z } from "zod";

// // Define your validation schema with Zod
// export const formSchema = z.object({
//   name: z.string().nonempty("Name is required").optional(), // Optional for login, required for sign-up
//   email: z.string().email("Invalid email format"),
//   password: z.string().min(6, "Password must be at least 6 characters long"),
//   confirmPassword: z.string().optional(),
//   phone: z.string().nonempty("Phone number is required").optional(), // Optional for login
//   role: z.string().optional(), // Optional if not required
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords must match",
//   path: ["confirmPassword"], // This points to the confirmPassword field
// });

// // Adjust schema for login (without confirmPassword and phone)
// export const loginSchema = z.object({
//   email: z.string().email("Invalid email format"),
//   password: z.string().min(6, "Password must be at least 6 characters long"),
// });

// // Schema for registration (keeps confirmPassword and phone)
// export const registerSchema = formSchema;
