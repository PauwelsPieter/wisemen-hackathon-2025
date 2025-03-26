import eslintNestJSConfig from '@wisemen/eslint-config-nestjs'

export default [
  ...eslintNestJSConfig,
  {
    ignores: [
      'src/modules/localization/generated/i18n.generated.ts'
    ]
  },
  {
    rules: {
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
