# Factorial series: lecture 2 slides

A browser slide deck (plain HTML, CSS and JavaScript) for the second algorithms lecture. Each example is a series of factorials, so one loop builds each factorial and a second loop adds up the terms.

1. y = 8!/x + 6!/x + 4!/x
2. y = 6!/5! + 4!/3! + 2! + 1!
3. y = 2!·4! + 5!·7! + 8!·10!
4. y = 7x!/3! + 5x!/5! + 3x!/7!

The deck opens with the goals (a quick factorial reminder) and "the big idea": a loop inside a loop. Each example then has a **question slide** (with a thinking timer and a hint) followed by a **solution slide**. On the solution slide the algorithm appears one step at a time, with coloured arrows for the inner loop (green) and the outer loop (orange). The **Trace it** panel runs it line by line, at 1×, 2× or 4× speed, and fills in a trace table and each term of the series.

After a wrap-up slide, the last slide starts **Series Showdown**, a 12-question game for 2 to 4 teams.

## Presenting

| Key | Action |
| --- | --- |
| → or Space | Next slide, or the next step on a solution slide |
| ← | Previous slide |
| F | Full screen |
| Home / End | First / last slide |

The sidebar shows where you are in the lecture; click any item to jump to it. During the game, use A–D (or 1–4) to pick an answer and T / F for true-or-false questions. Enter goes to the next question, M mutes the sounds and Esc returns to the slides (the game pauses and can be resumed).

## Files

- `index.html`: the slides
- `css/style.css`: all styles
- `js/examples.js`: the four algorithms (edit the steps here)
- `js/solution.js`: code blocks, loop arrows, step-by-step reveal and the trace panel
- `js/questions.js`: the game questions
- `js/game.js`: the game
- `js/deck.js`: navigation, sidebar, timers and scaling
- `js/sound.js`: sound effects

To run it locally, open `index.html` in a browser, or serve the folder with any static server.
