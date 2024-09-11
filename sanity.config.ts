// sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {escapeGames} from './src/sanity/schemaTypes/games'


export default defineConfig({
  name: 'vr-cafe',
  title: 'VR Café',
  projectId: '7ef57i1i',
  dataset: 'production',
  plugins: [
    structureTool(),
  ],
  schema: {
    types: [  
      /* your content types here*/
      escapeGames
    ],
  },
})