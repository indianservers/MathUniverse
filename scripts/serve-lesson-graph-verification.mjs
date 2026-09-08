import { createServer } from 'vite';
// Stable browser verification while other tasks may edit this shared workspace.
// This only disables development reloads, never runtime errors or test checks.
const server = await createServer({ server: { host: '127.0.0.1', port: Number(process.env.LESSON_GRAPH_VERIFY_PORT ?? 2277), strictPort: true, hmr: false, watch: null } });
await server.listen();
server.printUrls();
