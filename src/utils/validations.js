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

// Define Zod schema for checkout validation
export const checkoutSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  company: z.string().optional(),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  country: z.string().nonempty("Country is required"),
  state: z.string().nonempty("State/Province is required"),
  postalCode: z.string().nonempty("Postal code is required"),
  phone: z.string().nonempty("Phone number is required"),
  deliveryMethod: z.string().nonempty("Delivery method is required"),
  paymentMethod: z.string().nonempty("Payment method is required"),
  cardNumber: z.string().nonempty("Card number is required"),
  cardName: z.string().nonempty("Name on card is required"),
  expirationDate: z.string().nonempty("Expiration date is required"),
  cvc: z.string().nonempty("CVC is required"),
});

export const contactSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string()
    .nonempty("Phone number is required")
    .regex(/^\+250\d{9}$/, "Phone number must start with +250 and be 12 digits"),
  message: z.string().nonempty("Message is required")
});