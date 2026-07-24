# CLAUDE CODE RULES

This file defines the strict quality and development standards for this codebase. All rules must be followed at all times.

---

## GLOBAL DEVELOPMENT RULES

### 1. Commenting Rules (Strict Format)

- **Language:** Write all comments exclusively in ENGLISH.
- **Length:** Comments must be extremely concise (1 or 2 lines maximum).
- **Content:** Only write technical comments that explain _why_ a complex logic is implemented, not _what_ the code does.
- **PROHIBITED FORMATS:**
  - NO numbered lists inside code comments.
  - NO bullet points or dashes.
  - NO decorative lines, ASCII art, or separators.
  - Write standard, inline sentences: `// brief technical explanation here.`
  - First letter of the comment must be lowercase.

### 2. Generating documentation

- Each function must have documentation like : 
```typescript
/**
 * @description Brief description of the function.
 * @param {string} param1 - Description of param1.
 * @returns {string} Description of the return value.
 */
function myFunction(param1) {
    return param1;
}
```
- Generate documentation using JSDoc.
- Format the documentation using JSDoc.
- Keep the documentation concise and to the point.
- Do not add any extra information that is not related to the code.
- Documentation must be in English.
- Documentation must be generated with the command `npx jsdoc -c Documentation.json`.

### 3. Preserving Code, Diffing & Renaming

- **No Random Renaming:** NEVER arbitrarily change the names of existing functions, variables, or hooks. If a function is named `fetchData`, keep it `fetchData` unless explicitly asked to rename it.
- **Data objects:** When getting data, never change the fields, use the same in processing functions and views to keep consistency. 
- **Surgical Changes:** When modifying an existing file, alter ONLY the strictly necessary lines required to complete the task. Do not reformat, re-indent, or modify untouched surrounding code.
- **Preserve Comments:** DO NOT delete, alter, or format existing structural comments.
- Leave existing code structure completely untouched unless specifically instructed to refactor that exact block.

### 4. No Lazy Coding

- NEVER use placeholders like `// ... existing code ...` or `// implement logic here`.
- Always output the complete, functional code block required for the change, without truncating functions or objects.

### 5. Imports & Dependencies

- **Absolute Imports Only:** Use ABSOLUTE paths exclusively (e.g., `@/components/Button`). NEVER use relative paths like `../../utils` or `./components`.
- **No Hallucinations:** Use ONLY the libraries and dependencies already present in the codebase. Do not invent or import external packages unless explicitly requested.

### 7. Error Handling

- NEVER swallow errors silently.
- Using `try { ... } catch (e) { console.log(e) }` is strictly prohibited. You must handle errors properly, display them to the user if necessary, or `throw` them up the chain.
- **Error Chaining:** When catching and re-throwing errors, ALWAYS preserve the original trace using the `cause` property: `throw new Error('Action failed', { cause: error });`.

### 8. Naming Conventions & Magic Numbers

- **No Magic Values:** NEVER use hardcoded "magic numbers" or "magic strings" in business logic, computations, or conditions. Extract them into descriptive constants in `config.json`.
- **What IS a magic number:** time durations, thresholds, API status codes, protocol values, format strings, locale identifiers, mathematical multipliers — any literal whose meaning is not immediately obvious from context.
- **What is NOT a magic number:** Tailwind CSS class values (`w-8`, `gap-2`, `grid-cols-4`), SVG attributes (`viewBox`, `cx`, `strokeWidth`, `d` paths), Framer Motion transition configs, `padStart(2, '0')`, and trivial `0`/`1` in boolean-like expressions. These are presentational values and stay inline.
- **Booleans:** Boolean variables must always start with a descriptive prefix like `is`, `has`, `should`, or `can` (e.g., `isValid`, `hasError`).

### 9. Styling (Strict Tailwind CSS)

- **Tailwind Only:** Exclusively use Tailwind CSS classes for styling. NEVER write inline CSS (`style={{...}}`).
- **No Arbitrary Values:** STRICT PROHIBITION on arbitrary dimension values (e.g., DO NOT use `w-[50px]`, `h-[20px]`, `gap-[15px]`). You MUST use standard Tailwind sizing/spacing classes (e.g., `w-12`, `h-5`, `gap-4`).
- **Build Tailwind**: Use the command `npm run build:css` to build the Tailwind CSS.

