import { z } from "zod";

const phoneRegex = /^[\d\s()+-]{7,20}$/;

// Регистрация клиента.
export const registerSchema = z.object({
  name: z.string().min(2, "Укажите имя").max(80),
  email: z.string().email("Некорректный email"),
  phone: z.string().regex(phoneRegex, "Некорректный телефон").optional().or(z.literal("")),
  password: z.string().min(6, "Минимум 6 символов").max(100),
});
export type RegisterInput = z.infer<typeof registerSchema>;

// Управление пользователями из админки.
const roleEnum = z.enum(["OWNER", "ADMIN", "MANAGER", "CLIENT"]);

export const createUserSchema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  phone: z.string().regex(phoneRegex).optional().or(z.literal("")),
  password: z.string().min(6).max(100),
  role: roleEnum,
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string().min(2).max(80).optional(),
  role: roleEnum.optional(),
  phone: z.string().regex(phoneRegex).optional().or(z.literal("")),
  password: z.string().min(6).max(100).optional().or(z.literal("")),
});
export type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const leadSchema = z.object({
  name: z.string().min(2, "Укажите имя").max(80),
  phone: z.string().regex(phoneRegex, "Укажите корректный телефон"),
  message: z.string().max(1000).optional(),
  source: z.enum(["callback_form", "ai_chat", "checkout"]).optional(),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(4000),
      })
    )
    .min(1)
    .max(30),
});
export type ChatInput = z.infer<typeof chatSchema>;

export const productSchema = z.object({
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Только латиница, цифры и дефис"),
  title: z.string().min(2),
  description: z.string().min(2),
  price: z.number().int().positive().nullable().optional(),
  priceFrom: z.boolean().optional(),
  style: z.string().optional().nullable(),
  material: z.string().optional().nullable(),
  categoryId: z.string().min(1),
  isPromo: z.boolean().optional(),
  isPublished: z.boolean().optional(),
  images: z.array(z.object({ url: z.string().min(1), alt: z.string().optional() })).optional(),
});
export type ProductInput = z.infer<typeof productSchema>;

export const createPaymentSchema = z.object({
  kind: z.enum(["deposit", "full", "ai_service", "virtualization"]),
  customerName: z.string().min(2),
  phone: z.string().regex(phoneRegex),
  email: z.string().email().optional(),
  amountRub: z.number().positive().max(5_000_000),
  items: z
    .array(
      z.object({
        productId: z.string().optional(),
        title: z.string().min(1),
        qty: z.number().int().positive().default(1),
        price: z.number().int().nonnegative(),
      })
    )
    .optional(),
});
export type CreatePaymentBody = z.infer<typeof createPaymentSchema>;
