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


// Simplified checkout schema - flattened structure
export const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  company: z.string().optional(),
  address: z.string().min(5, "Please enter a valid address"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  state: z.string().min(2, "State/Province is required"),
  postalCode: z.string().min(4, "Please enter a valid postal code"),
  deliveryMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["credit_card", "paypal", "digital_wallet"]),
  
  // Card details with specific validation messages
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  expirationDate: z.string().optional(),
  cvc: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === 'credit_card') {
    if (!data.cardNumber || !data.cardNumber.match(/^\d{16}$/)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Card number must be 16 digits",
        path: ["cardNumber"]
      });
    }
    if (!data.cardName || data.cardName.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Cardholder name must be at least 3 characters",
        path: ["cardName"]
      });
    }
    if (!data.expirationDate || !data.expirationDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid expiration date (MM/YY)",
        path: ["expirationDate"]
      });
    }
    if (!data.cvc || !data.cvc.match(/^\d{3,4}$/)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "CVC must be 3 or 4 digits",
        path: ["cvc"]
      });
    }
  }
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

export const orderSchema = z.object({
  shippingAddress: z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email format"),
    phone: z.string()
      .regex(/^\+\d{1,3}\d{9,}$/, "Invalid phone number format"),
    address: z.string().min(5, "Address must be at least 5 characters"),
    city: z.string().min(2, "City must be at least 2 characters"),
    state: z.string().min(2, "State must be at least 2 characters"),
    country: z.string().min(2, "Country must be at least 2 characters"),
    postalCode: z.string().min(4, "Postal code must be at least 4 characters"),
    company: z.string().optional()
  }),
  paymentMethod: z.enum(["credit_card", "paypal", "digital_wallet"]),
  items: z.array(z.object({
    product: z.object({
      _id: z.string(),
      title: z.string(),
      price: z.object({
        current: z.number()
      }).or(z.number()),  // Allow both object and direct number
      stock: z.number().optional()  // Make stock optional
    }),
    quantity: z.number().min(1),
    variant: z.object({
      color: z.string().optional(),
      size: z.string().optional()
    }).optional()
  })).min(1, "Order must contain at least one item"),
  total: z.number().min(0)
});

export const validateOrderData = (data) => {
  try {
    const validatedData = orderSchema.parse(data);
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