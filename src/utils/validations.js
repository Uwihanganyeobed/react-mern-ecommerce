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

// Update checkout schema to be more specific and handle different payment methods
export const checkoutSchema = z.object({
  // Contact Information
  email: z.string().email("Invalid email address"),

  // Shipping Information
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  address: z.string().min(5, "Please enter a valid address"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  state: z.string().min(2, "State/Province is required"),
  postalCode: z.string().min(4, "Please enter a valid postal code"),
  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),

  // Optional company name
  company: z.string().optional(),

  // Delivery Method
  deliveryMethod: z.enum(["standard", "express"], {
    errorMap: () => ({ message: "Please select a delivery method" })
  }),

  // Payment Method
  paymentMethod: z.enum(["credit_card", "paypal", "digital_wallet"], {
    errorMap: () => ({ message: "Please select a payment method" })
  }),

  // Credit Card Details - only required if paymentMethod is credit_card
  cardDetails: z.object({
    cardNumber: z.string()
      .regex(/^\d{16}$/, "Please enter a valid 16-digit card number")
      .optional(),
    cardName: z.string()
      .min(2, "Please enter the name on card")
      .optional(),
    expirationDate: z.string()
      .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Please enter a valid expiry date (MM/YY)")
      .optional(),
    cvc: z.string()
      .regex(/^\d{3,4}$/, "Please enter a valid CVC")
      .optional(),
  }).superRefine((data, ctx) => {
    // If payment method is credit_card, all card details are required
    if (ctx.parent.paymentMethod === "credit_card") {
      if (!data.cardNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Card number is required",
          path: ["cardNumber"],
        });
      }
      if (!data.cardName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Name on card is required",
          path: ["cardName"],
        });
      }
      if (!data.expirationDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Expiration date is required",
          path: ["expirationDate"],
        });
      }
      if (!data.cvc) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "CVC is required",
          path: ["cvc"],
        });
      }
    }
  }),
});

// Helper function to validate checkout data
export const validateCheckout = (data) => {
  try {
    const validatedData = checkoutSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce((acc, err) => {
        acc[err.path.join('.')] = err.message;
        return acc;
      }, {});
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
};

export const contactSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string()
    .nonempty("Phone number is required")
    .regex(/^\+250\d{9}$/, "Phone number must start with +250 and be 12 digits"),
  message: z.string().nonempty("Message is required")
});

// Add these new schemas
export const billingSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string()
    .nonempty("Phone number is required")
    .regex(/^\+\d{1,4}\d{6,}$/, "Please enter a valid phone number"),
  company: z.string().optional(),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  country: z.string().nonempty("Country is required"),
  state: z.string().nonempty("State/Province is required"),
  postalCode: z.string().nonempty("Postal code is required"),
});

export const shippingSchema = z.object({
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  address: z.string().nonempty("Address is required"),
  city: z.string().nonempty("City is required"),
  country: z.string().nonempty("Country is required"),
  state: z.string().nonempty("State/Province is required"),
  postalCode: z.string().nonempty("Postal code is required"),
  phone: z.string()
    .nonempty("Phone number is required")
    .regex(/^\+\d{1,4}\d{6,}$/, "Please enter a valid phone number"),
  deliveryInstructions: z.string().optional(),
});

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!emailRegex.test(email)) return "Invalid email format";
  return "";
};

export const validatePassword = (password) => {
  if (!password) return "Password is required";
  if (password.length < 6) return "Password must be at least 6 characters";
  if (password.length > 30) return "Password must be less than 30 characters";
  if (!/\d/.test(password)) return "Password must contain at least one number";
  if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter";
  if (!/[!@#$%^&*]/.test(password)) return "Password must contain at least one special character";
  return "";
};

export const validateName = (name) => {
  if (!name) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (name.length > 50) return "Name must be less than 50 characters";
  if (!/^[a-zA-Z\s]*$/.test(name)) return "Name can only contain letters and spaces";
  return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Please confirm your password";
  if (password !== confirmPassword) return "Passwords do not match";
  return "";
};