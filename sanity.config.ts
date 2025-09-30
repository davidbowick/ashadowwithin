import {defineConfig} from 'sanity'
import {visionTool} from '@sanity/vision'
import { deskTool } from "sanity/desk";


import {schema} from './sanity/schemaTypes' // <- your array of schema types
import {projectId, dataset, apiVersion} from './sanity/env'

export default defineConfig({
  name: 'default',
  title: 'A Shadow Within Studio',

  projectId,
  dataset,
  basePath: '/studio',

  schema, // ✅ just pass the array directly

  plugins: [
    deskTool(), // 👈 register the desk tool
    visionTool({defaultApiVersion: apiVersion}),
  ],
})