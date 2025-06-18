# LeetLab 
## Tech Used
### Frontend
- JavaScript
- React-js/ Vite
- Tailwind-css
- Diasy-ui
- Zustand
- Zod and React-Hook-Forms

### Backend
- Node Js
- Express Js
- Postgres
- Prisma
- Jugde 0

## API routes
### - Authentication
- register, 
- login, 
- resetPassword, 
- updatePassword, 
- forgotPassword, 
- verifyUser, 
- resendVerificationEmail, 
- refreshAccessToken, 
- logout
### - Problem Management (for Admin only)
- create-problem,
- update-problem/:id
- get-problem/:id
- get-all-problems
- delete-problem/:id
- get-solved-problem/:id
### - Code-Execution
- Execute-code
### - Submission
- /get-all-submissions
- get-submission/:problemId
- get-submissions-count/:problemId
### - Playlist

## User flow
2 Users:
### Admin
- Creates the problem
(Testcases, CodeSnippet, Reference-Solution)
- Validate each solution against test-cases
- Save the problem in DB

### User
- Get the Problem
- Submit the answer 
(/execute-code)
- Loop through each test-cases
- If fails: Stop
- Else: 
-- Save submission in db
-- Track problem solved already? Update as done in db
-- Show results of each test case
-- Fetch submissions with test cases as well.

### future
- we can check how many testcases are passed.
- run the code and then give submit route.
- agar problem pahle hi solved h to use display krdo
- store execute code status in a ENUM
- Give user the count of how many users has solved the specific problem