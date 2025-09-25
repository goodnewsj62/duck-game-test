-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'NIKITA', 'SURVIVOR');

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "public"."Role" NOT NULL DEFAULT 'SURVIVOR',
    "timezone" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."round" (
    "id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "creator_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."round_score" (
    "id" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 0,
    "taps" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,
    "round_id" TEXT NOT NULL,

    CONSTRAINT "round_score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "account_username_key" ON "public"."account"("username");

-- CreateIndex
CREATE INDEX "start_date_end_date_idx" ON "public"."round"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "round_created_at_idx" ON "public"."round"("created_at");

-- CreateIndex
CREATE INDEX "round_id_score_idx" ON "public"."round_score"("round_id", "score");

-- CreateIndex
CREATE INDEX "round_score_user_id_idx" ON "public"."round_score"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "round_score_round_id_user_id_key" ON "public"."round_score"("round_id", "user_id");

-- AddForeignKey
ALTER TABLE "public"."round" ADD CONSTRAINT "round_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "public"."account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."round_score" ADD CONSTRAINT "round_score_round_id_fkey" FOREIGN KEY ("round_id") REFERENCES "public"."round"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."round_score" ADD CONSTRAINT "round_score_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
