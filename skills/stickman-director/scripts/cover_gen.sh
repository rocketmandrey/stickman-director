#!/bin/zsh
# usage: cover_gen.sh DIR "TITLE TEXT" "scene description" ref1.png [ref2.png]
# Codex imagegen -> Codex review -> regenerate with critique until SCORE>=8 (max 3)
cd "$1" || exit 1; T="$2"; SCN="$3"; shift 3; REFS=(); for r in "$@"; do REFS+=(-i "$r"); done
BASE="YouTube thumbnail / title card, 16:9 landscape, 1920x1080. Keep EXACTLY the character design and hand-drawn ink cartoon look of the reference frames (plain stickman: big round paper-white head, black ink hair, thin black line limbs). Scene: $SCN Strong contrast, cinematic lighting, dark vignette. Big bold title text exactly: '$T' in chunky white and yellow letters with thick black outline, perfectly spelled, readable on a phone, not covering the face. No other text, no logos, no watermarks."
FB=""
for i in 1 2 3; do
  codex exec --skip-git-repo-check -s workspace-write "Use your image generation tool to create ONE image and save it as cover_v$i.png in the current directory. Image: $BASE $FB" "${REFS[@]}" < /dev/null > gen_$i.log 2>&1
  [ -f cover_v$i.png ] || { echo "v$i: no image"; continue; }
  codex exec --skip-git-repo-check -s read-only "You are a harsh YouTube thumbnail reviewer. Review cover_v$i.png. Title must read exactly '$T'. Check: spelling, readability at phone size, emotion, contrast, character matches reference (white round head, ink hair, line limbs), clutter, artifacts. Reply with first line exactly 'SCORE: N' (1-10), then max 5 bullet fixes." -i cover_v$i.png "${REFS[@]}" < /dev/null > rev_$i.log 2>&1
  SC=$(grep -o '^SCORE: *[0-9]*' rev_$i.log | tail -1 | grep -o '[0-9]*')
  echo "v$i score=$SC"
  [ -n "$SC" ] && [ "$SC" -ge 8 ] && { cp cover_v$i.png cover.png; echo "PASS v$i"; exit 0; }
  FB="Previous attempt was criticized; fix these: $(grep -A6 '^SCORE:' rev_$i.log | tail -5 | tr '\n' ' ')"
done
cp cover_v$i.png cover.png 2>/dev/null; echo "no pass, using last"
