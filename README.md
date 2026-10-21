# Writing Algorithms: lecture slides

A browser slide deck (plain HTML, CSS and JavaScript) with three worked algorithm examples and a team game at the end of the lecture.

1. Factorial of a number N
2. y = 4! × 5!
3. y = 4X! + Z²

Each example has a **question slide** (with a thinking timer and a hint) followed by a **solution slide**. On the solution slide the algorithm appears one step at a time, and the **Trace it** panel runs it line by line with a trace table.

The last slide starts **Factorial Face-off**, a 12-question game for 2 to 4 teams.

## Presenting

| Key | Action |
| --- | --- |
| → or Space | Next slide, or the next step on a solution slide |
| ← | Previous slide |
| F | Full screen |
| Home / End | First / last slide |

During the game, use A–D (or 1–4) to pick an answer and T / F for true-or-false questions. Enter goes to the next question, M mutes the sounds and Esc returns to the slides (the game pauses and can be resumed).

## Files

- `index.html`: the slides
- `css/style.css`: all styles
- `js/examples.js`: the three algorithms (edit the steps here)
- `js/solution.js`: step-by-step reveal and the trace panel
- `js/questions.js`: the game questions
- `js/game.js`: the game
- `js/deck.js`: navigation, timers and scaling
- `js/sound.js`: sound effects

To run it locally, open `index.html` in a browser, or serve the folder with any static server.
