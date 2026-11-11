# Algorithm practice: 30 examples for the midterm

A study deck (plain HTML, CSS and JavaScript) with 30 algorithm examples, from the easiest to the hardest. Students use it on their own, on a phone or a laptop, before the midterm.

## Slides

It works like the lecture decks, with the bar at the bottom: → / ← (or swipe on a phone) move between slides, and the bar shows where you are in each level.

1. **Cover**, **Pick a level** (the stairs jump to a level) and **How we write algorithms**.
2. For each level: a **level slide** (what the level is about, and its examples), then two slides per example:
   - the **problem**: the task, an example input and output, a **Hint** button, a thinking timer (3 / 5 / 10 min) and **Show solution →**
   - the **solution** (see below)
3. **The end**, with the progress and links to the lectures.

The ☰ button (or the M key) opens **All examples**: every example by level with its tick, to jump anywhere. Each slide has its own link, for example `…/algorithm-examples/#ex-13` or `#ex-13-solution`. Other keys: Home / End, F for full screen, L for Arabic.

## The 30 examples

| Level | Examples |
| --- | --- |
| 1 · One step after another | sum and average of three numbers, rectangle area and perimeter, Celsius to Fahrenheit, swap two numbers |
| 2 · Decisions with If | even or odd, the greater of two numbers, positive / negative / zero, who has the greater total, the largest of three numbers, mark to grade letter |
| 3 · Loops | print 1 to N, sum of 1 to N, multiplication table of any number, factorial of N |
| 4 · Loops with If | sum of the even numbers, the largest of N numbers, average of N marks and how many passed |
| 5 · Challenge | the Fibonacci series, is the number prime?, greatest common divisor (GCD), 1! + 2! + … + N!, the three largest numbers in a set |
| 6 · Digits of a number | sum of the digits, reverse a number, palindrome number, Armstrong number (3 digits), decimal to binary |
| 7 · Loop inside a loop | triangle of stars, hollow square, all the prime numbers up to N |

Every solution uses the simplest method that works, written in the course's style: `Start`, `Declare`, `Input`, `Print`, `If … then … else`, `If … then go to step N` for loops, `mod`, `and`, `or`. The drawing examples use `Print new line` like Lecture 3: there, `Print` stays on the same line until `Print new line`.

## Each example has

- the problem, with an example input and output (worked out by running the algorithm, so it is always right)
- a **Hint**
- the **Solution**:
  - **The idea** in one or two sentences
  - **The algorithm, line by line**: every numbered step with a short, simple explanation under it (a switch hides the explanations to see the plain algorithm)
  - **Watch it run**: type input values (or keep the example ones) and go through the algorithm one step at a time (Next / Back / Play). For each step it shows the line, why it is there, and what it did with the real numbers, for example `sum = sum + i = 1 + 2 = 3` or `Is b > max? 9 > 4 → Yes`. The variables are shown as boxes (a changed one shows its old value), with the output so far.
  - the **Trace table** (a tab next to the player) for the same input: one row per executed step, changed values highlighted. Clicking a row opens that step in the player. While the player has focus, → / ← move the player instead of the slides.
- a **Solved** tick. Ticks are kept in the student's own browser and show on the level slides, in the list and on the end slide.

The **العربية** button switches the page to Arabic (English is the default). Algorithm steps, inputs and tables stay in English and left to right.

## Files

- `index.html`: the page
- `css/style.css`: all styles (white, with blue and black, and a little green and red)
- `js/examples.js`: the 30 algorithms (text, the explanation of each line, how each step runs) and the runner used by the player and the trace table
- `js/explain.js`: reads an algorithm line and says what it did with the numbers (used by the player)
- `js/app.js`: builds the level and example slides, the solutions, the player, the trace tables, the bar, the list and the timer
- `js/i18n.js`: the English / Arabic switch and the Arabic text

After changing a CSS or JS file, raise the `?v=` number on the links in `index.html` (for example `?v=3` to `?v=4`), so browsers load the new files.
