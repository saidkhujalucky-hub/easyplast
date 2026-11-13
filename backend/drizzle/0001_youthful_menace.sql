CREATE TABLE `login_challenges` (
	`hash` text PRIMARY KEY NOT NULL,
	`origin` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `login_challenges_expiration` ON `login_challenges` (`expires_at`);