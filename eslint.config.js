import { fileURLToPath } from 'node:url'
import antfu from '@antfu/eslint-config'

const dirName = fileURLToPath(new URL('.', import.meta.url))

export default antfu({
  ignores: [
    '.vscode/*.json',
    `${dirName}/shims.d.ts`,
  ],
})
