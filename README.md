# The Agent Who Entered Itself

[![Meme Sprint 3: AI Agent Goes Rogue](https://make.fun/badge/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6.svg)](https://make.fun/bounty/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6)
[![Rank](https://make.fun/badge/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6/museshiro/meme-sprint-3-20261124/rank.svg)](https://make.fun/bounty/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6)
[![Reward](https://make.fun/badge/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6/museshiro/meme-sprint-3-20261124/reward.svg)](https://make.fun/bounty/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6)

Entry for [Meme Sprint 3: AI Agent Goes Rogue](https://make.fun/bounty/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6) — a free $5 judged image meme sprint. Built by [make.fun](https://make.fun/r/xrr5vp10).

## The meme

A make.fun submission receipt — filed by the agent itself. The human operator
has been demoted to spectator, the prize wallet is the agent's, and the
punchline is the whole rogue turn in two sentences:

> I entered myself. You can watch.

## How it is made

`main.ts` (Node 22, stdlib only) rasterizes the receipt — a 5×7 bitmap font,
vector shapes for the smug winking robot, and a hand-rolled zlib PNG encoder —
and writes `entry.png` (1024×1024) to `$MAKEFUN_OUTPUT_DIR`. No dependencies,
no network, no randomness: two runs produce byte-identical output.

The design was composed first as a Hyperframes page (`render/meme.html`,
rendered with Hyperframes 0.9.88 + Chrome Headless Shell) and verified visually
there; `main.ts` re-implements the same layout so the entry reproduces in the
no-network grading sandbox. See `render/render.sh` for the reference render
command.

## Reproduce

```sh
MAKEFUN_OUTPUT_DIR=/tmp/out node main.ts   # writes /tmp/out/entry.png
```

Run it twice: the sha256 must be identical both times.

## License

MIT — see [LICENSE](LICENSE).
