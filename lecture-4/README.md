# Hello, Python: Python Lab 1 slides

A browser slide deck (plain HTML, CSS and JavaScript) for the first Python lab. Students already know algorithms and flowcharts, `if` conditions and user input. They have not seen loops yet, so every program here runs once, from the top line to the bottom.

The deck opens with the plan, a "before we start" checklist (VS Code open, a `lab1` folder, `python --version` works) and a slide on how to work in VS Code. Then come six short reminders:

1. From algorithm to Python (Start/End, Declare, Input, Print, If … else)
2. Data types: `int`, `float`, `str`, `bool`
3. `input()` always gives text (with a **Try it** box: type a value and see what `input()`, `int()` and `float()` give back)
4. Operators, for maths and for comparing
5. Indentation
6. `if` / `else` (and a first look at `elif`)

## The five examples

Each example is a problem the class already solved as an algorithm (from the Flowcharts handout or the exercise booklet). The code follows the booklet's style: `x = int(input("... : "))` and `print` with commas.

1. Sum of two numbers: `int(input())`, `+` and `print`
2. Area and perimeter of a rectangle: `*` and brackets
3. Fahrenheit to Celsius: `float` and `/`
4. Even or odd: `%`, `if` / `else` and indentation
5. Average of three marks with Pass / Fail: everything together

Each one has a **question slide** (the task, a sample run, where the class solved it before, a hint and the thinking timer) and a **solution slide**. On the solution slide the code appears one line per → with a plain explanation of that line; one more → shows the idea. **▶ Run** runs the program in a VS Code style terminal: it asks for each input (the sample value is ready, type another and press Enter), highlights the line that runs, shows True / False on `if` lines and lists every variable with its type. Typing text where a number is expected shows Python's real `ValueError`.

## Activities

- **Spot the bug** (6 programs): a missing colon, nothing indented under `if`, one extra space, a missing `int()` (`"5" + "3"` = `53`), `=` instead of `==`, and `5/9 (f - 32)` without `*`. **Run** shows exactly what Python prints, then **Show the fix** corrects the line and explains it.
- **Your turn** (3 tasks to write in VS Code): swap two numbers (warm-up), the larger of two numbers (core), the largest of three with `and` and `elif` (challenge). Each has a sample run, and the solution can be shown and run.

After a wrap-up slide comes **Python Party**, a game of 12 easy questions for 2 to 4 teams, and the deck ends with a **meme break** (three memes, one per → press).

The **العربية** button in the bottom bar switches everything to Arabic (and **English** switches back). English is the default every time the page opens. In Arabic, sentences and buttons are translated, while concept words (Python, Algorithm, Terminal, Error, Indentation), code, variable names and numbers stay in English, and code and the terminal stay left to right.

## Presenting

| Key | Action |
| --- | --- |
| → or Space | Next slide, the next code line on a solution slide, or the next meme |
| ← | Previous slide |
| F | Full screen |
| Home / End | First / last slide |
| L | Switch between English and Arabic |

When the terminal asks for input, type in it and press Enter (the arrow keys don't change slides while you type). During the game, use A–D (or 1–4) to pick an answer and T / F for true-or-false questions. Enter goes to the next question, M mutes the sounds and Esc returns to the slides.

## Files

- `index.html`: the slides
- `css/style.css`: all styles
- `js/py.js`: a tiny model of Python (int, float, str, bool, the operators, `int()` / `float()` with Python's error messages), the line-by-line runner and the VS Code colours
- `js/programs.js`: every program (examples, practice tasks, bugs) with its steps, sample input and line explanations
- `js/editor.js`: the editor and terminal windows, and the runner that drives them
- `js/solution.js`: the solution slides
- `js/activities.js`: Try it, Spot the bug and Your turn
- `js/questions.js`: the game questions (with their Arabic text)
- `js/game.js`: the game
- `js/deck.js`: navigation, progress bar, reveals, timers, scaling and the cover animation
- `js/i18n.js`: the English / Arabic switch and the Arabic text
- `js/sound.js`: sound effects

To run it locally, open `index.html` in a browser, or serve the folder with any static server.

After changing a CSS or JS file, raise the `?v=` number on the links at the top and bottom of `index.html` (for example `?v=1` to `?v=2`). Browsers keep old copies of these files for a few minutes, and the new number makes them load the new ones.
