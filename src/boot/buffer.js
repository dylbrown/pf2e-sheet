import { Buffer } from 'buffer';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.Buffer = Buffer;

import path from 'path';

window.__dirname = path.dirname('./');
