import type { Linter } from 'eslint';
import antfu, { ensurePackages, interopDefault } from '@antfu/eslint-config';

/**
 * Settings for `eslint-plugin-tailwindcss`, declared here so the plugin stays an optional peer dependency.
 *
 * @see https://github.com/francoismassart/eslint-plugin-tailwindcss#settings
 */
interface TailwindOptions {
  /**
   * Path to the CSS file that imports tailwindcss.
   *
   * @default 'src/style.css'
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
   * @default false
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

function getDefaultOptions(): Options {
  return {
    typescript: true,
    vue: true,
    formatters: true,
    tailwind: false,
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
    const tailwindOptions = tailwind === true
      ? {}
      : tailwind;

    pluginConfigs.push(tailwindConfigs(tailwindOptions));
  }

  return antfu(
    options,
    ...pluginConfigs,
    ...userConfig,
  );
}
