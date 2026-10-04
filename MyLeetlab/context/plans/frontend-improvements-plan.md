# Frontend Improvements Plan

## Priority Legend
- 🔴 High — bugs or data loss
- 🟠 Medium — broken visuals / bad UX
- 🟡 Low — polish and accessibility

---

## ✅ Implemented

| # | Item | Files |
|---|---|---|
| 1 | Save to Playlist button → icon-only `<Bookmark>` | `ProblemTable.jsx` |
| 2 | Delete playlist stale state (`deleteAPlaylist(id)`) | `Profile.jsx` |
| 3 | Confirm password field + Zod `.refine()` on signup | `SignUpPage.jsx`, `authForm.validators.js` |
| 4 | Logo imported as ES module (Vite-safe) | `Navbar.jsx` |
| 5 | Avatar fallback → deterministic `InitialsAvatar` (no random URL) | `Navbar.jsx`, `Profile.jsx`, `InitialsAvatar.jsx` (new) |
| 6 | Avatar `w-24 h-24` so real photo stays circular | `Profile.jsx` |
| 7 | Broken CSS class on Login footer `<p>` (stray `"` removed) | `LoginPage.jsx` |
| 8 | `await login()` so errors aren't silently swallowed | `LoginPage.jsx` |
| 9 | Company badges on problem list rows | `ProblemTable.jsx` |
| 10 | Breadcrumb shows `Home > Problems > {title}` | `ProblemPage.jsx` |

---

## 🟠 Medium Priority

### 11. `console.log` debug calls left in production paths
**Files:** `ForgotPassword.jsx`, `VerifyEmail.jsx`
**Problem:** `console.log(data)` and `console.log(error)` log user emails/passwords to the browser console.
**Fix:** Remove all `console.log(data)` and `console.log(error)` calls from both files.

---

### 12. Oversized Bookmark and Share icons on ProblemPage
**File:** `frontend/src/page/ProblemPage.jsx`
**Problem:** `w-[50px] h-[50px]` raw icons in the header bar are disproportionately large next to the selects.
**Fix:** Wrap in `btn btn-ghost btn-sm` and use `w-5 h-5` icons.

---

### 13. Auth panel background ignores active theme
**File:** `frontend/src/components/AuthImagePattern.jsx`
**Problem:** `bg-slate-900 text-white` is hardcoded. In light mode the right half is always dark.
**Fix:** Replace `bg-slate-900` with `bg-base-300`, remove hardcoded `text-white`, update inner editor mock colours to use DaisyUI tokens.

---

### 14. Code snippet rotates too fast to read
**File:** `frontend/src/components/AuthImagePattern.jsx`
**Problem:** `setInterval` fires every 2000ms — too fast to read a full snippet.
**Fix:** Increase to 5000ms.

---

## 🟡 Low Priority (Polish)

### 15. Login heading copy is off
**File:** `frontend/src/page/LoginPage.jsx`
**Problem:** Heading says *"Welcome User"*, subtitle says *"start using our services"*.
**Fix:** Heading → `"Welcome back"`, subtitle → `"Sign in to start solving problems"`.

---

### 16. LoginPage component is named `SignUpPage`
**File:** `frontend/src/page/LoginPage.jsx`
**Problem:** The exported default is `const SignUpPage` — confusing in devtools.
**Fix:** Rename to `const LoginPage`.

---

### 17. Error messages use `text-red-500` instead of `text-error`
**File:** `frontend/src/page/LoginPage.jsx`
**Problem:** Hardcoded Tailwind colour won't respect DaisyUI theme overrides.
**Fix:** Replace `text-red-500` → `text-error` on both error `<p>` elements.

---

### 18. `getSolvedProblemByUser` has wrong `useEffect` dependency
**File:** `frontend/src/page/HomePage.jsx`
**Problem:** `useEffect(() => { getSolvedProblemByUser() }, [getAllProblem])` depends on a stable function ref — effectively `[]` but misleading.
**Fix:** Change dependency array to `[]`.

---

### 19. Test case expected outputs exposed before submission
**File:** `frontend/src/page/ProblemPage.jsx`
**Problem:** Expected outputs are visible by default in the test cases panel.
**Fix:** Collapse expected output behind a toggle button (Eye/EyeOff).

---

### 20. No active-link highlighting in Navbar
**File:** `frontend/src/components/Navbar.jsx`
**Problem:** No visual indication of the current page in the dropdown.
**Fix:** Replace `<Link>` with React Router `<NavLink>`, apply `bg-primary text-white` when `isActive`.

---

