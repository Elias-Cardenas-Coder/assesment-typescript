# TechNova Dashboard

## Project Overview

TechNova Dashboard is a modern, responsive web application for managing a catalog of technology products. It provides a clean and intuitive user interface for performing CRUD (Create, Read, Update, Delete) operations on a product list. The application is built entirely on the frontend, using Mock Service Worker (MSW) to simulate a backend API, and stores data persistently in the browser's `localStorage`.

This project serves as an excellent example of a modern frontend application built with React, TypeScript, and Vite, demonstrating best practices in component structure, routing, and state management.

## Features

- **Product Management:** Full CRUD functionality for managing tech products.
- **Persistent Storage:** Product data is saved in `localStorage`, so it persists across page reloads.
- **Responsive Design:** A clean and modern UI that works seamlessly on both desktop and mobile devices.
- **Search and Pagination:** Easily search the product catalog and navigate through pages.
- **Dark/Light Mode:** Theme toggling for user preference.
- **Mocked API:** Utilizes MSW to simulate a real backend, allowing for independent frontend development.

## Tech Stack

- **Framework:** [React](https://reactjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **API Mocking:** [Mock Service Worker (MSW)](https://mswjs.io/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.x or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

### Running the Application

To run the application in development mode with the mock server enabled, use the following command:

```sh
npm run dev
```

This will start the Vite development server, and you can view the application at `http://localhost:5173`.
