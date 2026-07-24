import { defineConfig } from 'vite';

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';

export default defineConfig({
  // Use /<repo>/ when building on GitHub Actions for project pages.
  base: isGitHubActions && repoName ? `/${repoName}/` : '/'
});
