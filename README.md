# mcp-github_private

GitHub Private MCP Pack — access private repos, org data via OAuth.

Part of [Pipeworx](https://pipeworx.io) — an MCP gateway connecting AI agents to 1476+ live data sources.

## Tools

| Tool | Description |
|------|-------------|
| `gh_list_repos` | List all your repositories including private ones. Returns repo names, URLs, descriptions, language, stars, and last update time. |
| `gh_get_repo` | Get detailed info for a specific repository. Returns description, language, stars, forks, open issues, default branch, and access level. |
| `gh_list_issues` | List issues in a repository. Specify owner and repo name (e.g., owner='octocat', repo='Hello-World'). Returns titles, numbers, status, assignees, and labels. |
| `gh_list_pulls` | List pull requests in a repository. Specify owner and repo name (e.g., owner='octocat', repo='Hello-World'). Returns titles, numbers, status, reviewers, and merge state. |
| `gh_list_orgs` | List organizations you're a member of. Returns org names, URLs, and your role (owner, member, etc.). |
| `gh_get_file` | Get file contents from a repository. Specify owner, repo name, and file path (e.g., 'README.md'). Returns raw content and metadata. |

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

### What this endpoint actually serves

`tools/list` at `https://gateway.pipeworx.io/github_private/mcp` returns the tools in the table
above **plus the shared Pipeworx meta-tools** — `ask_pipeworx`,
`discover_tools`, `search_within`, `remember`/`recall` and the rest of the
gateway-wide set. So the tool count you see is larger than this table: a
single-pack endpoint currently lists roughly 30 shared tools alongside the
pack's own. The connection's `initialize` response states its exact scope, and
is the authoritative answer for a given day.

This is deliberate, not multiplexing by accident. The meta-tools are what let a
scoped connection answer a question this pack does not cover — via
`ask_pipeworx`, which routes across the whole catalog — without you adding a
second MCP server. There is currently no way to mount a pack endpoint without
them; if the extra schemas cost you more context than the routing is worth,
connect to the full gateway once rather than to several pack endpoints.

Or connect to the full Pipeworx gateway to get every pack's tools listed
directly, instead of just this one's:

```json
{
  "mcpServers": {
    "pipeworx": {
      "url": "https://gateway.pipeworx.io/mcp"
    }
  }
}
```

Both URLs reach the same gateway and the same 1476+ data sources. The
only difference is which pack's tools are listed **directly**; `ask_pipeworx`
reaches all of them from either one.

## Using with ask_pipeworx

Instead of calling tools directly, you can ask questions in plain English —
this works on the pack endpoint above as well as on the full gateway:

```
ask_pipeworx({ question: "your question about Github_private data" })
```

The gateway picks the right tool and fills the arguments automatically.

## More

- [Docs and guides](https://pipeworx.io/docs)
- [pipeworx.io](https://pipeworx.io)

## License

MIT

## No MCP client? Call it over HTTP

This pack runs against a connected github_private account, so it needs a Pipeworx key: sign in at https://pipeworx.io/account, connect github_private, then call `POST https://gateway.pipeworx.io/v1/tools/gh_list_repos` with `Authorization: Bearer <your Pipeworx key>`. Inspect any tool: `GET https://gateway.pipeworx.io/v1/tools/gh_list_repos`. Find one: `POST https://gateway.pipeworx.io/v1/tools/search_packs` with `{"query":"..."}`.
