import { defineConfig } from 'vite'

// Plain JavaScript app: Vite is only the dev server and build tool.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.js'],
  },
})
