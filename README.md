# AI Study Buddy

A web-based study assistant for computer science students.
**Backend:** Python + Flask
**Frontend:** React, Vite, Tailwind CSS

---

## Table of Contents

* [Features](#features)
* [Project Structure](#project-structure)
* [Quick Start](#quick-start)

  * [1. Clone](#1-clone)
  * [2. Backend Setup](#2-backend-setup)
  * [3. Frontend Setup](#3-frontend-setup)
* [Environment Variables](#environment-variables)
* [License](#license)
* [Contributing](#contributing)

---

## Features

* **Chat Interface** powered by the OpenAI API
* **Practice Problems** loader & evaluator with "gold" reference solutions
* **Topic Browser** with YAML-driven topic list
* **Clean UI** built in React + Tailwind CSS

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

# Copy example env and fill in your keys:
cp .env.example .env

# Start the backend:
./run.sh
# or: python app.py
```

The backend API will be available at `http://localhost:5000/`.

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
