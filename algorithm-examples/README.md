# Algorithm practice: 20 examples for the midterm

A study page (plain HTML, CSS and JavaScript) with 20 algorithm examples, from the easiest to the hardest. It is made for students to use on their own, on a phone or a laptop, before the midterm.

## The 20 examples

| Level | Examples |
| --- | --- |
| 1 · One step after another | sum and average of three numbers, rectangle area and perimeter, Celsius to Fahrenheit, swap two numbers |
| 2 · Decisions with If | even or odd, the greater of two numbers, positive / negative / zero, who has the greater total, the largest of three numbers, mark to grade letter |
| 3 · Loops | print 1 to N, sum of 1 to N, multiplication table of any number, factorial of N |
| 4 · Loops with If | sum of the even numbers, the largest of N numbers, average of N marks and how many passed |
| 5 · Challenge | is the number prime?, the three largest numbers in a set, 1! + 2! + … + N! |

Every solution uses the simplest method that works, written in the course's style: `Start`, `Declare`, `Input`, `Print`, `If … then … else`, `If … then go to step N` for loops, and `mod`.

## Each example has

- the problem, with an example input and output (worked out by running the algorithm, so it is always right)
- a **Hint**
- the **Solution**: the idea in one sentence, then the numbered steps; loop lines show where they jump back to (`↩ 5`)
- **Trace it**: type your own input values and get the output and the full trace table, with the value that changed in each step highlighted. Pointing at a row highlights that step in the algorithm.
- a **Solved** tick. Ticks are kept in the student's own browser and fill the progress bar at the top.

The level cards at the top filter the list, and a switch hides the solved ones. A **How we write algorithms** box lists the words and signs used in the course.

The **العربية** button switches the page to Arabic (English is the default). Algorithm steps, inputs and tables stay in English and left to right. The page follows the device's light or dark mode.

## Files

- `index.html`: the page
- `css/style.css`: all styles
- `js/examples.js`: the 20 algorithms (text, steps and how each step runs) and the runner used for the traces
- `js/app.js`: builds the cards, the trace tables, the filters and the progress bar
- `js/i18n.js`: the English / Arabic switch and the Arabic text

After changing a CSS or JS file, raise the `?v=` number on the links in `index.html` (for example `?v=1` to `?v=2`), so browsers load the new files.
