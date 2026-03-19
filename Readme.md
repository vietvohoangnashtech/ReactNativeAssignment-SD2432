# My Full-Stack Demo App

This repository contains a demo full-stack application built with a NestJS API backend and a React Native mobile frontend. It demonstrates core authentication, data fetching, and state management concepts.

## Features

### Mobile App

*   **Secure Login & Registration:** Users can create new accounts or log in securely using username and password.
*   **Automatic Theme:** The app adapts to your system's light or dark mode automatically.
*   **Home Tab:** Displays a list of available products.
*   **Profile Tab:** View your profile details, and edit your full name and email address.
*   **Secure Data**: Your password and auth token are stored securely in your mobile device.
*   **Tab Navigation**: Easy to navigate between Home and Profile tabs.

### API

*   **User Authentication:** Uses JWT for secure authentication.
*   **Profile Management:** Allows logged-in users to view and update their profile.
*   **Product Listing:** Provides a list of available products for logged-in users.
*   **Secure:** Password are stored as hash, and JWT is used for authorization.
*   **SQLite**: Use SQLite database as database.

## How to Use

1.  **Clone the repository:**
    ```
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```
    npm install
    ```

3.  **Start the applications:**

    *   Run the following command from the project root:
        ```
        npm run dev
        ```
        * This single command will start the API server with hot reload and also start your react native mobile metro bundler

4.  **API Development (Backend only)**

      * You can start the api server only using command:
             ```
             npm run server
             ```

5.  **Mobile App Development (Frontend only)**

     *  You can start the react native using command:
             ```
             npm run mobile
             ```
        *   This will start the metro bundler server for your react native app.

6.  **Access the applications:**
    *   **API:** The API is accessible through `http://10.0.2.2:3000` (for android avd or `localhost:3000` for web).
    *  **Mobile app**:
          * Connect using a simulator or real device.
          *  For web app, use your browser to access that by using address specified in your terminal.

**Additional Notes**

*   **Environment:** For the API, you can create a `.env` file for sensitive configurations (e.g., JWT secret, database credentials).
*   **Dependencies:** Ensure that all dependencies in both the API and the mobile app are installed by using `npm install` in the root of project.
*   **Debugging:** The API can be debugged using browser's development tools. Mobile can be debugged using chrome debugger or React Native Debugger.
*   **Database:** The API uses SQLite database, that can be accessed using CLI or GUI tool, make sure that the database file is in `/apps/api/db.sqlite` if you are accessing with CLI.
* **Proxy**: If you are using proxy in simulator or device, make sure that is configured to work with api server address.

This README provides clear and concise instructions for setting up and using your project. Let me know if you have any specific additions you want to make!