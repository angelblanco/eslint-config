import type { Linter } from 'eslint';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import antfu, { ensurePackages, interopDefault } from '@antfu/eslint-config';
import { isPackageExists } from 'local-pkg';

/**
 * Common locations of the CSS entry file that imports tailwindcss (Vite, Nuxt, Next.js, Laravel...).
 */
const TAILWIND_CSS_CANDIDATES = [
  'src/style.css',
  'src/styles.css',
  'src/index.css',
  'src/main.css',
  'src/app.css',
  'src/assets/main.css',
  'src/assets/css/main.css',
  'src/styles/global.css',
  'src/app/globals.css',
  'app/globals.css',
  'app/assets/css/main.css',
  'assets/css/main.css',
  'resources/css/app.css',
];

const TAILWIND_IMPORT_REGEX = /@import\s+['"]tailwindcss/;

/**
 * Settings for `eslint-plugin-tailwindcss`, declared here so the plugin stays an optional peer dependency.
 *
 * @see https://github.com/francoismassart/eslint-plugin-tailwindcss#settings
 */
interface TailwindOptions {
  /**
   * Path to the CSS file that imports tailwindcss.
   *
   * @default auto-detected from common locations, falling back to the plugin default ('src/style.css')
   */
  cssConfigPath?: string;
  attributes?: string[];
  functions?: string[];
  parseKeyFunctions?: string[];
  ignoredKeys?: string[];
  cacheMaxSize?: number;
  cacheMaxAge?: number;
}

type AntfuOptions = NonNullable<Parameters<typeof antfu>[0]>;
type Options = AntfuOptions & {
  /**
   * Enable `eslint-plugin-tailwindcss`. Pass an object to customize the plugin settings.
   *
   * @default auto-detected: enabled when `tailwindcss` and `eslint-plugin-tailwindcss` are installed
   * and a CSS entry file importing tailwindcss is found
   */
  tailwind?: boolean | TailwindOptions;
};
type UserConfigs = Parameters<typeof antfu>[1];
type EslintConfig = ReturnType<typeof antfu>;

/**
 * A function that returns user options to be merged with the default ones (or overwritten).
 */
type ApplyUserOptionsFunction = (defualtOptions: Options) => Options;

/**
 * A function that returns an array of user configs to be merged with the default ones (or overwritten).
 */
type ApplyUserConfigsFunction = (defaultUserConfigs: UserConfigs[]) => UserConfigs[];

/**
 * Looks for the CSS entry file that imports tailwindcss, relative to the current working directory.
 */
function findTailwindCss(): string | undefined {
  return TAILWIND_CSS_CANDIDATES
    .map(file => resolve(process.cwd(), file))
    .find(file => existsSync(file) && TAILWIND_IMPORT_REGEX.test(readFileSync(file, 'utf8')));
}

function detectTailwind(): false | TailwindOptions {
  if (!isPackageExists('tailwindcss') || !isPackageExists('eslint-plugin-tailwindcss')) {
    return false;
  }

  const cssConfigPath = findTailwindCss();

  return cssConfigPath
    ? { cssConfigPath }
    : false;
}

function resolveTailwindOptions(tailwind: true | TailwindOptions): TailwindOptions {
  const options = tailwind === true
    ? {}
    : tailwind;

  if (options.cssConfigPath) {
    return options;
  }

  const cssConfigPath = findTailwindCss();

  return cssConfigPath
    ? { ...options, cssConfigPath }
    : options;
}

function getDefaultOptions(): Options {
  return {
    typescript: true,
    vue: true,
    formatters: true,
    tailwind: detectTailwind(),
    stylistic: {
      semi: true,
      indent: 2,
    },
  };
}

function getDefaultUserConfigs(): UserConfigs[] {
  return [
    {
      files: ['**/*.vue'],
      rules: {
        'vue/block-order': [
          'error',
          {
            order: ['template', 'script', 'style'],
          },
        ],
      },
    },
  ];
}

async function tailwindConfigs(options: TailwindOptions): Promise<Linter.Config[]> {
  await ensurePackages(['eslint-plugin-tailwindcss']);

  const pluginTailwind = await interopDefault(import('eslint-plugin-tailwindcss'));

  return [
    pluginTailwind.configs.recommended as Linter.Config,
    {
      name: 'angelblanco/tailwind/settings',
      settings: {
        tailwindcss: options,
      },
    },
  ];
}

export default function eslintConfig(applyUserOptions: ApplyUserOptionsFunction | null = null, applyUserConfigs: ApplyUserConfigsFunction | null = null): EslintConfig {
  const { tailwind, ...options } = applyUserOptions
    ? applyUserOptions(getDefaultOptions())
    : getDefaultOptions();
  const userConfig = applyUserConfigs
    ? applyUserConfigs(getDefaultUserConfigs())
    : getDefaultUserConfigs();

  // Registered before the user configs so they can override the tailwind rules
  const pluginConfigs: UserConfigs[] = [];

  if (tailwind) {
    pluginConfigs.push(tailwindConfigs(resolveTailwindOptions(tailwind)));
  }

  return antfu(
    options,
    ...pluginConfigs,
    ...userConfig,
  );
}
