import type { Linter } from 'eslint';
import { ensurePackages, interopDefault } from '@antfu/eslint-config';

/**
 * Settings for `eslint-plugin-tailwindcss`, declared here so the plugin stays an optional peer dependency.
 *
 * @see https://github.com/francoismassart/eslint-plugin-tailwindcss#settings
 */
export interface TailwindOptions {
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

export async function tailwindConfigs(options: TailwindOptions): Promise<Linter.Config[]> {
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
