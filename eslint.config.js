// eslint.config.js
// https://github.com/antfu/eslint-config
import antfu from '@antfu/eslint-config'

export default await antfu({
  ignores: ['/scripts/*'],
  rules: {
    'no-console': 'off',
    'node/prefer-global/process': 'off',
    'no-unused-vars': 'off',
    'ts/no-unused-vars': 'off',
    'unused-imports/no-unused-vars': 'off',
    'node/prefer-global/buffer': 'off',
    'unicorn/prefer-node-protocol': 'off',
  },
})
