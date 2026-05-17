// This file is a re-export of the generated types.
// Run `npx nx run api-types:generate` to regenerate.
export type * from './generated';
import type { components } from './generated';

/** Convenience type to access component schemas by name. */
export type ApiSchemas = components['schemas'];
