# @angelblanco/eslint-config

Ángel Blanco's ESLint Config - based on [@antfu/eslint-config](https://github.com/antfu/eslint-config)

## Features

- TypeScript support enabled by default
- Vue support enabled by default
- Formatters enabled
- Stylistic rules with semicolons and 2-space indentation
- Custom Vue block order: template → script → style

## Installation

```bash
pnpm add -D eslint @angelblanco/eslint-config
```

## Usage

### Basic Setup

Create `eslint.config.js` in your project root:

```js
import eslintConfig from '@angelblanco/eslint-config';

export default eslintConfig();
```

### Custom Options

You can customize the default options by passing a function:

```js
import eslintConfig from '@angelblanco/eslint-config';

export default eslintConfig((defaultOptions) => {
  return {
    ...defaultOptions,
    stylistic: {
      ...defaultOptions.stylistic,
      semi: false, // Disable semicolons
    },
  };
});
```

### Custom Rules

Add your own ESLint configs as a second parameter:

```js
import eslintConfig from '@angelblanco/eslint-config';

export default eslintConfig(
  null, // Use default options
  defaultConfigs => [
    ...defaultConfigs,
    {
      rules: {
        'no-console': 'warn',
      },
    },
  ]
);
```

## Creating Your Own Config

This repository can be used as a template for creating your own shareable ESLint config. Here's how to fork and customize it:

### 1. Fork the Repository

Click the "Fork" button on GitHub or clone this repository to start with your own copy.

### 2. Customize Package Details

Update `package.json` with your information:

```json
{
  "name": "@yourname/eslint-config",
  "author": "Your Name",
  "repository": "yourname/eslint-config"
}
```

### 3. Modify the Configuration

Edit `src/index.ts` to adjust:

- Default options (TypeScript, Vue, formatters, etc.)
- Stylistic preferences (semicolons, indentation, quotes)
- Custom rules and overrides
- Vue block ordering or other framework-specific settings

### 4. Update Documentation

- Modify this `README.md` to reflect your config's features
- Update installation instructions with your package name
- Document any custom rules or conventions

### 5. Publish Your Config

```bash
# Build the package
pnpm build

# Publish to npm (requires npm account)
npm publish --access public
```

### 6. Use Your Config

Install and use your custom config in projects:

```bash
pnpm add -D eslint @yourname/eslint-config
```

```js
import eslintConfig from '@yourname/eslint-config';

export default eslintConfig();
```

## License

[MIT](LICENSE)
