# mcp-github_private

GitHub Private MCP Pack — access private repos, org data via OAuth.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 673+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `gh_list_repos` | List all your repositories including private ones. Returns repo names, URLs, descriptions, language, stars, and last update time. |
| `gh_get_repo` | Get detailed info for a specific repository. Returns description, language, stars, forks, open issues, default branch, and access level. |
| `gh_list_issues` | List issues in a repository. Specify owner and repo name (e.g., owner=\'octocat\', repo=\'Hello-World\'). Returns titles, numbers, status, assignees, and labels. |
| `gh_list_pulls` | List pull requests in a repository. Specify owner and repo name (e.g., owner=\'octocat\', repo=\'Hello-World\'). Returns titles, numbers, status, reviewers, and merge state. |
| `gh_list_orgs` | List organizations you\'re a member of. Returns org names, URLs, and your role (owner, member, etc.). |
| `gh_get_file` | Get file contents from a repository. Specify owner, repo name, and file path (e.g., \'README.md\'). Returns raw content and metadata. |

## Quick Start

Add to your MCP client (Claude Desktop, Cursor, Windsurf, etc.):

```json
{
  "mcpServers": {
    "github_private": {
      "url": "https://gateway.pipeworx.io/github_private/mcp"
    }
  }
}
```

Or connect to the full Pipeworx gateway for access to all 673+ data sources:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English:

```
ask_pipeworx({ question: "your question about Github_private data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [All tools and guides](https://github.com/pipeworx-io/examples)
- [pipeworx.io](https://pipeworx.io)

## License

MIT
