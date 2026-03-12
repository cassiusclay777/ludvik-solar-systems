---
description: "Connect to OpenCode Zen for curated, tested models"
---

# OpenCode Zen – Curated Models

OpenCode Zen provides access to a curated selection of high-quality, tested AI models through a unified API.

## Connection Status

Your OpenCode Zen credentials are already configured. You can verify with:

```bash
opencode auth list
```

## Available Models

List all OpenCode Zen models:

```bash
opencode models opencode
```

### Recommended Models for Web Development

| Model | Description | Cost (input/output) | Best for |
|-------|-------------|---------------------|----------|
| `opencode/gpt-5.2-codex` | GPT-5.2 specialized for coding | $1.75 / $14 per 1M tokens | Code generation, refactoring |
| `opencode/claude-sonnet-4-6` | Claude Sonnet 4.6 with reasoning | $3 / $15 per 1M tokens | Content writing, analysis |
| `opencode/gemini-3-flash` | Fast, multimodal, cost-effective | $0.5 / $3 per 1M tokens | General tasks, quick iterations |
| `opencode/gpt-5-nano` | Free tier GPT-5 variant | $0 / $0 | Testing, simple queries |
| `opencode/claude-haiku-4-5` | Fast Claude model with reasoning | $1 / $5 per 1M tokens | Quick analysis, summaries |

View detailed capabilities and costs:

```bash
opencode models opencode --verbose
```

## Usage

### Start a new session with a Zen model

```bash
opencode -m opencode/gpt-5.2-codex
```

### Run a single command

```bash
opencode run -m opencode/claude-sonnet-4-6 "Write a product description for solar panels"
```

### Set default model (environment variable)

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, or PowerShell profile):

```bash
export OPENCODE_MODEL="opencode/gpt-5.2-codex"
```

### Use in OpenWork agents

You can create a custom agent that uses a specific Zen model. See `.opencode/agent/` for examples.

## Refresh Model Cache

If new models are added, refresh the local cache:

```bash
opencode models --refresh
```

## Troubleshooting

- **Authentication errors**: Run `opencode auth login` and follow prompts.
- **Model not found**: Ensure you have the latest OpenCode version: `opencode upgrade`.
- **Connection issues**: Check your internet connection and API key permissions.

## Further Reading

- [OpenCode Zen Documentation](https://opencode.ai/zen)
- [Model capabilities and pricing](https://opencode.ai/models)
- [OpenCode CLI reference](https://opencode.ai/docs/cli)