import { z } from "zod";
import { registrationEmailError } from "@/lib/email-policy";

const phoneRegex = /^[\d\s()+-]{7,20}$/;

// Регистрация клиента. Помимо формата email проверяем политику доменов
// (иностранные бесплатные почтовые сервисы к регистрации не допускаются).
export const registerSchema = z
  .object({
    name: z.string().min(2, "Укажите имя").max(80),
    email: z.string().email("Некорректный email"),
    phone: z.string().regex(phoneRegex, "Некорректный телефон").optional().or(z.literal("")),
    password: z.string().min(6, "Минимум 6 символов").max(100),
  })
  .superRefine((data, ctx) => {
    const err = registrationEmailError(data.email);
    if (err) ctx.addIssue({ code: z.ZodIssueCode.custom, message: err, path: ["email"] });
  });
export type RegisterInput = z.infer<typeof registerSchema>;

// Отзыв, оставленный на сайте (публикуется после модерации).
export const reviewSchema = z.object({
  author: z.string().min(2, "Укажите имя").max(80),
  city: z.string().max(80).optional().or(z.literal("")),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(10, "Слишком короткий отзыв").max(2000),
});
export type ReviewInput = z.infer<typeof reviewSchema>;

// Портфолио — создание/редактирование из админки.
export const portfolioSchema = z.object({
  title: z.string().min(2).max(120),
  description: z.string().max(600).optional().or(z.literal("")),
  image: z.string().min(4, "Укажите ссылку на фото"),
  category: z.enum(["kuhni", "shkafy", "garderobnye", "sanuzly"]),
  city: z.string().max(80).optional().or(z.literal("")),
  year: z.number().int().min(2000).max(2100).nullable().optional(),
  material: z.string().max(120).optional().or(z.literal("")),
  complex: z.string().max(120).optional().or(z.literal("")),
  onHome: z.boolean().optional(),
  gallery: z.array(z.string()).optional(),
  order: z.number().int().optional(),
  isPublished: z.boolean().optional(),
});
export type PortfolioInput = z.infer<typeof portfolioSchema>;

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
