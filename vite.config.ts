/// <reference types="vitest" />

import path from 'node:path'
import { URL, fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import UnoCSS from 'unocss/vite'
import VueRouter from 'unplugin-vue-router/vite'
import { VueRouterAutoImports } from 'unplugin-vue-router'
import Layouts from 'vite-plugin-vue-layouts'

const dirname = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  resolve: {
    alias: {
      '~/': `${path.resolve(dirname, 'src')}/`,
    },
  },
  plugins: [
    VueRouter({
      /* options */
    }),
    vue({
      script: {
        // This feature is experimental and requires explicit opt-in.
        // https://github.com/vuejs/rfcs/discussions/502
        propsDestructure: true,
        // starting from vue.3.4.0, defineModel is already stable
        // defineModel: true,
      },
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: [
        'vue',
        'vue/macros',
        VueRouterAutoImports,
        '@vueuse/core',
      ],
      dts: true,
      dirs: [
        './src/composables',
        './src/utils',
      ],
      vueTemplate: true,
    }),

    // https://github.com/antfu/vite-plugin-components
    Components({
      dts: true,
      exclude: [
        /[\\/]node_modules[\\/]/,
        /[\\/]\.git[\\/]/,
        /[\\/]\.nuxt[\\/]/,
        //
        /\.test\.ts/,
      ],
    }),

    // https://github.com/antfu/unocss
    // see uno.config.ts for config
    UnoCSS(),

    // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
    Layouts({
      layoutsDirs: './src/layouts',
      pagesDirs: './src/pages',
      // defaultLayout: 'myDefault'
    }),
  ],

  // https://github.com/vitest-dev/vitest
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: path.resolve(dirname, 'config/vitest/setup.config.ts'),
  },
})
