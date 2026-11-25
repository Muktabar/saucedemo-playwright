# SauceDemo-Tests mit Playwright

Dieses Projekt enthält End-to-End-Regressionstests für den [SauceDemo-Shop](https://www.saucedemo.com/). Die Tests sind mit TypeScript und Playwright Test geschrieben.

Die Testsuite umfasst derzeit 30 Szenarien. Standardmäßig führt Playwright jedes Szenario in Chromium, Firefox und WebKit aus. Dadurch entstehen insgesamt 90 browserbezogene Testläufe.

Der zugehörige [Testabdeckungsplan (Excel)](docs/Testabdeckungsplan.xlsx) liegt im Verzeichnis `docs`. Er beschreibt alle 30 Szenarien einschließlich Priorität, Testdaten, Ablauf und erwartetem Ergebnis.

## Projektstruktur

```text
tests/
├── auth/
│   └── login.spec.ts       # Anmeldung, Validierung, Abmeldung und Zugriffskontrolle
├── inventory/
│   └── products.spec.ts    # Produktkarten, Sortierung und Produktdetails
├── cart/
│   └── cart.spec.ts        # Produkte zum Warenkorb hinzufügen, daraus entfernen und prüfen
├── checkout/
│   └── checkout.spec.ts    # Checkout-Angaben, Bestellübersicht und Bestellabschluss
└── support.ts              # Gemeinsam verwendete Hilfsfunktionen für die Anmeldung

playwright.config.ts        # Testeinstellungen, Ziel-URL, Browser und HTML-Bericht
package.json                # Abhängigkeiten des Projekts
.gitignore                  # Schließt generierte Berichte und Testdateien aus Git aus
```

Die Testsuite und der Testabdeckungsplan verwenden die englischen Bereichsnamen `Authentication`, `Inventory`, `Cart` und `Checkout`, damit sie sich leicht den Testordnern zuordnen lassen. Die Beschreibungen sind auf Deutsch; Test-IDs wie `AUTH-01` und Tags wie `@smoke`, `@negative` oder `@regression` bleiben unverändert.

## Vor der Ausführung

Nach einem frischen Klon des Repositorys installieren Sie die festgelegten Projektabhängigkeiten einmal mit `npm ci`. Die folgenden Befehle verwenden `npx.cmd` in Windows PowerShell. In der Eingabeaufforderung, unter macOS oder unter Linux verwenden Sie stattdessen `npx`.

```powershell
npm ci
```

Falls Playwright meldet, dass ein benötigter Browser fehlt, installieren Sie die passenden Browser-Versionen für die Playwright-Version dieses Projekts:

```powershell
npx.cmd playwright install
```

## Tests ausführen

Führen Sie die gesamte Testsuite in allen konfigurierten Browsern aus:

```powershell
npx.cmd playwright test
```

Führen Sie die Tests nur in einem Browser aus:

```powershell
npx.cmd playwright test --project=chromium
npx.cmd playwright test --project=firefox
npx.cmd playwright test --project=webkit
```

Führen Sie nur eine bestimmte Testdatei aus:

```powershell
npx.cmd playwright test tests/auth/login.spec.ts
```

Wählen Sie ein Szenario anhand seiner ID oder Tests anhand eines Tags aus:

```powershell
npx.cmd playwright test --grep "AUTH-01"
npx.cmd playwright test --grep "@smoke"
npx.cmd playwright test --grep "@negative"
npx.cmd playwright test --grep "@regression"
```

Sie können Filter kombinieren, um beispielsweise alle Smoke-Tests nur in Chromium auszuführen:

```powershell
npx.cmd playwright test --grep "@smoke" --project=chromium
```

Standardmäßig laufen die Tests ohne sichtbares Browserfenster. Mit `--headed` können Sie die Browseraktionen während des Testlaufs beobachten:

```powershell
npx.cmd playwright test --project=chromium --headed
```

## HTML-Bericht

Playwright erstellt nach jedem Testlauf automatisch einen HTML-Bericht im Ordner `playwright-report/`. Dieser Ordner ist in `.gitignore` eingetragen, damit generierte Berichte nicht ins Repository aufgenommen werden.

Öffnen Sie den Bericht des letzten Testlaufs im Browser:

```powershell
npx.cmd playwright show-report
```

Klappen Sie eine Testdatei auf, um die Ergebnisse und Browsernamen zu sehen. Wenn Sie einen Test auswählen, können Sie das Ergebnis, mögliche Fehler und die aufgezeichneten Schritte prüfen. Der Befehl startet dafür einen lokalen Webserver. Beenden Sie ihn mit **Strg+C**, wenn Sie den Bericht nicht mehr ansehen.

Falls der Bericht meldet, dass Port `9323` bereits verwendet wird, beenden Sie den vorherigen Berichtsserver mit **Strg+C** in seinem Terminal und führen Sie `show-report` erneut aus.

## Hinweise

- Die Zieladresse ist in `playwright.config.ts` als `https://www.saucedemo.com/` festgelegt.
- Chromium, Firefox und WebKit sind Playwright-Browserprojekte. WebKit ist die Browser-Engine, die auch Safari verwendet. Das WebKit-Projekt startet jedoch nicht Apple Safari.
- Der Ordner `test-results/` enthält Dateien aus den Testläufen und ist ebenfalls von Git ausgeschlossen.
