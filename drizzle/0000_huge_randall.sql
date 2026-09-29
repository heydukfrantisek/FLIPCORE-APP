CREATE TABLE `test_evidence` (
	`id` text PRIMARY KEY NOT NULL,
	`kus_id` text NOT NULL,
	`nazev_testu` text NOT NULL,
	`vysledek` text NOT NULL,
	`provedeno_kdy` text NOT NULL,
	FOREIGN KEY (`kus_id`) REFERENCES `kus`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `component` (
	`id` text PRIMARY KEY NOT NULL,
	`kategorie` text NOT NULL,
	`vyrobce` text NOT NULL,
	`model` text NOT NULL,
	`specifikace` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `kus` (
	`id` text PRIMARY KEY NOT NULL,
	`component_id` text NOT NULL,
	`seller_id` text NOT NULL,
	`stav` text NOT NULL,
	`nakupni_cena` integer NOT NULL,
	`prodejni_cena` integer,
	`datum_vykupu` text NOT NULL,
	`vytvoreno_kdy` text NOT NULL,
	FOREIGN KEY (`component_id`) REFERENCES `component`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`seller_id`) REFERENCES `seller`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `kus_stav_idx` ON `kus` (`stav`);--> statement-breakpoint
CREATE INDEX `kus_component_idx` ON `kus` (`component_id`);--> statement-breakpoint
CREATE INDEX `kus_seller_idx` ON `kus` (`seller_id`);--> statement-breakpoint
CREATE TABLE `nastaveni` (
	`id` text PRIMARY KEY NOT NULL,
	`nazev_obchodu` text NOT NULL,
	`mena` text NOT NULL,
	`rozpocty_kategorii` text NOT NULL,
	`dph_procenta` integer NOT NULL,
	`skladova_rezerva` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `build_item` (
	`id` text PRIMARY KEY NOT NULL,
	`build_id` text NOT NULL,
	`pozice` text NOT NULL,
	`nazev` text NOT NULL,
	`kus_id` text,
	`cena_snapshot` integer NOT NULL,
	FOREIGN KEY (`build_id`) REFERENCES `build`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`kus_id`) REFERENCES `kus`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `build_item_build_idx` ON `build_item` (`build_id`);--> statement-breakpoint
CREATE TABLE `seller` (
	`id` text PRIMARY KEY NOT NULL,
	`nazev` text NOT NULL,
	`typ` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `build` (
	`id` text PRIMARY KEY NOT NULL,
	`nazev` text NOT NULL,
	`kategorie` text NOT NULL,
	`popis` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `condition_grade` (
	`id` text PRIMARY KEY NOT NULL,
	`kus_id` text NOT NULL,
	`stupen` text NOT NULL,
	`popis` text NOT NULL,
	`zhodnoceno_kdy` text NOT NULL,
	FOREIGN KEY (`kus_id`) REFERENCES `kus`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `condition_grade_kus_idx` ON `condition_grade` (`kus_id`);--> statement-breakpoint
CREATE TABLE `transakce` (
	`id` text PRIMARY KEY NOT NULL,
	`typ` text NOT NULL,
	`kategorie` text NOT NULL,
	`popis` text NOT NULL,
	`castka` integer NOT NULL,
	`datum` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `repair_ticket` (
	`id` text PRIMARY KEY NOT NULL,
	`kus_id` text NOT NULL,
	`typ_zasahu` text NOT NULL,
	`popis` text NOT NULL,
	`naklady` integer NOT NULL,
	`provedeno_kdy` text NOT NULL,
	FOREIGN KEY (`kus_id`) REFERENCES `kus`(`id`) ON UPDATE no action ON DELETE no action
);
