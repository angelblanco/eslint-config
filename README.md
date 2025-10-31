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
import eslintConfig from '@angelblanco/eslint-config'

export default eslintConfig()
```

### Custom Options

You can customize the default options by passing a function:

```js
import eslintConfig from '@angelblanco/eslint-config'

export default eslintConfig((defaultOptions) => {
  return {
    ...defaultOptions,
    stylistic: {
      ...defaultOptions.stylistic,
      semi: false, // Disable semicolons
    },
  }
})
```

### Custom Rules

Add your own ESLint configs as a second parameter:

```js
import eslintConfig from '@angelblanco/eslint-config'

export default eslintConfig(
  null, // Use default options
  (defaultConfigs) => [
    ...defaultConfigs,
    {
      rules: {
        'no-console': 'warn',
      },
    },
  ]
)
```

## License

[MIT](LICENSE)
