import { defineConfig } from 'nitro'

export default defineConfig({
  preset: 'aws_amplify',
  awsAmplify: {
    runtime: 'nodejs22.x',
  },
})