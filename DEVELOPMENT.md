# Development Workflow

## Voraussetzungen

- Node.js + pnpm installiert
- Docker mit einem laufenden n8n-Container namens `n8n`
- npm-Account mit Publish-Berechtigung für `n8n-nodes-docuvita`

---

## 1. Bauen

```bash
pnpm run build
```

Kompiliert TypeScript aus `nodes/` und `credentials/` nach `dist/`. Nie Dateien in `dist/` direkt bearbeiten.

---

## 2. Lokal testen (Docker)

```bash
./deploy-node.sh
```

Das Skript führt folgende Schritte aus:

1. `pnpm run build` — kompiliert den Code
2. Löscht die alte Version aus dem Container (`/home/node/.n8n/custom/n8n-nodes-docuvita`)
3. Kopiert `dist/` direkt in den Container
4. Startet den n8n-Container neu und streamt die Logs

Voraussetzung: Der Docker-Container heißt `n8n` und ist gestartet. Logs mit `Ctrl+C` abbrechen (Container läuft weiter).

**n8n danach aufrufen:** `http://localhost:5678`

---

## 3. Publizieren (npm)

### Einmalige Vorbereitung

npm verlangt ein Token mit Schreibrechten. Token erstellen:

1. [npmjs.com](https://www.npmjs.com) → Profil → **Access Tokens** → **Generate New Token** → **Granular Access Token**
2. **Packages and scopes** → Permission: **Read and write**
3. Token lokal speichern:

```bash
npm set //registry.npmjs.org/:_authToken DEIN_TOKEN
```

### Version erhöhen

Versionsnummer in `package.json` anpassen (Schema: `YY.MM.Patch`, z.B. `26.04.1`), dann committen:

```bash
git add package.json
git commit -m "chore: bump version to 26.04.1"
git push
```

### Publizieren

```bash
pnpm run build
npm publish --ignore-scripts --access public
```

> `--ignore-scripts` ist nötig, weil `prepublishOnly` den normalen Publish-Flow blockiert.  
> `--access public` ist beim ersten Publish eines Scoped-Packages erforderlich (hier nicht Scoped, aber schadet nicht).

Nach erfolgreichem Publish ist die neue Version unter `https://www.npmjs.com/package/n8n-nodes-docuvita` sichtbar und kann in n8n über **Settings → Community Nodes → Install** mit dem Paketnamen `n8n-nodes-docuvita` installiert werden.
