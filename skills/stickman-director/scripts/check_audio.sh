#!/bin/sh
# usage: check_audio.sh video.mp4 [expected_lines]
# Every narration line must be followed by a silence gap. Fewer gaps than lines
# = voices overlap at a join or clip audio is still on.
f="$1"; n="${2:-9}"
gaps=$(ffmpeg -hide_banner -i "$f" -af silencedetect=noise=-35dB:d=0.25 -f null - 2>&1 | grep -c 'silence_end')
ffmpeg -hide_banner -i "$f" -af silencedetect=noise=-35dB:d=0.25 -f null - 2>&1 | grep -o 'silence_[a-z]*: [0-9.]*' | paste - - 
echo "gaps=$gaps expected>=$((n-1))"
[ "$gaps" -ge $((n-1)) ] && echo PASS || { echo "FAIL: voices overlap or clips not muted"; exit 1; }
