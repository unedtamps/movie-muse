# Movie Muse

Movie Muse is a web application that provides personalized movie recommendations. Users can get recommendations based on their Letterboxd username or by providing a list of seed movies.

## Features

-   **Personalized Recommendations**: Get movie recommendations based on your Letterboxd username.
-   **Seed-based Recommendations**: Get movie recommendations based on a list of seed movies.
-   **Movie Details**: View detailed information about each recommended movie.
-   **Random Pick**: Let the application pick a random movie for you from the recommendations.
-   **Responsive Design**: The application is designed to work on both desktop and mobile devices.

## Tech Stack

-   **Framework**: [React](https://reactjs.org/)
-   **Build Tool**: [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
-   **Routing**: [React Router](https://reactrouter.com/)
-   **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
-   **Data Fetching**: [React Query](https://tanstack.com/query/latest)
-   **Linting**: [ESLint](https://eslint.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)

## Project Structure

The project is structured as follows:

-   `src/components`: Contains the UI components, with `ui` being the shadcn/ui components.
-   `src/hooks`: Contains custom hooks.
-   `src/lib`: Contains the API client and utility functions.
-   `src/pages`: Contains the different pages of the application.
-   `src/stores`: Contains the Zustand stores.
-   `src/types`: Contains the TypeScript types.

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   [Node.js](https://nodejs.org/) (version 18 or higher)
-   [npm](https://www.npmjs.com/) 

### Installation

1.  Clone the repo
    ```sh
    git clone https://github.com/unedtamps/movie-muse.git
    ```
2.  Install NPM packages
    ```sh
    npm install
    ```
3.  Start the development server
    ```sh
    npm run dev
    ```

## API

The application uses the [Movie-API](https://github.com/unedtamps/api-movie-muse) to fetch movie data and recommendations. Make sure the API is running locally on port `5000`.

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".

Don't forget to give the project a star! Thanks again!
