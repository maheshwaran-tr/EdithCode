# Colorful Modern Todo App

## Description
A sleek, responsive, and colorful Todo application built with plain **HTML**, **CSS**, and **JavaScript**. It provides a clean UI for managing tasks with features such as adding, editing, completing, deleting, filtering, and clearing completed tasks. All data is persisted in the browser's `localStorage`, so your tasks remain intact across page reloads.

---

## Demo
![Todo App Demo](https://raw.githubusercontent.com/your-repo/your-project/main/demo.gif)
> *A quick GIF showcasing adding, editing, completing, filtering, and clearing tasks.*

---

## Tech Stack
- **HTML5** – Structure of the app (`index.html`).
- **CSS3** – Styling and animations (`styles.css`).
- **JavaScript (ES6)** – Core logic, DOM manipulation, and data persistence (`app.js`).

---

## Features
- **Add tasks** – Type a task and press **Enter** or click the add button.
- **Edit tasks** – Double‑click a task to edit its text inline.
- **Complete tasks** – Click the checkbox to toggle completion.
- **Delete tasks** – Click the trash icon to remove a task.
- **Filter view** – Switch between **All**, **Active**, and **Completed** tasks.
- **Clear completed** – One‑click removal of all completed tasks.
- **Persisted data** – All tasks are saved to `localStorage` and restored on page load.
- **Responsive design** – Works on mobile, tablet, and desktop screens.
- **Colorful UI** – Bright, modern color palette with smooth transitions.

---

## Getting Started
### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari, etc.). No server or build tools are required.

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```
2. **Open the app**
   - Locate the `index.html` file in the project root.
   - Double‑click `index.html` or open it via your browser (`File → Open`).
   - The app will load instantly; no additional setup is needed.

---

## Usage
1. **Add a task**
   - Type your task description into the input field at the top.
   - Press **Enter** or click the **+** button.
2. **Edit a task**
   - Double‑click the task text.
   - Modify the text and press **Enter** or click outside to save.
3. **Complete a task**
   - Click the checkbox next to the task. Completed tasks receive a strikethrough style.
4. **Delete a task**
   - Click the trash‑can icon on the right side of a task.
5. **Filter tasks**
   - Use the **All**, **Active**, and **Completed** buttons at the bottom to switch views.
6. **Clear completed tasks**
   - Click the **Clear Completed** button to remove all tasks marked as completed.

---

## Architecture Overview
The project consists of three core files that work together:

| File | Purpose |
|------|---------|
| `index.html` | Provides the markup structure, linking to `styles.css` and `app.js`. It defines the input field, task list container, and control buttons.
| `styles.css` | Contains all visual styling, layout rules, and responsive media queries. It gives the app its colorful, modern look.
| `app.js` | Handles all interactive behavior: adding, editing, toggling completion, deleting, filtering, clearing, and persisting tasks via `localStorage`. It binds event listeners to the DOM elements defined in `index.html`.

**Data Persistence** – Tasks are stored as a JSON string in `localStorage` under the key `todos`. On page load, `app.js` reads this data, rebuilds the UI, and keeps it synchronized with any subsequent changes.

---

## Contributing
We welcome contributions! Follow these steps to get started:
1. **Fork the repository** on GitHub.
2. **Clone** your fork locally.
3. Create a new branch for your feature or bug‑fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. Make your changes, ensuring code follows the existing style (ES6 syntax, 2‑space indentation, descriptive variable names).
5. Run the app in a browser to verify functionality.
6. Commit your changes with clear messages:
   ```bash
   git commit -m "feat: add dark‑mode toggle"
   ```
7. Push to your fork and open a **Pull Request** against the `main` branch.
8. Ensure your PR description includes:
   - What the change does.
   - Any relevant screenshots or GIFs.
   - Instructions for testing.

---

## License
[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

This project is licensed under the **MIT License** – see the `LICENSE` file for details.
