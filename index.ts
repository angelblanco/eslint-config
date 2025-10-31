import antfu from '@antfu/eslint-config';

type AntfuOptions = Parameters<typeof antfu>[0];
type UserConfigs = Parameters<typeof antfu>[1];
type EslintConfig = ReturnType<typeof antfu>;

/**
 * A function that returns user options to be merged with the default ones (or overwritten).
 */
type ApplyUserOptionsFunction = (defualtOptions: AntfuOptions) => AntfuOptions;

/**
 * A function that returns an array of user configs to be merged with the default ones (or overwritten).
 */
type ApplyUserConfigsFunction = (defaultUserConfigs: UserConfigs[]) => UserConfigs[];

function getDefaultOptions(): AntfuOptions {
  return {
    typescript: true,
    vue: true,
    formatters: true,
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
        'vue/block-order': ['error', {
          order: ['template', 'script', 'style'],
        }],
      },
    },
  ]
}

export default function eslintConfig(applyUserOptions: ApplyUserOptionsFunction | null = null, applyUserConfigs: ApplyUserConfigsFunction | null = null): EslintConfig {
  const options= applyUserOptions ? applyUserOptions(getDefaultOptions()) : getDefaultOptions();
  const userConfig = applyUserConfigs ? applyUserConfigs(getDefaultUserConfigs()) : getDefaultUserConfigs();
  
  return antfu(
    options,
    ...userConfig,
  );
}
