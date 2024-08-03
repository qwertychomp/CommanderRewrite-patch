import { defineConfig } from 'astro/config';
import { ViteImageOptimizer as viteImageOptimizer } from 'vite-plugin-image-optimizer';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tailwind from '@astrojs/tailwind';
import { libcurlPath } from '@mercuryworkshop/libcurl-transport';
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';
import { baremuxPath } from '@mercuryworkshop/bare-mux/node';
import { dynamicPath } from '@nebula-services/dynamic';
import { scramjetPath } from '@mercuryworkshop/scramjet';

export default defineConfig({
  output: 'static',
  vite: {
      resolve: {
          preserveSymlinks: true
      },
      plugins: [
        viteStaticCopy({
            targets: [
                {
                    src: dynamicPath,
                    dest: '',
                    rename: 'dynamic',
                    overwrite: false
                },
                {
                    src: scramjetPath,
                    dest: '',
                    rename: 'scramjet',
                    overwrite: false
                },
                {
                    src: epoxyPath,
                    dest: '',
                    rename: 'epoxy',
                    overwrite: false
                },
                {
                    src: libcurlPath,
                    dest: '',
                    rename: 'libcurl',
                    overwrite: false
                },
                {
                    src: baremuxPath,
                    dest: '',
                    rename: 'baremux',
                    overwrite: false
                },
                {
                  src: 'public/dynamic/dynamic.config.js',
                  dest: 'dynamic'
                },
                {
                  src: 'public/scramjet/scramjet.config.js',
                  dest: 'scramjet'
                }
            ]
        }),
        viteImageOptimizer()
      ]
  },
  devToolbar: {
      enabled: false
  },
  integrations: [tailwind()]
});