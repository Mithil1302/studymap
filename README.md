# StudyMap

StudyMap is an interactive learning tool that combines a concept map (Learning Map) with a mock AI tutor to help users master new topics. The application allows users to explore lectures, visualize their progress through a graph-based curriculum, and engage with a simulated AI tutor that streams contextual responses.

## Features

- **Concept Map (Learning Map):** Visualize your learning journey through an interactive graph of topics. See what you've completed, what's in progress, and what's available next.
- **AI Tutor Integration:** Interact with a simulated AI tutor in the Conversation interface. The tutor can provide explanations and reference specific lectures or slides.
- **Mock Streaming API:** A realistic mock streaming service for the AI tutor that behaves like a real LLM endpoint (tokens arrive gradually, handles errors mid-stream), without requiring any API keys.
- **Local Progress Tracking:** Your progress through the curriculum and your conversation history are seamlessly saved to your browser's `localStorage`, allowing you to pick up right where you left off.

## Getting Started

This project is built using React and Vite.

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository and navigate into the project directory:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Run linting:
   ```bash
   npm run lint
   ```

## Mock Streaming Tutor

The project includes a mock streaming endpoint to simulate an AI tutor's responses (`data/mock-stream.mjs`). It streams canned responses from `responses.json` chunk by chunk with realistic timing.

- **No API Keys Needed:** The tutor runs entirely locally.
- **Realistic Behavior:** It simulates network delays, token-by-token generation, and even connection drops mid-stream (e.g., the 'error-midstream' scenario) to test UI resilience.
- **Usage:** In the application, you can interact with the chat interface. Depending on the keywords in your prompt, different predefined scenarios from `responses.json` are triggered, mapping your inquiry to the appropriate mock stream.

## Progress Tracking & Storage

StudyMap persists user data completely client-side.
- **Conversations:** Chat history and active streams are saved to `localStorage` under `studymap_conversations` / `studymap_active_id`.
- **Progress Map:** Completed nodes and in-progress topics are saved to `localStorage` under `studymap_progress` / `studymap_in_progress`.

If you wish to reset your state, you can clear the browser's local storage for this site or use the built-in reset functionality (if exposed in the UI).
