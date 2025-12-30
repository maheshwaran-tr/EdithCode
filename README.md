# 🤖 Edith Code

An Agentic AI system that transforms natural language requirements into fully functional code projects. Built with LangGraph and powered by advanced LLMs, this system orchestrates three specialized agents to plan, architect, and implement your ideas.

[![Python 3.8+](https://img.shields.io/badge/python-3.8+-blue.svg)](https://www.python.org/downloads/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![LangChain](https://img.shields.io/badge/LangChain-🦜-green)](https://github.com/langchain-ai/langchain)

## ✨ Features

- **🎯 Natural Language Input**: Describe what you want to build in plain English
- **🧠 Multi-Agent Architecture**: Three specialized agents work together seamlessly
  - **Planner**: Breaks down requirements into high-level steps
  - **Architect**: Designs detailed implementation plans
  - **Coder**: Executes the plan and writes actual code
- **🔄 Iterative Development**: Agents work in a loop until completion
- **📁 File Management**: Automatic file reading, writing, and organization
- **🛡️ Robust Error Handling**: Built-in retry logic and graceful failure recovery
- **📊 Comprehensive Logging**: Detailed logs for debugging and monitoring

## 🏗️ Architecture

```
┌─────────────────┐
│  User Prompt    │
└────────┬────────┘
         │
         ▼
    ┌────────┐
    │Planner │  Creates high-level plan
    └───┬────┘
        │
        ▼
   ┌─────────┐
   │Architect│  Designs implementation steps
   └────┬────┘
        │
        ▼
    ┌───────┐
    │ Coder │ ──┐ Executes step-by-step
    └───┬───┘   │ (loops until complete)
        │       │
        └───────┘
        │
        ▼
   ┌─────────┐
   │  Output │
   └─────────┘
```

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- GROQ API key (get one at [groq.com](https://groq.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/agentic-code-generator.git
   cd agentic-code-generator
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   MODEL_NAME=llama-3.3-70b-versatile
   MAX_RETRIES=3
   RECURSION_LIMIT=100
   DEBUG_MODE=false
   ```

4. **Run the application**
   ```bash
   python main.py
   ```

## 📖 Usage

### Basic Example

```python
from main import run_agent

# Simple web app
result = run_agent("Build a simple colourful modern todo app in html css and js")

# Python script
result = run_agent("Create a Python script that scrapes news headlines from a website")

# React component
result = run_agent("Build a React weather widget with API integration")
```

### Command Line

```bash
python main.py
```

The default prompt in `main.py` can be modified to suit your needs.

### Custom Configuration

Modify the `.env` file to customize behavior:

```env
# Use a different model
MODEL_NAME=mixtral-8x7b-32768

# Increase retries for complex tasks
MAX_RETRIES=5

# Allow more recursive calls
RECURSION_LIMIT=150

# Enable detailed debugging
DEBUG_MODE=true
```

## 📁 Project Structure

```
agentic-code-generator/
│
├── main.py                 # Main application entry point
├── prompts.py             # Agent prompts and instructions
├── states.py              # State definitions (Plan, TaskPlan, CoderState)
├── tools.py               # File system tools (read, write, list, etc.)
├── requirements.txt       # Python dependencies
├── .env                   # Environment configuration
├── .env.example          # Example environment file
├── agent_execution.log   # Runtime logs (generated)
│
└── README.md             # This file
```

## 🔧 Configuration Options

| Variable | Description | Default |
|----------|-------------|---------|
| `GROQ_API_KEY` | Your GROQ API key | Required |
| `MODEL_NAME` | LLM model to use | `llama-3.3-70b-versatile` |
| `MAX_RETRIES` | Retry attempts for failed operations | `3` |
| `RECURSION_LIMIT` | Maximum recursive agent calls | `100` |
| `DEBUG_MODE` | Enable verbose logging | `false` |

## 🛠️ Available Tools

The Coder agent has access to these tools:

- **`read_file(path)`**: Read file contents
- **`write_file(path, content)`**: Write content to file
- **`list_files(directory)`**: List files in directory
- **`get_current_directory()`**: Get current working directory

## 📊 Example Outputs

### Input
```
"Build a simple colourful modern todo app in html css and js"
```

### Generated Files
```
output/
├── index.html
├── styles.css
└── script.js
```

The system will create a fully functional, modern todo application with:
- Clean, responsive design
- Add/delete functionality
- Local storage persistence
- Modern CSS styling

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Tool not found" error
- **Solution**: Ensure tools are properly bound to the LLM. This is handled automatically in the latest version.

**Issue**: Parsing errors
- **Solution**: The system includes automatic retry logic with output cleaning. If persistent, try a different model.

**Issue**: API rate limits
- **Solution**: Reduce `RECURSION_LIMIT` or add delays between requests.

### Debug Mode

Enable detailed logging:
```env
DEBUG_MODE=true
```

Check `agent_execution.log` for detailed execution traces.

## 🔒 Security Considerations

⚠️ **Important**: This system can write files to your filesystem. Always:
- Review generated code before executing
- Run in a sandboxed environment for untrusted inputs
- Never expose API keys in code or commits
- Use `.gitignore` to exclude `.env` files

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Setup

```bash
# Install development dependencies
pip install -r requirements-dev.txt

# Run tests
pytest tests/

# Format code
black .

# Lint
flake8 .
```

## 📝 Roadmap

- [ ] Support for more LLM providers (OpenAI, Anthropic)
- [ ] Web interface for easier interaction
- [ ] Template system for common project types
- [ ] Code review agent for quality assurance
- [ ] Integration with version control systems
- [ ] Multi-file project support with dependencies
- [ ] Docker containerization
- [ ] CI/CD pipeline integration

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [LangChain](https://github.com/langchain-ai/langchain) and [LangGraph](https://github.com/langchain-ai/langgraph)
- Powered by [GROQ](https://groq.com) for fast inference
- Inspired by the autonomous agent research community

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/agentic-code-generator/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/agentic-code-generator/discussions)
- **Email**: your.email@example.com

## ⭐ Star History

If you find this project useful, please consider giving it a star! It helps others discover the project.

---

**Made with ❤️ by [Your Name](https://github.com/yourusername)**

*Happy Coding! 🚀*
