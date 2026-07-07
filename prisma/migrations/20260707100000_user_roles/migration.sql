-- Роли и телефон для аккаунтов.
ALTER TABLE "AdminUser" ADD COLUMN "role" TEXT NOT NULL DEFAULT 'ADMIN';
ALTER TABLE "AdminUser" ADD COLUMN "phone" TEXT;
