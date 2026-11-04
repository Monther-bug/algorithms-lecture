# Drawing shapes: lecture 3 slides

A browser slide deck (plain HTML, CSS and JavaScript) for the third algorithms lecture: drawing shapes by printing characters with loops.

1. `*@*@*@*`: one loop, and `i mod 2` picks the character
2. `12345`, as a **flowchart**: Start, `i = 1`, `Print i`, `i = i + 1`, then the decision `i <= 5 ?` (Yes goes back to Print, No goes to End)
3. A triangle of stars: a loop inside a loop (`i` = row, `j` = place in the row)
4. `1234A`, `123A5`, `12A45`, `1A345`, `A2345`: two loops (`r` = row, `c` = column) that print `c`, or `A` where `r + c == 6`

The deck opens with the goals (a quick reminder of Print and New line) and three short "tool" slides: what `mod` gives, what the flowchart shapes mean (Start/End, Process, Print, Decision and arrows), and how rows and columns work. Each of the four examples has a **question slide** (the target shape, a thinking timer and a hint) followed by a **solution slide**. On the solution slide the algorithm appears one step at a time, with loop arrows (green for the inner loop, yellow for the outer one). Example 2 is solved as a flowchart instead: its shapes appear one at a time, and Trace it lights up the current shape. The **Trace it** panel runs it on an output canvas, character by character, at 1×, 2× or 4× speed, with a print log that shows every character and why it was printed.

## Activities

- **Predict** (5 rounds): one line of an example is changed, shown in yellow (or crossed out when removed). The class draws its guess on paper, then **Draw it** prints the real shape and explains why. The rounds cover the usual mistakes: stopping early, `mod 3`, forgetting New line, forgetting `j = 1`, and `r == c` instead of `r + c == 6`.
- **Your turn**: three shapes to write an algorithm for (warm-up `@*@*@*@`, core: an upside-down triangle, challenge: `1`, `12`, `123`, `1234`). **Show solution** reveals the algorithm and **Run it** draws it.
- **Pattern Lab**: pick a row, triangle or stairs, change the size and the characters, and the algorithm and drawing update together. Good for "what if…?" questions from the class.

After a wrap-up slide comes **Pattern Party**, a game of 12 easy questions for 2 to 4 teams, and the deck ends with a **meme break** (three memes, one per → press).

The **العربية** button in the bottom bar switches everything to Arabic (and **English** switches back). English is the default every time the page opens. In Arabic, the sentences and buttons are translated, while concept words (Algorithm, Flowchart, Loop, Print, New line, mod, Trace, Output), code, characters and numbers stay in English, and the drawings are never mirrored.

## Presenting

| Key | Action |
| --- | --- |
| → or Space | Next slide, the next step on a solution slide, or the next meme |
| ← | Previous slide |
| F | Full screen |
| Home / End | First / last slide |
| L | Switch between English and Arabic |

The bar at the bottom shows where you are; click a segment to jump to that slide. During the game, use A–D (or 1–4) to pick an answer and T / F for true-or-false questions. Enter goes to the next question, M mutes the sounds and Esc returns to the slides (the game pauses and can be resumed).

## Files

- `index.html`: the slides
- `css/style.css`: all styles
- `js/patterns.js`: every algorithm (examples, Predict rounds, Your turn shapes, Pattern Lab) and the runner that prints them
- `js/views.js`: the output canvas, code blocks with loop arrows, flowcharts, and the tool-slide drawings
- `js/solution.js`: step-by-step reveal and the Trace it panel
- `js/activities.js`: Predict, Your turn and Pattern Lab
- `js/questions.js`: the game questions (with their Arabic text)
- `js/game.js`: the game
- `js/deck.js`: navigation, progress bar, reveals, timers, scaling and the cover animation
- `js/i18n.js`: the English / Arabic switch and the Arabic text
- `js/sound.js`: sound effects

To run it locally, open `index.html` in a browser, or serve the folder with any static server.

After changing a CSS or JS file, raise the `?v=` number on the links at the top and bottom of `index.html` (for example `?v=4` to `?v=5`). Browsers keep old copies of these files for a few minutes, and the new number makes them load the new ones.
