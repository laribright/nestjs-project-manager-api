CREATE TYPE "public"."task_status" AS ENUM('todo', 'done');--> statement-breakpoint
CREATE TABLE "tasks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tasks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(20) NOT NULL,
	"status" "task_status" DEFAULT 'todo' NOT NULL
);
