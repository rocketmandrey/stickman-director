---
name: stickman-director
description: Make a complete ~50 s stick-figure explainer video on any "why/how" question in Google Vids, end to end, by driving the browser - 8-scene story with a hook, locked character sheet, AI clips one at a time, Codex-generated title card with a spoken title, Knox voiceover with overlap-free joins, muted clips, dissolves, MP4 export and an audio check. Use when asked for a stickman / stick-figure explainer, "Stickman Director", or a Google Vids AI video on a topic.
---

# Stickman Director

One topic in, one finished MP4 out. You work alone: no questions to the user between steps.

**Needs:** Chrome with the user signed in to Google (Workspace or Google AI Pro, Vids enabled),
a browser-automation tool (e.g. Claude in Chrome), `codex` CLI with image generation (for the title card), `ffmpeg`.

**Hard rule:** never type passwords. Sign-in, payment, error or "unusual activity" message → stop and tell the user; don't work around it.

## 1. Story (show it, then go on without waiting)

8 scenes, one short narration line each, warm storyteller tone (≈ 9–13 words, fits 5 s).

- Scene 1 = the most surprising moment of the story as a **hook**, before the question.
- Then: a small character with a problem → something goes wrong → a surprising answer.
- Last line lands the real fact.

## 2. Character sheet + style line

Write once, paste **unchanged** into every clip prompt:

```
A simple hand-drawn stick figure <boy/girl/man> with a perfectly round white head, two small black dot eyes,
simple expressive eyebrows, messy black hair, thin black line body, wearing <one signature outfit>.
Place: <scene place>. Action: <one clear action>.
Simple hand-drawn stick figure cartoon, thin black outlines, flat soft colours, detailed hand-drawn background,
warm documentary illustration style, 16:9. No text, no words, no letters.
The boy's head is pure paper-white, not skin coloured.
```

The last sentence matters: without it the model often paints the head skin-coloured.

## 3. Clips in Google Vids

Open `https://docs.google.com/videos/create` → new blank video → **AI video** panel.

- Model **Omni**, 720p, Landscape. Duration slider defaults to 10 s → set **5 s** (click thumb, ← ×5).
- One prompt at a time. Type, wait 1 s, Generate (≈ 45 s). A click right after typing is often ignored.
- Check every result before inserting (`pv(t)` in `scripts/vids_helpers.js`, then zoom the frame):
  white head, same outfit, the action actually happens, no text. Remake a bad clip **at most once**.
- Insert → `+` new scene → next prompt.
- Before each clip, tell the remaining generations. Vids shows **no counter**; count yourself
  against the plan limit (help page "Use AI to generate video clips in Google Vids": most plans
  ≈ 50 generations / month, check the user's plan).

## 4. Title card = Codex image + spoken title

The title is a picture, not a Vids text box:

```bash
# grab 1–2 frames of the hero (canvas screenshots) as refs, then:
scripts/cover_gen.sh ./cover "WHY WERE ANCIENT HUMANS SCARED OF THE DARK?" \
  "the boy at a cave mouth at night, glowing eyes in the dark forest behind him" ref0.png ref1.png
```

It loops Codex imagegen → Codex harsh review (`SCORE: N`) → regenerate with the critique, until ≥ 8 (max 3).
The same `cover.png` is the YouTube thumbnail.

Upload it: Uploads panel → run `grabFileInput()` → set the file on `#cf_file_in` → drop it on a new scene,
move that scene to the beginning (scene ⋮ → Move scene → to beginning).

**The title is the hook - it must be voiced:** its voiceover script = the topic question.

## 5. Voiceover

Voiceover panel → voice **Knox** ("smooth, low pitch", calm male storyteller) → one script per scene
(scene 1 = title question, then the 8 lines) → **All scenes → Insert all voiceovers**.

## 6. Joins - the part that breaks ("the voice garbles")

Two causes, fix both, every time:

1. **Overlapping voices.** Inserting voiceover stretches scenes, and each 0.5 s dissolve eats into the
   next scene, so line N runs into line N+1. Fix per clip: select clip → **Playback options → Speed**
   so that `scene length ≥ voice length + 0.8 s` (speed ≈ 5 / (voice + 0.8), e.g. 0.65–0.8).
   Read voice durations with `voices()`. Done right, **all Knox clips sit on one row** in the timeline
   with a small gap between each.
2. **Clip audio still on.** Omni clips come with their own sound. Sound → All tracks → expand each
   *Video* row → set the **volume field to 0** with real clicks (triple-click, type `0`, Enter).
   Don't rely on the Mute checkbox: it shows checked in the editor but the export still carries the
   clip sound (−35 dB bed under every pause). Re-read all volume fields before export. Never touch Knox rows.

## 7. Finish

- Transitions: `trc(i)` → **Dissolve**, duration **0.5 s**, between every pair of scenes.
- Watch out for "Add styled captions" tips - close them with ✕, don't click into them.
- Export: File → Download → **MP4**. It often fails with "Something went wrong" - then
  **File → Export to Drive** (works, ≈ 1 min) and download the file from Drive.
- Verify: `scripts/check_audio.sh video.mp4 9` must PASS (a silence gap after every line),
  and look at 1 frame per scene.

## 8. Report

Where the MP4 and the cover are, the Vids project link, one line per scene, generations used.
