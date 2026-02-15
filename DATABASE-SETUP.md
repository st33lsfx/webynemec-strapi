# Nastavení databáze – prázdná databáze

## 1. Railway – PostgreSQL (POVINNÉ)

**Bez PostgreSQL se data mažou při každém restartu** (Strapi by používal SQLite).

1. V Railway projektu: **+ New** → **Database** → **PostgreSQL**
2. Klikni na PostgreSQL službu → **Connect** → vyber Strapi službu (nebo **Variables** → zkopíruj `DATABASE_URL`)
3. Ve Strapi službě: **Variables** → přidej/zkontroluj:
   - `DATABASE_CLIENT` = `postgres`
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (nebo skutečná URL – název služby může být jiný)
4. **Redeploy** Strapi služby
5. V logách ověř, že není chyba připojení k databázi

## 2. První spuštění

Při prvním startu Strapi s PostgreSQL:
- Vytvoří se tabulky
- Pokud nemáš admin účet, otevři `https://TVA-URL/admin` a zaregistruj se

## 3. Přidání obsahu

Databáze je zpočátku prázdná. Obsah přidáš v Strapi Admin:

- **Content Manager** → Blog Post, Projekt, Plugin, Ceník, Domovská stránka, Globální, Patička
- Vytvoř záznamy a **publikuj** (u collection types s draft/publish)

## 4. Oprávnění pro formulář

Aby se ukládaly poptávky z kontaktního formuláře:

1. **Settings** → **Users & Permissions** → **Roles** → **Public**
2. Rozbal **Application** → **Kontaktní formulář (Contact)**
3. Zaškrtni **create**
4. **Save**

## 5. Kontrola připojení

V Railway logách by neměly být chyby typu:
- `Cannot connect to database`
- `sqlite` (pokud používáš PostgreSQL)

Pokud vidíš `sqlite`, zkontroluj, že máš `DATABASE_CLIENT=postgres` a `DATABASE_URL`.
