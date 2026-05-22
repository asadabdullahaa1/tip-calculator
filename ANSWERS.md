# Answers

## 1. How to run

Open `index.html` directly in a modern browser.

Optional command from the repo root:

```bash
python -m http.server 5173
```

Then open `http://localhost:5173`.

There are no npm dependencies or build steps. I did not deploy this version.

## 2. Stack and design choices

I used vanilla HTML, CSS, and JavaScript because the app has one screen and no shared state beyond three inputs. Avoiding a framework keeps the fresh-machine setup simple and puts the focus on live input handling, validation, keyboard flow, and responsive layout.

Visual or interaction decision 1: the result panel is a fixed side panel on laptop screens and moves below the form on smaller screens. On a 1440px laptop, this keeps the changing total visible beside the controls. On a phone, stacking the panel below the inputs keeps the fields full-width and easier to type into.

Visual or interaction decision 2: the preset tip buttons write into the same custom tip input instead of being a separate hidden state. That means the active 10%, 15%, or 20% choice is visible both as a highlighted button and as an editable number, and typing a custom value automatically clears the active preset unless it exactly matches one.

Rounding policy: I round each person's share up to the nearest cent with `Math.ceil(value * 100) / 100`. That means the group never underpays because of fractional cents. It can over-collect by a few cents in edge cases, but for a quick bill-splitting tool I prefer the predictable "never short the bill" behavior over a more complex remainder distribution UI.

## 3. Responsive and accessibility

At 360px wide, the calculator becomes a single-column layout. The form appears first, the result panel follows it, inputs are full-width, and the preset buttons stack vertically so their labels do not crowd.

At 1440px wide, the app sits centered with a two-column layout: form controls on the left and totals on the right. The per-person result uses larger type because it is the primary answer.

Accessibility handled: inputs use real labels, inline error messages are connected with `aria-describedby`, invalid fields set `aria-invalid`, preset tip buttons expose `aria-pressed`, and focus states are visible for keyboard navigation.

Accessibility skipped: I did not add a full automated accessibility test pass with tooling such as axe. With another day I would run that plus screen reader smoke tests in at least one desktop browser.

## 4. AI usage

I used OpenAI Codex as a coding helper while building my tip calculator idea. I used it mainly for second-pass implementation support: checking whether my validation covered edge cases, helping organize the README and ANSWERS file, and suggesting small accessibility details such as `aria-describedby`, `aria-invalid`, and `aria-pressed`.

One specific place I used AI was the number validation logic. I asked Codex to review the input behavior for realistic break cases like zero people, negative bills, pasted text, and very large numbers. The suggested validation was stricter than I wanted at first because it treated an in-progress value like `12.` as invalid while the user was still typing. I changed the parser to allow that temporary decimal state so the UI would not flash an error during normal typing, while still rejecting pasted garbage text and invalid final values.

I also used AI to help phrase the documentation clearly, but I made the final decisions about the stack, layout, rounding policy, and interaction behavior based on what I wanted the calculator experience to feel like.

## 5. Honest gap

The app is functional and handles the main break cases, but the rounding policy could be more polished. With another day I would add an optional "settle exact cents" mode that distributes the leftover cents across people, so the displayed individual shares add up exactly to the grand total without over-collecting.
