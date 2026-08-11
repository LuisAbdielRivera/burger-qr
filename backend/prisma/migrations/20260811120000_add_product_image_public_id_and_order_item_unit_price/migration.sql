ALTER TABLE "Product"
ADD COLUMN "imagePublicId" TEXT;

ALTER TABLE "OrderItem"
ADD COLUMN "unitPrice" DECIMAL(10,2) NOT NULL DEFAULT 0;

UPDATE "OrderItem" AS oi
SET "unitPrice" = p."price"
FROM "Product" AS p
WHERE oi."productId" = p."id";

ALTER TABLE "OrderItem"
ALTER COLUMN "unitPrice" DROP DEFAULT;
