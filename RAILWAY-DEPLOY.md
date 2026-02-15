# Nasazení Strapi na Railway (Docker Image)

Build Strapi admin panelu potřebuje ~2 GB RAM. Railway s 1 GB nestačí. Řešení: **build v GitHub Actions** (7 GB RAM) a nasazení předpřipraveného Docker image.

## 1. Nastavení Railway

1. V Railway projektu **smaž** nebo **uprav** stávající službu.
2. **+ New** → **Docker Image**
3. Image URL: `ghcr.io/st33lsfx/webynemec-strapi:latest`
4. Nastav proměnné prostředí (Variables) – stejné jako dříve (DATABASE_URL, APP_KEYS, atd.)
5. **Settings** → **Networking** → vygeneruj doménu

## 2. GitHub Secrets

V repozitáři **Settings** → **Secrets and variables** → **Actions** přidej:

| Secret | Popis |
|--------|-------|
| `RAILWAY_TOKEN` | Project token z Railway (Settings → Tokens) |
| `RAILWAY_SERVICE_NAME` | Název služby v Railway (např. `reliable-forgiveness`) |

## 3. Průběh deploye

1. Push do `main` spustí GitHub Actions
2. Workflow zbuildí Docker image (s 7 GB RAM)
3. Image se pushne do `ghcr.io/st33lsfx/webynemec-strapi:latest`
4. `railway redeploy` stáhne nový image a restartuje službu

## 4. Lokální test buildu

```bash
docker build -t webynemec-strapi:test .
docker run -p 1337:1337 --env-file .env webynemec-strapi:test
```
