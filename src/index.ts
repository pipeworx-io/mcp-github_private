interface McpToolDefinition {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

interface McpToolExport {
  tools: McpToolDefinition[];
  callTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
}

/**
 * GitHub Private MCP Pack — access private repos, org data via OAuth.
 * Complements the existing public github pack with authenticated access.
 */


interface GitHubContext {
  github_private?: { accessToken: string };
}

const API = 'https://api.github.com';

async function ghFetch(ctx: GitHubContext, path: string) {
  if (!ctx.github_private) {
    return { error: 'connection_required', message: 'Connect your GitHub account (private) at https://pipeworx.io/account' };
  }
  const res = await fetch(`${API}${path}`, {
    headers: {
      Authorization: `Bearer ${ctx.github_private.accessToken}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'pipeworx-gateway',
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API error (${res.status}): ${text}`);
  }
  return res.json();
}

const tools: McpToolExport['tools'] = [
  {
    name: 'gh_list_repos',
    description: 'List your repositories (including private ones).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        visibility: { type: 'string', description: 'Filter: all, public, private (default: all)' },
        sort: { type: 'string', description: 'Sort by: created, updated, pushed, full_name' },
        per_page: { type: 'number', description: 'Results per page (max 100)' },
      },
    },
  },
  {
    name: 'gh_get_repo',
    description: 'Get repository details (works for private repos you have access to).',
    inputSchema: {
      type: 'object' as const,
      properties: {
        owner: { type: 'string', description: 'Repository owner' },
        repo: { type: 'string', description: 'Repository name' },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'gh_list_issues',
    description: 'List issues for a repository.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        owner: { type: 'string', description: 'Repository owner' },
        repo: { type: 'string', description: 'Repository name' },
        state: { type: 'string', description: 'Filter: open, closed, all (default: open)' },
        per_page: { type: 'number', description: 'Results per page (max 100)' },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'gh_list_pulls',
    description: 'List pull requests for a repository.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        owner: { type: 'string', description: 'Repository owner' },
        repo: { type: 'string', description: 'Repository name' },
        state: { type: 'string', description: 'Filter: open, closed, all (default: open)' },
        per_page: { type: 'number', description: 'Results per page (max 100)' },
      },
      required: ['owner', 'repo'],
    },
  },
  {
    name: 'gh_list_orgs',
    description: 'List organizations you belong to.',
    inputSchema: { type: 'object' as const, properties: {} },
  },
  {
    name: 'gh_get_file',
    description: 'Get file contents from a repository.',
    inputSchema: {
      type: 'object' as const,
      properties: {
        owner: { type: 'string', description: 'Repository owner' },
        repo: { type: 'string', description: 'Repository name' },
        path: { type: 'string', description: 'File path (e.g., "src/index.ts")' },
        ref: { type: 'string', description: 'Branch or commit SHA (default: default branch)' },
      },
      required: ['owner', 'repo', 'path'],
    },
  },
];

async function callTool(name: string, args: Record<string, unknown>): Promise<unknown> {
  const context = (args._context ?? {}) as GitHubContext;
  delete args._context;

  switch (name) {
    case 'gh_list_repos': {
      const params = new URLSearchParams();
      if (args.visibility) params.set('visibility', args.visibility as string);
      if (args.sort) params.set('sort', args.sort as string);
      if (args.per_page) params.set('per_page', String(args.per_page));
      return ghFetch(context, `/user/repos?${params}`);
    }
    case 'gh_get_repo':
      return ghFetch(context, `/repos/${args.owner}/${args.repo}`);
    case 'gh_list_issues': {
      const params = new URLSearchParams();
      if (args.state) params.set('state', args.state as string);
      if (args.per_page) params.set('per_page', String(args.per_page));
      return ghFetch(context, `/repos/${args.owner}/${args.repo}/issues?${params}`);
    }
    case 'gh_list_pulls': {
      const params = new URLSearchParams();
      if (args.state) params.set('state', args.state as string);
      if (args.per_page) params.set('per_page', String(args.per_page));
      return ghFetch(context, `/repos/${args.owner}/${args.repo}/pulls?${params}`);
    }
    case 'gh_list_orgs':
      return ghFetch(context, '/user/orgs');
    case 'gh_get_file': {
      const ref = args.ref ? `?ref=${encodeURIComponent(args.ref as string)}` : '';
      return ghFetch(context, `/repos/${args.owner}/${args.repo}/contents/${args.path}${ref}`);
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export default { tools, callTool, meter: { credits: 10 }, provider: 'github_private' } satisfies McpToolExport;
