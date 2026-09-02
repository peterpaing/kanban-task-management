# Kanban Task Management App

A responsive Kanban task-management app built with Next.js, TypeScript, and Tailwind CSS.

Create boards, organize tasks into columns, manage subtasks, and switch between light and dark mode. Board data is stored locally in the browser.

## Preview


## Features

- Create, edit, and delete boards
- Prevent deleting the final board
- Add default Todo and Doing columns to new boards
- Create, edit, move, and delete tasks
- Add descriptions and subtasks to tasks
- Mark subtasks as complete
- Move tasks between columns from the task status selector
- Keep tasks safe when columns are renamed or deleted
- Create unique URL slugs for boards
- Show a not-found state for invalid or deleted board URLs
- Light and dark mode
- Responsive mobile, tablet, and desktop layouts
- Keyboard-friendly modals: Escape closing, focus trapping, and visible focus styles
- Safe local-storage handling and automatic migration of old saved data

## Built With

- Next.js
- React
- TypeScript
- Tailwind CSS
- React Icons

## Getting Started

Clone the repository:

```bash
git clone https://github.com/peterpaing/kanban-task-management.git
```

Open the project folder:

```bash
cd kanban-task-management
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev
```

Starts the local development server.

```bash
npm run lint
```

Checks the project for linting problems.

```bash
npm run build
```

Creates an optimized production build.

## Data Storage

Board data is saved in browser local storage under the following key:

```text
kanban-boards-v2
```

The app validates saved data and migrates earlier board data that used column names into the current column-ID structure.

## Design

The project is based on the Kanban Task Management Web App design challenge from Frontend Mentor.

## Links

- Repository: `https://github.com/peterpaing/kanban-task-management.git`


## Author

Your Name
