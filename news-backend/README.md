# News Backend System

This is a complete backend system for a News Application, built with Node.js, Express, MongoDB, and Prisma.
It provides authentication, user management, news article management (CMS), categories, comments, and a personalized "For You" feed.

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas connection string)

### Installation
1.  Navigate to the directory:
    ```bash
    cd news-backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Setup Environment Variables:
    -   Copy `.env.example` to `.env`.
    -   Update `DATABASE_URL` with your MongoDB connection string.
    -   Update `JWT_SECRET` with a secure secret key.

4.  Generate Prisma Client:
    ```bash
    npx prisma generate
    ```

5.  Run the Server:
    ```bash
    # Development
    npm run dev
    
    # Production
    npm start
    ```

## API Documentation

### Authentication
-   **POST** `/api/auth/register`
    -   Body: `{ name, email, password, role? }`
    -   Returns: Token + User Info.
-   **POST** `/api/auth/login`
    -   Body: `{ email, password }`
    -   Returns: Token + User Info.

### Users
-   **GET** `/api/users/profile` (Auth Required)
    -   Returns current user profile.
-   **PUT** `/api/users/profile` (Auth Required)
    -   Body: `{ name, email, preferences: { categories: [id], topics: [string] } }`
    -   Updates profile and preferences.
-   **GET** `/api/users` (Admin Only)
    -   Returns all users.

### News (Articles)
-   **GET** `/api/news`
    -   Query: `?category=ID&keyword=Search&page=1`
    -   Returns paginated articles.
-   **GET** `/api/news/feed` (Auth Required)
    -   Returns personalized articles based on user preferences.
-   **GET** `/api/news/:id`
    -   Returns single article details + comments.
-   **POST** `/api/news` (Admin Only)
    -   Body: `{ title, content, categoryId, tags: [], image, status }`
-   **PUT** `/api/news/:id` (Admin Only)
    -   Update article.
-   **DELETE** `/api/news/:id` (Admin Only)
    -   Delete article.

### Categories
-   **GET** `/api/categories`
    -   Returns all categories.
-   **POST** `/api/categories` (Admin Only)
    -   Body: `{ name }`
-   **DELETE** `/api/categories/:id` (Admin Only)

### Comments
-   **POST** `/api/comments` (Auth Required)
    -   Body: `{ content, articleId, parentId? }`
    -   Add a comment or reply.
-   **DELETE** `/api/comments/:id` (Auth Required)
    -   Delete own comment.

## Integration Guide (React / Frontend)

### Authentication
1.  **Login/Register**: Call `/api/auth/login`. Store the returned `token` in `localStorage` or SecureStore.
2.  **Authorized Requests**: For any endpoint marked (Auth Required), add the header:
    ```javascript
    headers: {
      Authorization: `Bearer ${token}`
    }
    ```

### "For You" Feed
-   Call **GET** `/api/news/feed` with the auth token.
-   The backend uses the user's stored `preferences` (categories/topics) to filter articles.
-   To update what the user sees, create a settings page that calls **PUT** `/api/users/profile` with updated `preferences`.

### Interactions
-   **Comments**: Use the threaded structure. The comment object has `replies` (if fetched via `include` in specific queries) or filter by `parentId` on client if structure differs. NOTE: The current `getNewsById` returns top-level comments with one level of nested replies.
