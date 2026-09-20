# Plan: Multi-Language Support for Problems

Status: **IMPLEMENTED & verified.** All 5 languages (C, CPP, PYTHON, JAVA, JAVASCRIPT) execute correctly through Judge0 (live test 10/10 pass). `GET /languages` exposes the backend source of truth; admin forms are dynamic (add/remove language, per-language data, no duplicates, ≥1 required); frontend maps fixed (C/C++ added, bogus TYPESCRIPT removed, `getMonacoLanguage` handles `CPP`→`cpp`); backend rejects unsupported keys with 400; existing JS/PY/JAVA problems unaffected (no migration). The design notes below are retained for reference.

## Goal
Let a problem support **one or more** languages (any subset), not all-or-nothing. Admin picks which languages a problem has; each language carries its own `codeSnippet` + `referenceSolution` (+ example). Execution must work for every supported language, keyed off the backend's existing `getLanguage` source of truth.

---

## Current state (what the trace found)

### Language sources of truth — currently INCONSISTENT (the key problem)
- **Backend** `backend/src/libs/judge0lib.js`:
  - `getJudge0LanguageID`: `C=50, CPP/C++=54, PYTHON=71, JAVA=62, JAVASCRIPT/JS=63`.
  - `getLanguageName`: `50→C, 54→CPP, 71→PYTHON, 62→JAVA, 63→JAVASCRIPT`.
- **Frontend** `frontend/src/lib/utilFunctions.js`:
  - `getJudge0LanguageID`: only `PYTHON=71, JAVA=62, JAVASCRIPT=63` (**missing C/C++**).
  - `getLanguageName`: has a bogus `74→TYPESCRIPT` and is **missing C/CPP**.
- So the backend already recognizes 5 languages (C, C++, Python, Java, JavaScript) but the frontend exposes only 3 and disagrees. **Backend `judge0lib` is the intended source of truth.**

### Storage — already per-language JSON, no schema change needed
- `Problem.codeSnippets`, `referenceSolutions`, `examples` are all `Json` columns keyed by language name (e.g. `{ "JAVASCRIPT": ..., "PYTHON": ... }`). Verified in `schema.prisma` and `sampleProblem.js`.
- A problem with a subset of languages is already representable — the JSON just has fewer keys. **No migration required.**

### Execution — already language-driven, mostly works
- `createProblem` iterates `Object.entries(referenceSolutions)`, calls `getJudge0LanguageID(language)`, throws 400 for unsupported languages, and runs each solution through Judge0 against the testcases. So it already validates every provided language and only accepts supported ones.
- `ProblemPage.jsx` is **already dynamic**: language dropdown = `Object.keys(problem.codeSnippets)`; selecting a language loads that snippet and sends `getJudge0LanguageID(selectedLanguage)` to run/submit. So viewing + executing a subset already works at runtime — **as long as the frontend `getJudge0LanguageID` recognizes the language.**
- `executeCode`/`runCode` use `getLanguageName(language_id)` (from `judge0lib`) to store the submission language.

