# Series mode - one theme, many episodes

Proven on **"How Empires Were Born"**: 7 finished ~55 s episodes (Mongols, Rome, Han, Aztecs, Inca,
Macedonia, Persia) in one day, until the Vids monthly cap stopped generation.

## 1. Codex deep research → one JSON per episode

Run once for the whole series (`codex exec`, web search on, write access to an empty folder):

```
Deep-research task. Use web search to verify every fact (prefer encyclopedias, university and museum
sources). Build a YouTube stick-figure explainer series '<SERIES NAME>' in English.
1) series.md: N episodes, each '<question pattern>'. Order by hook strength.
2) STYLE LINE (identical in every clip prompt): <style line below>.
3) For EACH episode write epNN.json with: title (the question, max 8 words), hook_line (narrator speaks
   the title question plus a teaser, max 16 words), characters (1-2 recurring heroes with a fixed
   one-sentence look description, reused verbatim), scenes: exactly 8 objects {narration: one warm calm
   storyteller line, 9-14 words, no abbreviations like a.m./p.m./BC - write numbers and dates as words,
   prompt: 5-second clip prompt = character descriptions + action + setting + STYLE LINE; one simple
   action per clip, medium or close shot, no crowds of tiny people, no text, no maps with labels},
   facts: list of the facts used with a source URL each, cover_scene: one-sentence thumbnail idea with
   ONE main character, simple anatomy.
Story arc per episode: hook, humble origin, key turning point, the decisive move, a surprising detail,
expansion, why it worked, warm closing line. Validate JSON.
```

Example output: `examples/ep02_rome.json`.

## 2. The style (locked for the whole series)

Style line - ends **every** clip prompt, punctuation included:

```
hand-drawn ink cartoon, plain stickman characters with big round paper-white heads, black ink hair,
thin black line limbs, simple period clothing, warm painted backgrounds, soft cinematic light, 16:9,
no text in frame.
```

Each prompt is built as:

```
<character description, verbatim> Five-second clip, one continuous locked medium shot.
Single action: <one action>. Setting: <place>. Only <name> visible; simple anatomy with one head,
two arms, and two legs per person; no extra people, no crowds, no maps, no lettering, no subtitles,
no logos, all props unmarked. <style line>
```

- Two recurring designs per episode: the historical lead + **Ari**, a fictional guide whose description
  is identical in every episode (series mascot). Ari covers scenes outside the lead's lifetime.
- Medium / close shots only. Wide shots with tiny people come out as mush.
- Blank scrolls, plain tokens, unmarked props - the model can't write, so never ask it to.
- Known drift: close-ups of a ruler's face sometimes turn semi-realistic. Look at every clip; remake once.

## 3. Per episode

1. Generate the 8 clips one at a time (SKILL.md §3) from `scenes[].prompt`.
2. Cover: `scripts/cover_gen.sh` with `title` + `cover_scene` + 1–2 hero frames as refs. Look at the
   anatomy yourself, don't trust the score.
3. Voiceover: 9 lines - `hook_line` on the cover, then the 8 narrations. Write them to `voice.txt`.
4. Assemble (SKILL.md §5–7): volumes 0, cover first, dissolves 0.3 s, speeds from `vdur().spd`, `vgap()` check.
5. Export to Drive → download → `check_audio.sh v.mp4 9` + frame sheet → deliver.

## 4. Throughput

- ≈ 8–9 generations per episode (one remake on average), ≈ 25 min of clip generation, ≈ 15 min assembly.
- Clips can be generated in one Vids project per episode in parallel tabs, but **generate one at a time**.
- A helper agent can prepare covers and `voice.txt` for upcoming episodes while clips render.
- Budget: ≈ 100 clips / month ≈ **11 episodes / month** per Google account.
