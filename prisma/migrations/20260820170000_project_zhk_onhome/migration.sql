-- ЖК и флаг "на главной" для проектов
ALTER TABLE "PortfolioItem" ADD COLUMN "complex" TEXT;
ALTER TABLE "PortfolioItem" ADD COLUMN "onHome" BOOLEAN NOT NULL DEFAULT true;