### 21. Theme toggle not in Navbar
**Files:** `frontend/src/components/Navbar.jsx`, `frontend/src/components/ThemeToggleButton.jsx`
**Problem:** `ThemeToggleButton` uses `fixed top-4 right-4` and floats over content. It should live in the Navbar.
**Fix:** Remove `fixed`/`z-100` from `ThemeToggleButton`, import and render it inside `Navbar` beside the avatar.

---

### 22. Navbar avatar dropdown has no `aria-label`
**File:** `frontend/src/components/Navbar.jsx`
**Problem:** The `<label>` trigger for the avatar dropdown has no accessible label.
**Fix:** Add `aria-label="Open user menu"` to the `<label>` element.

---

### 23. Profile — solved problems show no difficulty breakdown
**File:** `frontend/src/page/Profile.jsx`
**Problem:** Only shows "Problem Solved: N" with no Easy / Medium / Hard split.
**Fix:** Derive counts from `solvedProblems` (already fetched) and render DaisyUI `progress` bars per level. No new API call needed.
```js
const easySolved   = solvedProblems.filter(p => p.problem.difficulty === "EASY").length;
const mediumSolved = solvedProblems.filter(p => p.problem.difficulty === "MEDIUM").length;
const hardSolved   = solvedProblems.filter(p => p.problem.difficulty === "HARD").length;
```

---

### 24. Profile — no recent submissions visible
**File:** `frontend/src/page/Profile.jsx`, **Backend:** `submission.controllers.js`
**Problem:** Profile shows only aggregate counts. Users must open a specific problem page to see submissions.

**Backend change needed:** `getAllSubmission` returns submissions without the problem title/id. Add:
```js
include: { problem: { select: { id: true, title: true } } },
orderBy: { createdAt: 'desc' }
```

**Frontend:** Add a "Recent Submissions" card showing the last 4 entries with status icon, problem title (linked to `/problem/:id`), language, and relative time.

---

### 25. Profile — playlist section is a bland table
**File:** `frontend/src/page/Profile.jsx`
**Problem:** Playlists render as a plain data table with no visual appeal and no solved-per-playlist count.
**Fix:** Replace with a responsive card grid. Each card shows name, description (line-clamp), problem count, solved count (cross-referenced client-side from `solvedProblems`), and icon-only action buttons.

```js
const solvedInPlaylist = (playlist) =>
  playlist.problem.filter(p =>
    solvedProblems.some(s => s.problemId === p.problemId)
  ).length;
```

Also fix the `description.slice()` that always appends `…` even for short text:
```js
desc.length > 80 ? desc.slice(0, 80) + "…" : desc
```

---

### 26. Profile — password change has no validation
**File:** `frontend/src/page/Profile.jsx`
**Problem:** The inline password change fires the API with no client-side checks.
**Fix:** Add `oldPassword`, `newPassword`, `confirmNewPassword` fields. Validate min length and match before calling the API.

---

### 27. DisplayPlaylistModal — no solved state or difficulty badges
**File:** `frontend/src/components/modals/DisplayPlaylistModal.jsx`
**Problem:** The modal shows only Title / Added At / Remove+View with no solved indicator or difficulty.
**Also:** Uses stale `selectedProblemId` state (same class of bug as the delete fix).

**Fix:**
- Pull `solvedProblems` directly from `useProblemStore` inside the modal (no prop threading).
- Add summary bar: `N problems · N solved · X Easy · X Medium · X Hard`.
- Table columns: solved indicator (✅/⬜), title (click → navigate + close), difficulty badge, icon-only remove.
- Fix stale state: pass `problemId` directly to `removeProblemFromPlaylist`, don't store it in state first.
- Cap modal width to `max-w-2xl` (current `mx-[10%]` is too wide on large screens).

---

### 28. Companies tab on ProblemPage (data not displaying)
**File:** `frontend/src/page/ProblemPage.jsx`

**Root cause:** `problem.companies` stores raw `companyId` UUIDs. The description tab's "Asked at" section filters by `companyMap.has(entry.companyId)`. If `companyId`s in the problem JSON don't match the `Company` table, the section renders nothing silently.

**Fix:**
1. Verify existing problems have valid `companyId`s matching `GET /api/v1/companies`.
2. Move company info out of the description tab into a dedicated **Companies** tab (5th tab, `Building2` icon).
3. Show a count badge on the tab when data exists: `<span className="badge badge-primary badge-xs">{n}</span>`.
4. Show "No company data available" instead of empty space when the array is empty.
5. Fix `default: break` in `renderTabContent` (returns `undefined`) → return a fallback element.

No backend changes needed — `GET /api/v1/companies` and the problem `companies` field are already implemented.
