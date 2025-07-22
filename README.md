# AI Study Buddy

A web-based study assistant for computer science students.

**Frontend**: React + Tailwind CSS + Monaco Editor + fetch API

**Backend**: Flask + Flask‑CORS + OpenAI Python SDK + Judge0 via RapidAPI

**Database**: JSON files (problems.json, problems_gold_code.json) + localStorage for drafts and chat.

---

## Table of Contents

* [Features](#features)
* [Project Structure](#project-structure)
* [Description](#description)
* [Quick Start](#quick-start)

  * [1. Clone](#1-clone)
  * [2. Backend Setup](#2-backend-setup)
  * [3. Frontend Setup](#3-frontend-setup)
* [Environment Variables](#environment-variables)
* [License](#license)
* [Contributing](#contributing)

---

## Features

AI Study Buddy helps students learn and practice computer science by combining:

* **Coding problem**s with live submission & feedback via Judge0.
* **AI‑powered chat tutoring** for on‑demand explanations, hints, and concept discussions.

---

## Description

### 1. Coding Practice Workflow

1. **Metadata & Search**

   * Client loads a lightweight index (`id`, `title`, `topic`, `difficulty`, `keywords`), enabling instant filter/search.

2. **Problem Detail**

   * Fetch full problem data from

     ```
     GET /practice/problems/:id
     ```
   * Displays: statement, samples, function signature placeholder, and a tabbed code editor.

3. **Custom Boilerplates**

   * On load, a helper (`generateBoilerplate`) generates language‑specific stubs for the function signature + `// TODO`.
   * Editors are seeded with these stubs (unless a draft exists in `localStorage`).

4. **Editor UI**

   * Monaco Editor wrapped in a styled card.
   * Tabs to switch between Python, Java, C, and C++.
   * Drafts auto‑saved per‑language per‑problem to `localStorage`, with a **Restart** button to reset.

5. **Submission & Validation**

   * **Fetch wrapper/test harness** via

     ```
     GET /practice/problems/:id/solution/:lang
     ```
   * **Merge** user code into the harness at the placeholder comment.
   * **Submit** to Judge0 (via RapidAPI).
   * **Receive** JSON (`stdout`, `stderr`, `status`), parse for assertion failures.
   * **Display** results inline, indicating which test failed or **Success**.

---

### 2. AI‑Powered Chat Tutor

#### Frontend (`ChatBox.jsx`)

* **History management** using `localStorage` (24‑hour retention):

  * On mount, prune messages older than 24 h and inject the greeting:

    > “I am your AI assistant. Ask me anything!”
  * On update, persist history and auto‑scroll to bottom.
* **Messages** rendered as bubbles:

  * **User** on right (blue); **AI** on left (light gray).
  * Inline code spans (`` `code` ``) and quoted terms (`'term'`) styled via `formatChatResponse`.
  * Typing indicator with animated dots.
* **Input bar**: pill‑shaped input + circular send button.
* **Clear Chat** pill‑button to reset after confirmation.
* **Footer** note: “Chat history is kept for 24 hours.”

#### Backend (`routes/chat_routes.py`)

* **`POST /chat`**

  1. Validates presence of `"query"` in JSON.
  2. Sends to OpenAI with a strict system prompt that:

     * Forces **JSON‑only** replies with keys:

       * `valid` (bool),
       * `reason` (null or string),
       * `topic` (from the defined CS topics list or `"unknown"`),
       * `answer` (concise, code‑focused),
       * `keywords` (array of strings).
  3. Parses the model’s JSON and returns the output as a JSON object.

---

## Project Structure

```
ai_study_buddy/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── run.sh
│   ├── routes/
│   └── services/
├── data/
│   ├── problems_brief.json
│   └── topics.yaml
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── run.sh
│   ├── src/
│   ├── public/
│   └── tailwind.config.js
├── .gitignore
├── LICENSE
└── README.md
```

---

## Quick Start

### 1. Clone

```bash
git clone https://github.com/<your-username>/ai_study_buddy.git
cd ai_study_buddy
```

### 2. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Copy example env and fill in your keys:
```bash
cp .env.example .env
```

Start the backend:
```bash
./run.sh # or: python app.py
```

The backend API will be available at `http://localhost:5050/` (to change this port, go to "__main__" in backend/app.py, and change "port=5050" to your desired port).

### 3. Frontend Setup

```bash
cd frontend
npm install

# Copy example env and fill in your key:
cp .env.local.example .env.local

# Start the development server:
npm run dev
```

The frontend UI will be available at `http://localhost:3000/`.

---

## Environment Variables

Create these files **before** launching the apps:

### `backend/.env.example`

```
OPENAI_API_KEY=
OTHER_SERVICE_KEY=
```

### `frontend/.env.local.example`

```
VITE_RAPIDAPI_KEY=
```

| Variable            | Defined In            | Description                           |
| ------------------- | --------------------- | ------------------------------------- |
| `OPENAI_API_KEY`    | `backend/.env`        | Your OpenAI API key                   |
| `OTHER_SERVICE_KEY` | `backend/.env`        | Any additional service credentials    |
| `VITE_RAPIDAPI_KEY` | `frontend/.env.local` | Your RapidAPI key (for frontend APIs) |

---

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## Contributing

Thank you for your interest in improving AI Study Buddy! Please follow these steps:

1. Fork this repository
2. Create your feature branch:

```bash
git checkout -b feature/MyFeature
```

3. Commit your changes:

```bash
git commit -m "Add MyFeature"
```

4. Push to your fork:

```bash
git push origin feature/MyFeature
```

5. Open a Pull Request against `main`

Please ensure your code is linted, formatted, and any new functionality is covered by tests where possible.
Feel free to open an issue first to discuss major changes or ideas!

---
