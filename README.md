# Llama 3 Model Comparison Tool

A TypeScript-based LLM comparison tool for evaluating and selecting Llama 3 models, featuring direct integration with HuggingFace's model repository and Together AI services.

![Llama 3 Finetune Finder](public/Team_Llama.jpg)

## Features

- 🔍 Model search capabilities with automated search term generation
- 🤖 Direct integration with HuggingFace model repository
- 🔄 Together AI feature summarization
- 🌐 Brave Search API integration
- 📊 Performance metrics and comparison tables
- 💾 PostgreSQL-based caching system with TTL
- ⚡ Parallel execution for model updates
- 🔒 API rate limiting

## Tech Stack

- **Frontend**:
  - TypeScript
  - React
  - SWR for data fetching
  - Tailwind CSS for styling
  - Radix UI components

- **Backend**:
  - TypeScript
  - PostgreSQL for data storage
  - HuggingFace API integration
  - Together AI integration
  - Brave Search API

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd llama3-comparison-tool
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with the following variables:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/llama3_db
HUGGINGFACE_API_KEY=your_huggingface_key
TOGETHER_AI_KEY=your_together_ai_key
BRAVE_SEARCH_API_KEY=your_brave_search_key
```

4. Start the development server:
```bash
npm run dev
```

## Usage

1. Navigate to the homepage
2. Enter your search query in the search box
3. View comparison results for:
   - Llama 3 based models
   - Alternative models
   - Related sources and documentation

## Development

### Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── types/
│   │   └── lib/
├── server/
├── db/
└── public/
```

### Core Components

- `ComparisonTable`: Displays model comparison data
- `SearchBox`: Handles user search queries
- `SourcesList`: Shows related documentation and sources
- `HomePage`: Main application page with search and results

### Database Schema

The application uses PostgreSQL for data storage with automatic cache invalidation and TTL support.

### API Integration

- HuggingFace API for model repository access
- Together AI for feature summarization
- Brave Search API for related content

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
