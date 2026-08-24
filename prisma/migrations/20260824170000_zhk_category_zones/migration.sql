-- Зоны комплексного ЖК-проекта (кухня, гардеробная, санузел, …)
ALTER TABLE "PortfolioItem" ADD COLUMN "zones" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[];

-- Демо ЖК-проект (комплексная работа с квартирой), идемпотентно.
-- Использует уже загруженные фото из /uploads. Заказчик правит/добавляет в админке.
INSERT INTO "PortfolioItem"
  (id, title, description, image, category, gallery, city, year, material, complex, zones, "onHome", "order", "isPublished")
VALUES (
  'sm-zhk-1',
  'Квартира под ключ',
  'Комплексный проект: кухня, гардеробная, санузел и прихожая в едином материале и стиле.',
  '/uploads/p4-1.jpg',
  'zhk',
  ARRAY['/uploads/p4-2.jpg','/uploads/p3-2.jpg','/uploads/p2-2.jpg','/uploads/cat-sanuzly.jpg'],
  'Москва', 2025, 'МДФ-эмаль, шпон',
  'Прайм Парк',
  ARRAY['Кухня','Гардеробная','Санузел','Прихожая'],
  true, 0, true
)
ON CONFLICT (id) DO NOTHING;
