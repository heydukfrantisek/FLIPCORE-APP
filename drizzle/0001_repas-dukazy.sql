ALTER TABLE `test_evidence` ADD `typ_testu` text DEFAULT 'profil' NOT NULL;--> statement-breakpoint
ALTER TABLE `test_evidence` ADD `nalezena_vada` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX `test_evidence_kus_idx` ON `test_evidence` (`kus_id`);--> statement-breakpoint
ALTER TABLE `repair_ticket` ADD `nahradni_dil` integer DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX `repair_ticket_kus_idx` ON `repair_ticket` (`kus_id`);