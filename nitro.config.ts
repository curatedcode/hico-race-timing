import { defineConfig } from 'nitro';

export default defineConfig({
  preset: 'aws_amplify',
  awsAmplify: {
    runtime: 'nodejs24.x',
  },
  rollupConfig: {
		plugins: [
			{
				name: 'inject-env-loader-into-entry',
        // @ts-expect-error
				generateBundle(_options, bundle) {
					for (const fileName in bundle) {
						const chunk = bundle[fileName];
						if (chunk.type === 'chunk' && chunk.isEntry) {
							chunk.code =
								`import { readFileSync } from 'node:fs';
import { join } from 'node:path';
try {
  const __dirname = dirname(fileURLToPath(import.meta.url, "../"));
  const content = readFileSync(join(__dirname, '../../', '.env'), 'utf-8');
  for (const line of content.split('\\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim();
    if (!(k in process.env)) process.env[k] = v;
  }
} catch (e) { console.warn('env load failed', e); }
` + chunk.code;
						}
					}
				},
			},
		],
	},
})