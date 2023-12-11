import antfu from '@antfu/eslint-config'
import unocss from '@unocss/eslint-config/flat'
import perfectionist from 'eslint-plugin-perfectionist'

export default antfu({}, unocss, {
  plugins: {
    perfectionist,
  },
  rules: {
    // Eslint
    'curly': 'off',
    // Vue
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 1,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    // Style
    'style/brace-style': 'off',
    // Perfectionist
    'perfectionist/sort-interfaces': 'error',
  },
})
