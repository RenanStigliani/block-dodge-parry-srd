# Block, Dodge, Parry — SRD (community mirror)

An unofficial, community-hosted mirror of the **Block, Dodge, Parry** System
Reference Document (SRD), a levelless, classless expansion of Cairn.

- **Author of the content:** [Lars Huijbregts / Dice Goblin Games](https://dicegoblin.blog/)
- **Official site:** <https://blockdodgeparry.com/>
- **Buy it / support the author:** [Itch.io](https://dicegoblingames.itch.io/block-dodge-parry) · [DriveThruRPG](https://www.drivethrurpg.com/en/product/425888/block-dodge-parry-a-levelless-classless-expansion-of-cairn) · [In print](https://dicegoblin.blog/block-dodge-parry-in-print/)

## License

The game text is licensed under
[**CC-BY-SA 4.0**](https://creativecommons.org/licenses/by-sa/4.0/). You are free
to copy, redistribute, remix, transform, and build upon it — including
commercially — as long as you credit **Lars Huijbregts / Dice Goblin Games** and
distribute your contributions under the same license. See [`LICENSE`](LICENSE).

This repository is a fan mirror and is **not** affiliated with or endorsed by the
author. If you enjoy the game, please support the official releases linked above.

## How it's built

An [Astro](https://astro.build/) site using
[@astrojs/starlight](https://starlight.astro.build/), deployed to GitHub Pages by
the workflow in `.github/workflows/deploy.yml`.

Deployments are triggered on pushes to the `astro` branch.

Live URL: <https://renanstigliani.github.io/block-dodge-parry-srd/>

### Run locally

```bash
npm ci
npm run dev
# open http://localhost:4321/block-dodge-parry-srd/
```

Content pages live as Markdown in `src/content/docs/`; sidebar navigation is
configured in `astro.config.mjs`.
