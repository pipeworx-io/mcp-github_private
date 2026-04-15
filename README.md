# mcp-github_private

GitHub Private MCP Pack — access private repos, org data via OAuth.

Part of the [Pipeworx](https://pipeworx.io) open MCP gateway.

## Tools

| Tool | Description |
|------|-------------|
| `gh_list_repos` | List your repositories (including private ones). |
| `gh_get_repo` | Get repository details (works for private repos you have access to). |
| `gh_list_issues` | List issues for a repository. |
| `gh_list_pulls` | List pull requests for a repository. |
| `gh_list_orgs` | List organizations you belong to. |
| `gh_get_file` | Get file contents from a repository. |

## Quick Start

Add to your MCP client config:

```json
{
  "mcpServers": {
    "github_private": {
      "url": "https://gateway.pipeworx.io/github_private/mcp"
    }
  }
}
```

Or use the CLI:

```bash
npx pipeworx use github_private
```

## License

MIT
