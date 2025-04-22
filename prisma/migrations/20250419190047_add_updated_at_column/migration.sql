-- 1. Primeiro adicione a coluna como nullable
ALTER TABLE "Episode" ADD COLUMN "updatedAt" TIMESTAMP(3);

-- 2. Atualize os registros existentes com a data atual
UPDATE "Episode" SET "updatedAt" = NOW();

-- 3. Altere para NOT NULL e defina o valor padrão
ALTER TABLE "Episode" ALTER COLUMN "updatedAt" SET NOT NULL;
ALTER TABLE "Episode" ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;