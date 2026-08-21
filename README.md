# Rating Everything (EoVi)

The app functions like a small social network where only your friends can see your posts and your ratings of places, food, books, and many other things — helping each other discover better experiences.

##  Key Features

*   **Complete Authentication**: Signup, login, and logout functionality with secure user sessions using JWT.
*   **Infinite Loading**: Performance-optimized content loading.
*   **Interactive Features**: Create, view, and delete recommendations (e.g., books, places, food).
*   **Media Handling**: Upload and share cover images and photos.
*   **Profile Management**: View your posts and manage profile information.
*   **Confirmation Alerts**: User-friendly deletion confirmations.

##  Tech Stack

###  Frontend (Mobile App)
*   **Framework**: [React Native](https://reactnative.dev/) (v0.79) & [Expo](https://expo.dev/) (v53)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) & [React Navigation](https://reactnavigation.org/)
*   **Local Storage**: [@react-native-async-storage/async-storage](https://react-native-async-storage.github.io/async-storage/) for secure local data caching.
*   **UI & Animations**: 
    *   `react-native-reanimated` & `react-native-gesture-handler` for smooth animations and gesture handling.
    *   `expo-image` & `expo-image-picker` for optimized image rendering and media selection.
    *   `@expo/vector-icons` for scalable iconography.
*   **Language**: TypeScript

###  Backend (API Server)
*   **Runtime & Framework**: [Node.js](https://nodejs.org/) with [Express.js](https://expressjs.com/) (v5.1)
*   **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) (Object Data Modeling)
*   **Authentication & Security**:
    *   [JSON Web Tokens (jsonwebtoken)](https://jwt.io/) for secure API authorization.
    *   `bcryptjs` for password hashing.
    *   `cors` for Cross-Origin Resource Sharing.
*   **Media Storage**: [Cloudinary](https://cloudinary.com/) integration for seamless image uploading and hosting.
*   **Other Tools**: `dotenv` for environment variable management, `cron` for background tasks scheduling.

##  Getting Started

### Prerequisites
*   Node.js installed
*   Expo Go app on your physical device (or Android Studio / Xcode for emulators)
*   MongoDB database connection URI
*   Cloudinary API credentials

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/Romfff/react-native-EoVi.git
    cd react-native-EoVi
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    # Create a .env file and add your MongoDB URI, JWT Secret, and Cloudinary credentials
    npm run dev
    ```

3.  **Setup Mobile App**
    ```bash
    cd ../mobile
    npm install
    # Make sure to configure your API URL to point to your backend server
    npm start
    ```
