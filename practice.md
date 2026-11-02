# Practice

Working rules for this project (The Bakery Shop sales dashboard). Follow them on every change.

## 1. Commit and push automatically

Commit and push to `origin/main` automatically after each completed change, without waiting to be asked. Don't batch several features into one commit, and don't leave finished work unpushed.

- One feature or change = one commit, pushed to `origin/main`.
- Write a short commit message that names the change (e.g. `Add best sellers list`).
- Check `git status` first so only the intended files are staged (no scratch files, no secrets).

```bash
git add <files for this feature>
git commit -m "<feature name>"
git push origin main
```

## 2. Create a README and keep the dashboard description up to date

Keep a `README.md` at the project root that describes the dashboard, and update it whenever a feature is added or changed.

- If `README.md` doesn't exist yet, create it first.
- It should contain:
  - what the dashboard is (a mobile-friendly sales dashboard for The Bakery Shop),
  - the current list of features,
  - how to run or view it, once there is something to run,
  - a link to `spec.md` for the full design.
- Update the description and feature list in the same commit as the feature it documents, so the README never lags behind the code (this goes together with rule 1).

## 3. Keep spec.md in sync with every change

`spec.md` is the source of truth for the design, so it must describe what the dashboard actually does. Whenever a change affects how the dashboard looks or behaves, update `spec.md` in the same commit.

- Update every part of `spec.md` the change touches: colours and contrast, sizes, layout, components, data, states, accessibility and acceptance criteria.
- Re-check any numbers in the spec (pixel sizes, hex colours, contrast ratios) against `style.css` and `app.js`.
- Bump the spec version and add a line to the **Revision history** at the end of `spec.md` describing the change.
- A change is not finished until the code, `spec.md` and `README.md` all agree.
