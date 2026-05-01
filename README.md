# Blog Post Manager - CRUD with TanStack Query

A React Native (Expo) application demonstrating how to perform full CRUD operations using TanStack Query and the JSONPlaceholder API. Features fetching, creating, updating, patching, deleting, and filtering blog posts.

## Author
- Eric Cashman
- AD312

## Built With
- React Native
- Expo
- JavaScript (ES6+)
- TanStack Query (@tanstack/react-query)
- JSONPlaceholder API (https://jsonplaceholder.typicode.com)

## How to Run

1. Clone the repository:
   git clone https://github.com/Eric-Cashman/crud-query-app.git

2. Navigate into the project folder:
   cd crud-query-app

3. Install dependencies:
   npm install

4. Start the development server:
   npx expo start

5. Run on your device:
   - Scan the QR code with the Expo Go app on your phone
   - Or press 'w' to open in your web browser
   - Or press 'a' for Android emulator
   - Or press 'i' for iOS simulator

## Features

- **Fetch Posts**: Automatically loads all posts from JSONPlaceholder on startup
- **Create Post**: Add new posts with a title and body using a POST request
- **Edit Post**: Fully update a post's title and body using a PUT request
- **Patch Post**: Update only the title of a post using a PATCH request
- **Delete Post**: Remove a post with a confirmation dialog using a DELETE request
- **Filter by User**: Filter posts by User ID (1-10) to see specific user's posts

## Concepts Demonstrated

- useQuery hook for fetching and caching data
- useMutation hook for POST, PUT, PATCH, and DELETE requests
- Query invalidation to refresh data after mutations
- isPending and isError states for handling loading and errors
- Filtering data using dynamic query keys