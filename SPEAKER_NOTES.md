# Speaker notes — Pokedex Pull-Stack (28 min + 10 Q&A)

One-screen cheat sheet. Keep open in a side tab during the talk.

## Pre-talk (Act 0)

- `bootstrap.sh` already run; new bootstrapped repo exists in your account.
- Mergify GitHub App installed and scoped to it.
- "Automatically delete head branches" verified ON in repo Settings → General. (Bootstrap sets this, but verify.)
- Pre-recorded Claude clip queued in a hidden browser tab.
- `demo-final` branch pushed.
- Three browser tabs ready: repo home / Actions / Mergify dashboard.
- Terminal at repo root, font size cranked.

## Act timings

| Act | Time | Cue |
|-----|------|-----|
| 1 — Frame the problem | **3 min** | repo home + open `.mergify.yml` and `ci.yml` |
| 2 — Claude makes the stack | **8 min** | paste Appendix A prompt; watch 3 PRs appear with `Depends-On:` and stack-map comments |
| 3 — The queue takes over | **13 min** | `@mergifyio queue` on top PR; narrate PR1 retry → PR2 fix-and-restack → PR3 lands |
| 4 — Close | **5 min** | recap + "also available" one-liners + README pointer + Q&A |

## Act 3 beat-by-beat

1. **PR1 flake (~3 min)** — flaky test fails first run. `max_checks_retries: 1` retries automatically. ONE dashboard flip to show the retry. If the flake rolls safe on first run, mention "this would normally fire ~30% of runs" and move on. (You can also force a re-roll later if you want the retry beat: `gh run rerun --failed <run-id>`.)
2. **PR2 lint fail (~5 min)** — this is the showstopper.
   - **Before fixing**, post a review comment on `apps/api/src/routes/list.ts` line 1: *"unused import — remove."*
   - In editor: open `list.ts`, remove `type FavoriteRecord` from the import.
   - Terminal: `git commit -a --amend --no-edit && mergify stack push`.
   - Switch back to GitHub PR2: **the review comment is still anchored to the new SHA on line 1.** Pause here, say it out loud.
   - Re-queue: `@mergifyio queue` on top PR.
3. **PR3 lands (~3 min)** — narrate one of two paths:
   - **(a) Clean rebase:** "Claude propagated `ownerId` through `page.tsx` on the way up; the stack design pays off."
   - **(b) Typecheck fails:** "git couldn't see it, the rebase did" — fix `ownerId?: string` optional, amend, push, re-queue.
   - Either way end with `mergify stack list` → empty.

## Bot commands (memorize)

- `@mergifyio queue` — enqueue stack from top PR. **Headline command.**
- `@mergifyio refresh` — nudge a stuck queue. **Free on all tiers.**
- `@mergifyio update` — **PAID FEATURE.** Don't use it on free tier; rejected with "Workflow Automation needs to be activated."

## Recovery hotkeys (in priority order)

| Symptom | First try | If still stuck |
|---------|-----------|----------------|
| Claude refuses or stalls > 30s in Act 2 | hotkey to pre-recorded clip; narrate over it | resume Act 3 live from `demo-final` |
| Mergify queue hangs after PR enters | `@mergifyio refresh` on the stuck PR | switch to `demo-final` |
| PRs not recognised as stack | Claude pushed via `git push` instead of `mergify stack push` — run `mergify stack push` yourself | switch to `demo-final` |
| Top PR stalls at "🔜 Merge" after upstream merge | check repo's "Automatically delete head branches" is ON; if not, fix and rerun. Otherwise: `gh pr edit <N> --base main` → local rebase → `git push --force --no-verify` | switch to `demo-final` |
| PR2 lint won't re-run after restack | `gh run rerun --failed <run-id>` | empty commit + push to retrigger |
| CI provider down / wifi dies | switch to `demo-final` immediately | no live demo path |

## `mergify stack push` recovery dance

`mergify stack push` only works from the **original** feature branch (e.g. `feat/pokedex-v2`), not from the generated `stack/...` branches. If after a `git rebase --autosquash` you end up on a stack branch:

```bash
git checkout feat/pokedex-v2        # your original branch
git reset --hard <amended-SHA>      # the HEAD from the rebase
mergify stack push                   # now it works
```

## Terminal commands worth typing live

```bash
mergify queue status   # show what's queued
mergify stack list     # show open stack PRs
```

Both fit the terminal-first presentation. Type them out loud during Act 3 transitions.

## What NOT to do on stage

- Don't open the Mergify dashboard more than once. (`max_checks_retries` visual retry only.)
- Don't type `@mergifyio update` — rejected on free tier, looks broken.
- Don't `git push --force` from a `stack/` branch without `--no-verify` — Mergify's pre-push hook blocks it.
- Don't try to "fix" the planted unused import in PR2 from PR3 — Claude already kept it unused per the prompt; just `mergify stack push` the existing fix-in-place from the previous PR.
