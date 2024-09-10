// sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {escapeGames} from './src/sanity/schemaTypes/games'

import {youtubeInput} from 'sanity-plugin-youtube-input'

export default defineConfig({
  name: 'vr-cafe',
  title: 'VR Café',
  projectId: '7ef57i1i',
  dataset: 'production',
  plugins: [
    structureTool(),
    youtubeInput(
      { apiKey: 'AIzaSyBtr9CrajTccK9UFw6RzyDJXeLuVPr6Vw0' }
    )
  ],
  schema: {
    types: [  
      /* your content types here*/
      escapeGames
    ],
  },
})