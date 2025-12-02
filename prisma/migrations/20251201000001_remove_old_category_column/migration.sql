-- Drop the old category column
ALTER TABLE "Product" DROP COLUMN IF EXISTS "category";

-- Make categoryId NOT NULL (assuming all products have categoryId set)
-- If you have existing products without categoryId, you need to update them first
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET NOT NULL;
