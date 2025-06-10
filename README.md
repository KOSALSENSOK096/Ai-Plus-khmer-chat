# AI Plus Khmer Chat

基于Gemini AI的柬埔寨语聊天应用

## 功能特点

- 支持柬埔寨语和英语的实时对话
- 集成Google Gemini AI模型
- 支持图片生成功能
- 提供多种交互风格
- 支持技术性和普通用户友好的对话模式

## 技术栈

- Next.js
- TypeScript
- Google Gemini AI API
- Vercel部署

## 本地开发

1. 克隆仓库：
```bash
git clone https://github.com/KOSALSENSOK096/Ai-Plus-khmer-chat.git
```

2. 安装依赖：
```bash
npm install
```

3. 配置环境变量：
创建`.env.local`文件并添加必要的环境变量：
```
GEMINI_API_KEY=your_api_key_here
```

4. 运行开发服务器：
```bash
npm run dev
```

## 在线演示

访问 [https://ai-plus-khmer-chat.vercel.app/](https://ai-plus-khmer-chat.vercel.app/) 查看在线演示。

## 许可证

MIT

<!-- Code Complete Review: 20240815120000 -->
This application is an intelligent chat platform powered by the Gemini API. It features:

- User registration and login (mock authentication).
- Light and Dark theme support with system preference detection.
- User-configurable settings for speech language, theme, and chat confirmation.
- Profile picture upload and display, and user profile information (name, email) updates.
- Real-time chat with the Gemini `gemini-2.5-flash-preview-04-17` model.
- Support for text-based prompts.
- **Premium Feature**: Image uploads (up to 20 images, 10MB total) alongside text prompts.
- **Premium Ultra2 Feature**: Increased image uploads (up to 50 images, 25MB total).
- **Premium Feature**: Voice input (speech-to-text) with English and Khmer language support.
- **Premium Feature**: Google Search grounding for up-to-date information (toggleable per chat).
- Mermaid diagram generation and rendering from AI responses.
- Code block rendering with syntax highlighting hints, copy functionality, and a "Run Code" simulation feature that sends code to the Code Playground.
- Message editing for user inputs.
- Response regeneration for AI outputs.
- Selectable AI Interaction Styles (Default Assistant, Agent, Ask Ask, Manual, SCArchitect) affecting AI persona and system prompt. These can be quickly accessed via a "Persona" button or "Tools" panel in the chat input bar.
- Persistent chat history stored locally in the browser, with features like:
    - Grouping by time (Today, Yesterday, Previous 7 Days, Older).
    - Searching chat history.
    - Renaming and deleting individual conversations.
    - Clearing all chat history (with confirmation).
    - Exporting all chat history as a JSON file.
    - Importing chat history from a compatible JSON file.
- Clean chat interface with a dedicated sidebar for navigation, new chat initiation, and user account management (including settings & logout).
- Pricing page with different user plans: Free, Premium, and **Premium Ultra2**.
- Mock payment and upgrade flow for Premium & Premium Ultra2 plans (simulated via Telegram instructions, mock Stripe, mock Premium Card, or mock Student ID).
- Technical Vocabulary mode to instruct AI for more formal responses (toggleable per chat).
- **Code Playground**: An interactive environment for experimenting with code execution simulation (via AI) and AI-powered code assistance. Its "CodeBot" feature can generate code, analyze existing code, identify issues, suggest/apply corrections, and predict code output. Utilizes `gemini-2.5-flash-preview-04-17` with optimized settings.
- **Image Generator**: A tool for Premium users to generate images from text prompts using the `imagen-3.0-generate-002` model.
- **File Converter**: A suite of utilities including:
    - Simulated PDF to Word (Khmer/English) conversion, focusing on demonstrating format retention concepts (outputs .txt).
    - AI-powered Image to Text extraction, with a focus on Khmer script using `gemini-2.5-flash-preview-04-17`.
    - AI-powered Khmer Text Refiner for cleaning up text (e.g., from PDF copy-paste) using `gemini-2.5-flash-preview-04-17`.

## Setup

1.  **API Key**: This application **critically requires** a valid Google Generative AI API key to function.
    *   The API key **must** be provided via an environment variable named `API_KEY`. The application's `geminiService.ts` is designed to access this key as `process.env.API_KEY`.
    *   **How to set `process.env.API_KEY`**: This variable needs to be present in the environment where the application's JavaScript code executes.
        *   For local development with Node.js based servers (like Vite, Next.js, Create React App), you would typically use a `.env` file at the root of your project:
            ```env
            # .env file
            API_KEY="YOUR_GOOGLE_GENERATIVE_AI_API_KEY"
            ```
            Ensure your development server is configured to load `.env` files (many do by default or with a package like `dotenv`).
        *   For environments that don't use Node.js or `.env` files (e.g., simple static hosting or specific deployment platforms), you'll need to ensure `API_KEY` is set as an environment variable through your hosting provider's interface or your server's configuration.
        *   **Do NOT hardcode your API key directly into the application's source code (`.ts`, `.js`, `.html` files).**
    *   **Consequences of Missing/Invalid API Key**: If the `API_KEY` is missing, invalid, or if the AI service cannot be reached (e.g., due to network issues or service outages), the chat functionality **will be unavailable**. The application will log critical errors to the browser's developer console, and a message will appear in the chat interface indicating that the AI chat session could not be initialized. The Code Playground and other AI-dependent features will also indicate service unavailability.

2.  **Run**: Open `index.html` in a modern web browser that supports ES modules and the Web Speech API (for voice input features).

## Current Status

As of the latest review (Timestamp: 20240815120000), the application's core features, as detailed above, are fully implemented and operational according to the designed specifications. This includes the ChatPage, CodePlaygroundPage (with CodeBot), ImageGeneratorPage, FileConverterPage, and all related AI interactions and UI components. All options, functions, and buttons are intended to function as described. The system adheres to the provided Gemini API guidelines (including model usage and `thinkingConfig` application) and is considered "code complete."
