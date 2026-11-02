import type { TailwindOptions } from './tailwind';
import antfu from '@antfu/eslint-config';
import { tailwindConfigs } from './tailwind';

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
