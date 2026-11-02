# Contributing

Contributions are welcome! Bug reports, rule suggestions, dependency updates or new options: feel free to open an [issue](https://github.com/angelblanco/eslint-config/issues) or a pull request.

## Workflow

1. Fork the repository and create a branch from `main`.
2. Make your changes and check them locally (see below).
3. Push the branch and open a pull request against `main`, describing what changes and why.
4. Before the pull request is merged and released, test the branch in a real project as described in [Testing an Unpublished Branch](#testing-an-unpublished-branch).

## Local Development

Requires [pnpm](https://pnpm.io) (the version is pinned in `package.json` under `packageManager`).

```bash
pnpm install   # also builds dist through the prepare script
pnpm lint      # lint the repo with its own config
pnpm test      # type check
pnpm build     # build dist (cjs, esm and types)
```

## Testing an Unpublished Branch

The way to test a change before it is published to npm is to install the pull request branch straight from GitHub in another project. The `prepare` script builds `dist` during the install, so nothing needs to be committed besides the source.

The examples use a branch called `my-dev-branch` in `angelblanco/eslint-config`. If you work from a fork, replace `angelblanco` with your GitHub user.

### 1. Push the branch

```bash
git push -u origin my-dev-branch
```

### 2. Allow the build in the consumer project

pnpm (>= 10.26) blocks the `prepare` script of git-hosted dependencies unless they are approved. Add the repository to `allowBuilds` in the consumer's `pnpm-workspace.yaml`:

```yaml
allowBuilds:
  '@angelblanco/eslint-config@git+https://github.com/angelblanco/eslint-config.git': true
```

The repository URL (without `#<ref>`) approves any branch or commit of this repo, so it is set only once. Installs from npm never run `prepare`, so they don't need this entry.

### 3. Install the branch

```bash
pnpm add -D github:angelblanco/eslint-config#my-dev-branch
```

This sets the dependency in `package.json` to:

```json
{
  "devDependencies": {
    "@angelblanco/eslint-config": "github:angelblanco/eslint-config#my-dev-branch"
  }
}
```

After pushing new commits to the branch, run `pnpm update @angelblanco/eslint-config` in the consumer project to pick them up.

### 4. Go back to the published version

Once the branch is merged and released, install the npm version again and remove the `allowBuilds` entry:

```bash
pnpm add -D @angelblanco/eslint-config@latest
```

### Testing in a full project

If you want to try your changes in a complete real-world project, you can use my portfolio, [angelblanco/angelblanco.dev](https://github.com/angelblanco/angelblanco.dev). It is a Nuxt + Vue + Tailwind CSS monorepo that uses this config (with the `tailwind` option enabled), so it covers most of the rules. Clone it, follow the steps above and run:

```bash
pnpm lint
pnpm lint:fix
```

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
