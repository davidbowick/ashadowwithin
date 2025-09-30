import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'

import { schema } from './sanity/schemaTypes'
import { customStructure } from './sanity/structure'

export default defineConfig({
  basePath: '/studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  schema,
  plugins: [
    deskTool({
      structure: customStructure, // 👈 use your custom structure here
    }),
    visionTool(),
  ],
})