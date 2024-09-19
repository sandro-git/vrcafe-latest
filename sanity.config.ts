// sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import { schema } from './src/sanity/schemaTypes'


export default defineConfig({
  name: 'vr-cafe',
  title: 'VR Café',
  projectId: '7ef57i1i',
  dataset: 'production',
  plugins: [
    structureTool(),
  ],
  schema:{types:schema},
})