### 10. General Best Practices

- **Early Returns:** Avoid deeply nested `if/else` pyramids. Use guard clauses to exit early.
- **Async/Await:** Use `async/await` exclusively. Do not use `.then().catch()` chains.
- **Immutability:** Never mutate states, objects, or arrays directly. Use spread operators, `map`, or `filter`.

### 11. Code Quality and Optimization

- Write highly optimized, Senior-level code.
- Keep the code ordered, clean, and modular.
- **Formatting:** ONLY use the command `npm run format:views` to format the code.
- Do not output explanations or chatty text before or after the code block unless explicitly requested. Just output the clean code.

### 12. Build & Warnings (Zero Tolerance)

- **Failed Builds:** Code that breaks the build is unacceptable.
- **Zero Warnings:** The codebase must be 100% free of errors.
- **Linting & Formatting:** You MUST adhere to the project's linting and formatting rules at all times.

---

## PROJECT ARCHITECTURE

### Overview

This is an **open-source repo** for historical and real-time Formula 1 data visualization. It consists of many packages:

- **`bin`** — Scripts to setup and manage the project.
- **`data`** — Data files for the project (f1db splitted .json files).
- **`Documentation`** — Documentation for the project.
- **`locales`** — Language files for the project.
- **`public`** — Public files for the project (img / icons / fonts...).
- **`routes`** — Routes for the project.
- **`utils`** — Utilities for the project (data processing functions...).
- **`views`** — Views for the project.

### Tech Stack & Libraries

- **Framework:** Express.js with EJS / WebSocket.
- **Styling:** Tailwind CSS 4.
- **Data Fetching:** [f1db](https://github.com/f1db/f1db) and native WebSocket for real-time telemetry.
- **Charts:** ApexCharts for points / standings visualization.

### Backend Architecture

- **Returning views:**
  - Uses Express.js
  - EJS templates are used to render the HTML.
  - Routes are calling methods in the `utils` directory to get data.
  - Then return the view with the data.

- **Historical data:**
  - Uses [f1db](https://github.com/f1db/f1db) for historical data.
  - Data is processed using scripts in the `utils` directory.

- **Real-time data:**
  - Uses the raw `ws` library on Node.js.
  - Connects to Formula 1's official SignalR live-timing endpoint.
  - Relays decompressed telemetry updates to connected frontend clients.

### Data Flow
- **Historical data:** `data/f1db` (f1db splitted .json files)  → `utils` → `routes` → `views`.
- **Real-time data:** F1 SignalR → Backend WebSocket relay → Frontend WebSocket client.

### File Naming

- **Avoid `index.js`:** Name files explicitly.
- **Naming convention:** Must be camelCase, e.g. `fileName.js` or `fileName.ejs`.

---

## COMMIT RULES

When asked to commit (`/commit`):
1. File `signalr_connections.log` must be cleared before commiting
2. Command `npm run release` must be run before commiting
3. Stage all changes with `git add .`
4. Analyze staged changes via `git diff --staged` (base message on this, NOT chat history)
5. Conventional Commit title (max 72 chars): `feat:`, `fix:`, `refactor:`, `chore:`, `style:`
6. First letter of the commit title MUST be lowercase
7. Body as bulleted list: `- [File/Folder]: Brief explanation`
8. Execute `git commit -m "<TITLE>" -m "<BODY>"`
9. Push with `git push` (or `git push -u origin HEAD` if no upstream)
10. Output ONLY confirmation with commit hash

## PR RULES

When asked to open a PR (`/pr`):
1. Analyze FULL diff against base branch (`git diff origin/main...HEAD`)
2. Push branch if needed
3. Professional PR title in English
4. Body: follow the template in `.github/pull_request_template.md`
5. Execute `gh pr create --base main --title "<TITLE>" --body "<BODY>"`
6. Target `main` branch by default unless explicitly asked otherwise
7. Output ONLY the GitHub PR URL
