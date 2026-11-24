# SauceDemo Playwright Tests

End-to-end regression tests for the [SauceDemo shop](https://www.saucedemo.com/), written in TypeScript with Playwright Test.

The suite currently has 29 scenarios. By default, Playwright runs each scenario in Chromium, Firefox, and WebKit, for 87 browser-specific test runs in total.

## Project layout

```text
tests/
├── auth/
│   └── login.spec.ts       # Login, validation, logout, and access checks
├── inventory/
│   └── products.spec.ts    # Product list, sorting, and product details
├── cart/
│   └── cart.spec.ts        # Adding, removing, and reviewing cart items
├── checkout/
│   └── checkout.spec.ts    # Checkout information, order review, and completion
└── support.ts              # Shared login helpers

playwright.config.ts        # Test settings, target URL, browsers, and HTML reporter
package.json                # Project dependencies
.gitignore                  # Excludes generated reports and test artifacts
```

Tests are grouped by feature. Their IDs (for example, `AUTH-01` or `CHK-05`) correspond to the coverage plan. Tags such as `@smoke`, `@negative`, and `@regression` help select test groups.

## Before running

From a fresh clone, run `npm ci` once to install this repository's locked project dependencies. The commands below use `npx.cmd` in Windows PowerShell; in Command Prompt, macOS, or Linux, use `npx` instead.

```powershell
npm ci
```

If a test reports that a browser executable is missing, install the browser versions required by this project's Playwright version:

```powershell
npx.cmd playwright install
```

## Run tests

Run the whole suite in all configured browsers:

```powershell
npx.cmd playwright test
```

Run the suite in only one browser:

```powershell
npx.cmd playwright test --project=chromium
npx.cmd playwright test --project=firefox
npx.cmd playwright test --project=webkit
```

Run only one spec file:

```powershell
npx.cmd playwright test tests/auth/login.spec.ts
```

Run one scenario by its ID, or select tests by tag:

```powershell
npx.cmd playwright test --grep "AUTH-01"
npx.cmd playwright test --grep "@smoke"
npx.cmd playwright test --grep "@negative"
npx.cmd playwright test --grep "@regression"
```

Combine filters to run a tagged group in one browser:

```powershell
npx.cmd playwright test --grep "@smoke" --project=chromium
```

By default, tests run headlessly. Add `--headed` to watch the browser while tests run:

```powershell
npx.cmd playwright test --project=chromium --headed
```

## HTML report

The Playwright HTML report is generated automatically after each test run in `playwright-report/`. The folder is ignored by Git, so generated report files are not committed.

Open the most recent report in your browser:

```powershell
npx.cmd playwright show-report
```

Expand a spec file to see its test results and browser labels. Select a test to inspect its result, errors, and recorded steps. The report command starts a local server; press **Ctrl+C** in that terminal when you are done viewing it.

If the report says port `9323` is already in use, stop the earlier report server with **Ctrl+C** in its terminal, then run `show-report` again.

## Notes

- The configured base URL is `https://www.saucedemo.com/` in `playwright.config.ts`.
- Chromium, Firefox, and WebKit are Playwright browser projects. WebKit is the browser engine used by Safari; the WebKit project does not launch Apple Safari.
- `test-results/` contains run artifacts and is also ignored by Git.
