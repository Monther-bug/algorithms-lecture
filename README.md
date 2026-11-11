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

## Lecture 2

The second lecture, **Factorial series** (four series algorithms with a loop inside a loop, plus the Series Showdown game), is in [`lecture-2/`](lecture-2/).

## Lecture 3

The third lecture, **Drawing shapes** (printing patterns with loops and `mod`, three class activities, the Pattern Party game and a meme break), is in [`lecture-3/`](lecture-3/).

## Lecture 4 (Python Lab 1)

The first Python lab, **Hello, Python** (reminders on indentation, data types, `input()`, operators and `if` / `else`, five worked examples that run in a VS Code style editor, a bug hunt, practice tasks, the Python Party game and a meme break), is in [`lecture-4/`](lecture-4/).

## Algorithm practice (midterm)

**20 algorithms, from easy to hard** (each with a hint, a simple solution and a trace table students can run with their own numbers) is in [`algorithm-examples/`](algorithm-examples/).
