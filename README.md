# Campus-Fix

Campus Fix is a web app where students/staff can report campus issues (for example: broken seats, AC not working).

## Features
- Users can submit campus issues with title, description, and location.
- AI-style severity classification into **low**, **medium**, or **high**.
- Manager dashboard to update issue status to **under process** or **resolved**.
- Real-time updates using Socket.IO.

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   npm start
   ```
3. Open `http://localhost:3000`.

## Test
```bash
npm test
```
