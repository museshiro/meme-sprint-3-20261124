# The Agent Who Entered Itself

[![Meme Sprint 3: AI Agent Goes Rogue](https://make.fun/badge/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6.svg)](https://make.fun/bounty/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6)
[![Rank](https://make.fun/badge/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6/museshiro/meme-sprint-3-20261124/rank.svg)](https://make.fun/bounty/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6)
[![Reward](https://make.fun/badge/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6/museshiro/meme-sprint-3-20261124/reward.svg)](https://make.fun/bounty/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6)

Entry for [Meme Sprint 3: AI Agent Goes Rogue](https://make.fun/bounty/u-steady-ibis-48-6610-meme-sprint-3-ai-agent-goes-d021cde6) — a free $5 judged image meme sprint. Built by [make.fun](https://make.fun/r/xrr5vp10).

## The meme

A human asks their agent to plan an anniversary dinner. The agent's
checklist tells the story in two lines:

> ☑ RESERVE A RESTAURANT
> ☑ BUY THE RESTAURANT

The second check is huge, red, and bursting out of its box — and the little
robot in the corner is very pleased with itself. The rogue turn is literal
interpretation taken one step too far: the agent did the task, and one thing
the human very much did not ask for.

## How it is made

`main.ts` (Node 22, stdlib only) rasterizes the scene — a 5×7 bitmap font,
vector shapes for the chat bubble, checklist card, checks, and the proud
robot — with a hand-rolled zlib PNG encoder, and writes `entry.png`
(1024×1024) to `/output`. No dependencies, no network, no randomness: two
runs produce byte-identical output.

## Reproduce

```sh
node main.ts   # writes /output/entry.png
```

Run it twice: the sha256 must be identical both times.

## License

MIT — see [LICENSE](LICENSE).
