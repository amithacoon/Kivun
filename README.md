# Kivun - Smart BiDi Fixer

Professional tool for correcting bidirectional text layout issues in Hebrew and English documents.

## Running Locally (Standalone)

This project is a complete React application. To run it locally on your machine:

### Prerequisites
- Node.js (v18 or higher)
- npm (comes with Node.js)

### Installation

1. Unzip the package (if downloaded as ZIP).
2. Open a terminal in the project folder.
3. Install dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the local development server:
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### Building for Production

To create a production build:
```bash
npm run build
```
The output will be in the `dist` folder.

## Project Structure

- `index.html` - Entry HTML
- `index.tsx` - Entry TypeScript/React file
- `App.tsx` - Main Application component
- `components/` - UI Components
- `constants.ts` - Shared constants and C implementation
