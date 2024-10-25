import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigrations1729240778194 implements MigrationInterface {
    name = 'InitialMigrations1729240778194'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('male', 'female')`);
        await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('pending', 'verified', 'rejected')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying NOT NULL, "email" character varying, "phone_number" character varying, "role_wallet" jsonb NOT NULL DEFAULT '{"add":null,"manage":null,"disable":null}', "role_member" jsonb NOT NULL DEFAULT '{"add":null,"manage":null,"disable":null}', "gender" "public"."users_gender_enum", "date_of_birth" date, "password" character varying, "nik" character varying, "photo_profile" character varying, "emergency_phone_number" character varying, "status" "public"."users_status_enum" NOT NULL DEFAULT 'pending', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "user_email_unique_index" ON "users" ("email") WHERE deleted_at IS NULL`);
        await queryRunner.query(`CREATE TYPE "public"."user_tokens_reason_enum" AS ENUM('forgot_password', 'change_password')`);
        await queryRunner.query(`CREATE TABLE "user_tokens" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" bigint, "token" character varying NOT NULL, "expired_at" TIMESTAMP NOT NULL, "reason" "public"."user_tokens_reason_enum" NOT NULL, CONSTRAINT "PK_63764db9d9aaa4af33e07b2f4bf" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "device_tokens" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" bigint NOT NULL, "token" character varying NOT NULL, CONSTRAINT "PK_84700be257607cfb1f9dc2e52c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_tokens" ADD CONSTRAINT "FK_9e144a67be49e5bba91195ef5de" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "device_tokens" ADD CONSTRAINT "FK_17e1f528b993c6d55def4cf5bea" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`CREATE TABLE "query-result-cache" ("id" SERIAL NOT NULL, "identifier" character varying, "time" bigint NOT NULL, "duration" integer NOT NULL, "query" text NOT NULL, "result" text NOT NULL, CONSTRAINT "PK_6a98f758d8bfd010e7e10ffd3d3" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "query-result-cache"`);
        await queryRunner.query(`ALTER TABLE "device_tokens" DROP CONSTRAINT "FK_17e1f528b993c6d55def4cf5bea"`);
        await queryRunner.query(`ALTER TABLE "user_tokens" DROP CONSTRAINT "FK_9e144a67be49e5bba91195ef5de"`);
        await queryRunner.query(`DROP TABLE "device_tokens"`);
        await queryRunner.query(`DROP TABLE "user_tokens"`);
        await queryRunner.query(`DROP TYPE "public"."user_tokens_reason_enum"`);
        await queryRunner.query(`DROP INDEX "public"."user_email_unique_index"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
    }

}
