import { defineConfig } from 'astro/config';
import { ViteImageOptimizer as viteImageOptimizer } from 'vite-plugin-image-optimizer';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import tailwind from '@astrojs/tailwind';
import { libcurlPath } from '@mercuryworkshop/libcurl-transport';
import { epoxyPath } from '@mercuryworkshop/epoxy-transport';
import { baremuxPath } from '@mercuryworkshop/bare-mux';
import { dynamicPath } from '@nebula-services/dynamic';
import { scramjetPath } from '@mercuryworkshop/scramjet';
import { uvPath as ultravioletPath } from '@titaniumnetwork-dev/ultraviolet';
import commanderVitePlugin from './vite-plugin.js';

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
                    src: ultravioletPath,
                    dest: '',
                    rename: 'ultraviolet',
                    overwrite: false
                },
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
                  src: 'public/ultraviolet/uv.config.js',
                  dest: 'ultraviolet'
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
        viteImageOptimizer(),
        commanderVitePlugin()
      ]
  },
  devToolbar: {
      enabled: false
  },
  integrations: [tailwind()]
});