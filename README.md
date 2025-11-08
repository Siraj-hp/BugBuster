# 🐞 BugBuster - Debug Challenge Platform
This is a web-based coding exam portal designed and developed for a college tech event. It allowed **30+ students** to debug Python code snippets in a **timed, real-test environment**.

The project was built as a **personal initiative** using **AI tools (ChatGPT, GitHub Copilot)** for accelerated code generation and debugging. It was independently developed, tested, and deployed on **Vercel**.

---

## Key Achievements

**Successfully Deployed**  
The platform was used by 30+ students during the college tech event, performing stably and reliably.

**Automated Evaluation**  
The app's logic for auto-result generation significantly improved evaluation speed and reduced manual checking effort for event organizers.

**Faculty Recognition**  
Recognized by faculty for independent project execution and innovation in automating coding assessments.

---

## Core Features (Participant Portal)

**Timed Challenge:**  
A 10-minute (600-second) timer tracks the entire session, replicating a high-pressure test environment.

**Python Debugging:**  
Participants navigate through 5 different Python challenges, fixing bugs directly in a simple in-browser code editor.

**Session Persistence:**  
The platform uses browser **localStorage** to save all code edits, scores, and time remaining. This allows users to refresh the page without losing their progress.

**Instant Scoring:**  
A "Submit Solution" button simulates execution and provides immediate feedback. It scores the user based on how many predefined solution patterns are present in their fixed code.

**Screenshot Results:**  
A final results page shows a full score breakdown by challenge and total time spent. This page can be downloaded as a PNG screenshot using **html2canvas**.

---

## Tech Stack

- **Framework:** Next.js 15 (which includes React 19)  
- **Language:** TypeScript  
- **Styling:** Tailwind CSS  
- **UI Components:** shadcn/ui (using Radix UI & Lucide React)  
- **Data Storage:** Browser localStorage (This project is serverless and has no database)  
- **Utilities:** html2canvas (for screenshots)  
- **Development:** AI Tools (ChatGPT, GitHub Copilot)  
- **Deployment:** Vercel  

---

## Future Plans

This project was built quickly for an event. The next steps are to make it a more robust, full-stack application:

- **Implement a Proper Database:** Replace localStorage with a real database (like Supabase or Firebase) to track user progress centrally.  
- **Live Code Execution:** Integrate a real Python interpreter (like Pyodide) to execute code safely in the browser, rather than just checking for solution patterns.  
- **Build Admin Portal:** Create the full admin dashboard (which was planned but not fully implemented) to allow non-technical users to create, update, and manage challenges.  

---

## How to Run

**Clone the repository:**

```bash
clone the repo: 
command: git clone <repository-url>

Navigate to the project directory:
command: cd <project-directory>

Install dependencies (using --legacy-peer-deps is recommended):
command: npm install --legacy-peer-deps

Run the development server:
npm run dev

The application will be available at:
http://localhost:3000
````

👤 Author

Mohammed Abdul Ghani Siraj
