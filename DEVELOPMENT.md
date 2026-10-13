# Development Workflow

## Voraussetzungen

- Node.js + pnpm installiert
- Docker mit einem laufenden n8n-Container namens `n8n`
- npm-Account mit Publish-Berechtigung für `n8n-nodes-docuvita` und aktivierter Zwei-Faktor-Authentifizierung (siehe Abschnitt 3)

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

### Einmalige Vorbereitung: 2FA am npm-Konto

npm verlangt für jeden Publish ein Konto mit aktivierter Zwei-Faktor-Authentifizierung. Ohne 2FA antwortet die Registry mit `403 Forbidden - Two-factor authentication … is required to publish packages`, und zwar **ohne** vorher nach einem Code zu fragen. Access Tokens helfen dabei nicht: Granular Access Tokens ohne „Bypass 2FA" dürfen nicht publizieren, und die Bypass-Option lässt sich nicht mehr aktivieren.

1. [npmjs.com](https://www.npmjs.com) → Account → **Two-Factor Authentication** → Modus **Authorization and Publishing**
2. Authenticator-App (QR-Code scannen) oder Sicherheitsschlüssel einrichten, Wiederherstellungscodes sicher ablegen
3. Prüfen:

```bash
npm profile get   # Zeile "two-factor auth" muss "auth-and-writes" zeigen
```

### Anmelden

Der Publish läuft über eine Login-Sitzung, nicht über ein Token:

```bash
npm login    # öffnet den Browser, Anmeldung mit 2FA
npm whoami   # muss den npm-Benutzernamen zeigen
```

Die Sitzung wird in `~/.npmrc` gespeichert. Meldet `npm whoami` irgendwann `401 Unauthorized`, einfach erneut `npm login`.

### Version erhöhen

Schema `YY.MM.Patch`, z.B. `26.10.1`. Die Nummer muss gültiges semver sein, also **keine führenden Nullen**: `26.02.13` war ungültig und wurde von npm zu `26.2.13` normalisiert.

Anzupassen:

- `version` in `package.json`
- `nodeVersion` und `codexVersion` in `nodes/Docuvita/Docuvita.node.json`
- neuer Eintrag in `CHANGELOG.md`

Dann committen:

```bash
git add package.json nodes/Docuvita/Docuvita.node.json CHANGELOG.md
git commit -m "Release 26.10.1"
git push
```

### Bauen und Paketinhalt prüfen

```bash
pnpm run build
npm pack --dry-run
```

Die Liste darf nur `LICENSE.md`, `README.md`, `package.json` und `dist/…` enthalten (derzeit 33 Dateien). Der Build kopiert **alle** `*.svg`- und `*.png`-Dateien aus dem Projektverzeichnis nach `dist/`, nur `dist/` und `node_modules/` sind ausgenommen. Fremde Ordner mit Grafiken im Projekt (z.B. ein altes `compiled_node/`) landen sonst mit im Paket.

### Publizieren

```bash
npm publish --ignore-scripts --access public
```

npm fragt den 2FA-Code aus der Authenticator-App ab. Alternativ den Code direkt mitgeben: `--otp=CODE`.

> `--ignore-scripts` ist nötig, weil `prepublishOnly` (`n8n-node prerelease`) den normalen Publish-Flow blockiert.  
> `--access public` ist beim ersten Publish eines Scoped-Packages erforderlich (hier nicht Scoped, aber schadet nicht).  
> `pnpm run release` (release-it) **nicht** verwenden: es macht Commit, Tag, Push und GitHub-Release in einem Schritt und erwartet gültiges semver.

Kontrolle:

```bash
npm view n8n-nodes-docuvita version
```

Nach erfolgreichem Publish ist die neue Version unter `https://www.npmjs.com/package/n8n-nodes-docuvita` sichtbar und kann in n8n über **Settings → Community Nodes → Install** mit dem Paketnamen `n8n-nodes-docuvita` installiert werden.