### The real gaps (admin side)
- **Admin forms hardcode exactly `["JAVASCRIPT","PYTHON","JAVA"]`** for the examples/snippets/solutions sections, in both `CreateProblemForm.jsx` and `EditProblem.jsx`.
- **Zod `CreateProblemSchema` requires all three** languages as fixed object keys (`examples.JAVASCRIPT`, `codeSnippets.PYTHON`, etc.) — so an admin cannot submit a subset, and cannot add C/C++.
- Backend `createProblemValidator` only checks `codeSnippets`/`referenceSolutions` are `notEmpty()` (doesn't enforce the three keys), so the **backend is already flexible** — the block is the frontend schema + hardcoded form UI.

---

## Design

### 1. Single language source of truth
- Add a canonical exported list in the backend, derived from `judge0lib` (e.g. `SUPPORTED_LANGUAGES = ["C", "CPP", "PYTHON", "JAVA", "JAVASCRIPT"]`) alongside the existing maps, OR expose it via a tiny endpoint. Decision below.
- **Fix the frontend `utilFunctions.js`** to match the backend exactly: add C (50) and C++ (54), remove the bogus TYPESCRIPT, align `getLanguageName`. This alone unblocks executing C/C++.
- Frontend language options should come from this shared list, not a separate hardcode.

**How to share the list (pick one):**
- **(a) Endpoint** `GET /languages` returning the supported languages from `judge0lib`. Truest to "getLanguage is the source of truth," always in sync, but adds a fetch.
- **(b) Mirrored frontend constant** derived once from the same names. Simpler, no network, but must be kept in step with the backend map (low churn — languages rarely change).

Recommendation: **(b)** a small `frontend/src/lib/languages.js` constant that mirrors the backend's supported names, with a comment pointing to `judge0lib` as canonical. If you'd rather have zero duplication, (a) is the alternative — say so and I'll do the endpoint.

### 2. Admin form: dynamic language list (reuse existing structure)
- Replace the hardcoded `["JAVASCRIPT","PYTHON","JAVA"].map(...)` with a **dynamic set of selected languages** the admin manages:
  - "Add language" control (a dropdown of supported languages not yet added).
  - For each added language, render the existing snippet/reference-solution/example editors (reuse the current Monaco blocks — no parallel system).
  - "Remove language" removes that language's section and its data.
- Keep the data shape identical: `codeSnippets`, `referenceSolutions`, `examples` remain objects keyed by language. Adding/removing a language adds/removes a key — **never overwrites another language's code** (each keyed independently).
- At least one language required (a problem with zero languages can't be executed/solved).

### 3. Zod schema: subset-friendly
- Change `examples`/`codeSnippets`/`referenceSolutions` from a fixed 3-key object to a **record keyed by supported language** with at least one entry, and cross-field consistency (every language present in `codeSnippets` should also have a `referenceSolution`, since the backend executes reference solutions). Enforce the keys are within the supported set.
- **Duplicate prevention** (requirement 7): because these are object keys, duplicates are structurally impossible in storage. In the form UI, the "Add language" dropdown only offers languages not already added, so the admin can't create `C++, C++`. Add a guard on add just in case.

### 4. Backend validators/controllers
- `createProblemValidator`/problem controllers already accept arbitrary language keys and validate each via `getJudge0LanguageID` (400 on unsupported). Minor hardening: optionally assert at least one language and that `codeSnippets`/`referenceSolutions` keys are supported + consistent. Largely no change — the backend is already language-driven.
- `updateProblem` already writes the whole `codeSnippets`/`referenceSolutions`/`examples` objects, so editing a multi-language problem works once the form sends the right shape.

### 5. ProblemPage (runtime) — mostly already correct
- Already derives languages from `Object.keys(problem.codeSnippets)` and sends the right id. The only fix needed is the shared `getJudge0LanguageID` (so C/C++ resolve). Verify the Monaco `language={selectedLanguage.toLowerCase()}` maps sanely for C++ (`cpp`) — may need a small display→monaco mapping (`CPP`→`cpp`).

### 6. Backward compatibility
- Existing problems store JS/PY/JAVA keys — unaffected; they just render those three languages. No migration. New problems can store any subset.
- The bogus frontend `getLanguageName` (74→TYPESCRIPT) isn't used in the critical path but should be corrected to avoid mislabeled submissions.

---

## Files to change
- `frontend/src/lib/utilFunctions.js` — align language maps with backend (add C/C++, drop TYPESCRIPT).
- `frontend/src/lib/languages.js` (new) — shared supported-language list + display labels + Monaco id mapping.
- `backend/src/libs/judge0lib.js` — optionally export a `SUPPORTED_LANGUAGES` list to formalize the source of truth (and/or a `/languages` endpoint if we choose option (a)).
- `frontend/src/validators/problemForm.validators.js` — subset-friendly `codeSnippets`/`referenceSolutions`/`examples` record validation.
- `frontend/src/components/CreateProblemForm.jsx` and `frontend/src/page/EditProblem.jsx` — dynamic add/remove-language UI reusing existing editor blocks; edit path seeds selected languages from the problem's existing keys.
- `backend/src/validators/problem.validators.js` / `problem.controllers.js` — optional hardening (≥1 language, supported keys). Likely minimal.
- Docs: `tech-stack.md`, `business-logic.md`, `feature-code-map.md`, `api-documentation.md` (if `/languages` added).

## Verification (per your checklist)
- Create problems with one / two / several languages; confirm each stores only its keys.
- Edit an existing multi-language problem; confirm languages preserved, add/remove works, no cross-overwrite.
- ProblemPage: switch languages; correct starter code loads per language.
- Run + submit **each** supported language (C, C++, Python, Java, JavaScript); confirm correct Judge0 id/compiler and testcase execution.
- Reference solutions stay associated with the correct language (backend executes each on create).
- Existing JS/PY/JAVA problems still execute.
- Duplicate language cannot be added in the form.
- `npm run build` + lint; backend parse; a live create/execute smoke test for at least one newly-enabled language (C++).

## Open questions
1. **Sharing the language list**: mirrored frontend constant (b, simpler) or a `GET /languages` endpoint (a, zero duplication)? Default: (b).
2. **Which languages to expose**: all five the backend supports (C, C++, Python, Java, JavaScript)? The backend `getJudge0LanguageID` supports all five; confirm you want C and C++ surfaced in the UI.
3. **Examples per language**: keep an example block per selected language (current shape), or make examples optional/simpler? Current plan keeps them per-language to match today's structure.
4. **Minimum languages**: require at least one (recommended) — confirm.
