import eslintNestJSConfig from '@wisemen/eslint-config-nestjs'
import unicorn from 'eslint-plugin-unicorn'

export default [
  ...eslintNestJSConfig,
  {
    ignores: [
      'src/modules/localization/generated/i18n.generated.ts'
    ]
  },
  {
    plugins: {
      unicorn
    },
    rules: {
      'unicorn/filename-case': [
        'error',
        {
          case: 'kebabCase'
        }
      ]
    }
  },
  {
    rules: {
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      '@stylistic/padding-line-between-statements': ['off'],
      'import/order': [
        'error',
        {
          pathGroups: [
            {
              pattern: '../**/otel-sdk.js',
              group: 'builtin',
              position: 'before'
            },
            {
              pattern: './**/otel-sdk.js',
              group: 'builtin',
              position: 'before'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      '@typescript-eslint/unbound-method': 'off'
    }
  }
]
