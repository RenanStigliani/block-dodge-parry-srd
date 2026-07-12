# Report-issue Worker

Small Cloudflare Worker used by the "report text" widget on the main site
(`../src/components/ReportIssueButton.astro`). It receives a title/body/Turnstile
token, verifies the reader passed the CAPTCHA, and files a GitHub issue on
`renanstigliani/block-dodge-parry-srd` using a token that never reaches the browser.

## One-time setup

1. **GitHub token** — create a [fine-grained personal access token](https://github.com/settings/personal-access-tokens/new):
   - Repository access: **only** `renanstigliani/block-dodge-parry-srd`
   - Permissions: **Issues → Read and write**, nothing else
   - Set an expiration date and put a reminder to rotate it

2. **Turnstile widget** — in the [Cloudflare Turnstile dashboard](https://dash.cloudflare.com/?to=/:account/turnstile),
   create a widget for `renanstigliani.github.io`. Note the **site key** (public)
   and **secret key** (private).

3. **Install Wrangler & log in**:
   ```sh
   cd worker
   npm install
   npx wrangler login
   ```

4. **Set secrets** (never stored in this repo):
   ```sh
   npx wrangler secret put GITHUB_TOKEN
   npx wrangler secret put TURNSTILE_SECRET_KEY
   ```

5. **Deploy**:
   ```sh
   npm run deploy
   ```
   Wrangler prints the Worker's URL, e.g. `https://block-dodge-parry-report-widget.<subdomain>.workers.dev`.

6. **Wire it into the site** — in the main repo's GitHub settings
   (Settings → Secrets and variables → Actions → Variables), add:
   - `PUBLIC_WORKER_URL` = the Worker URL from step 5
   - `PUBLIC_TURNSTILE_SITE_KEY` = the site key from step 2

   For local development, copy `../.env.example` to `../.env` and fill in the same values.

## Optional: rate limiting via KV

The Worker already rate-limits by IP if a `RATE_LIMIT_KV` binding is present
(3 requests / 10 minutes per IP). To enable it:
```sh
npx wrangler kv namespace create RATE_LIMIT_KV
```
then uncomment and fill in the `[[kv_namespaces]]` block in `wrangler.toml` with
the printed namespace id, and redeploy.

## Notes

- Issues are created with the `reader-feedback` label (see `ISSUE_LABEL` in
  `wrangler.toml`) so they're easy to filter/triage separately from other issues.
  Create this label in the repo once (Settings → Labels) before deploying —
  GitHub may not auto-create labels that don't already exist.
- The Worker only ever has permission to create issues on this one repo — even
  if the token were somehow leaked, it can't touch code, other repos, or account settings.
