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

A [Jekyll](https://jekyllrb.com/) site using the
[Just the Docs](https://just-the-docs.com/) theme (via `remote_theme`), deployed
to GitHub Pages by the workflow in `.github/workflows/pages.yml`.

### Run locally

```bash
bundle install
bundle exec jekyll serve
# open http://localhost:4000/block-dodge-parry-srd/
```

Content pages live as Markdown at the repository root; navigation order and
hierarchy are controlled by each page's front matter (`nav_order`, `parent`,
`has_children`).
