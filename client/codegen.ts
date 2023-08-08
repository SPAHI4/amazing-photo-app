/* eslint-disable import/no-default-export */
import type { CodegenConfig } from '@graphql-codegen/cli';
import { DocumentNode, Kind, visit } from 'graphql';
import type { Types } from '@graphql-codegen/plugin-helpers';
import type { ClientPresetConfig } from '@graphql-codegen/client-preset';

function addTypeNameToEveryField(document: DocumentNode) {
  return visit(document, {
    Field: {
      leave(node) {
        if (node.selectionSet) {
          return {
            ...node,
            selectionSet: {
              kind: Kind.SELECTION_SET,
              selections: [
                ...node.selectionSet.selections,
                {
                  kind: Kind.FIELD,
                  name: {
                    kind: Kind.NAME,
                    value: '__typename',
                  },
                },
              ],
            },
          };
        }
        return node;
      },
    },
  });
}
const addTypename: Types.DocumentTransformFunction = async ({ documents }) =>
  documents.map(({ document, location }) => ({
    document: addTypeNameToEveryField(document as DocumentNode),
    location,
  }));

const config: CodegenConfig = {
  schema: '../server/schema.graphql',
  documents: ['src/**/*.{ts,tsx}'],
  ignoreNoDocuments: true,
  generates: {
    './src/__generated__/': {
      config: {
        scalars: {
          Datetime: 'Date',
          JSON: 'Record<string, unknown>',
        },
      },
      preset: 'client',
      presetConfig: {
        gqlTagName: 'graphql',
        dedupeFragments: true,
        persistedDocuments: {
          mode: 'embedHashInDocument',
          hashAlgorithm: 'sha256',
        },
        skipTypename: false,
      } as ClientPresetConfig,
      documentTransforms: [{ transform: addTypename }],
    },
    './src/__generated__/graphql-types.ts': {
      plugins: ['@homebound/graphql-typescript-scalar-type-policies'],
      config: {
        scalars: {
          Datetime: 'Date',
          JSON: 'Record<string, unknown>',
        },
        scalarTypePolicies: {
          Datetime: '../graphql-scalars.ts#datetimeTypePolicy',
        },
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write $1'],
  },
};
export default config;
