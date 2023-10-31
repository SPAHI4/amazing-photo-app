import { datetimeTypePolicy } from '../graphql-scalars.ts';

export const scalarTypePolicies = {
  Comment: {
    fields: {
      archivedAt: datetimeTypePolicy,
      createdAt: datetimeTypePolicy,
      updatedAt: datetimeTypePolicy,
    },
  },
  Image: { fields: { createdAt: datetimeTypePolicy, updatedAt: datetimeTypePolicy } },
  Location: {
    fields: {
      archivedAt: datetimeTypePolicy,
      createdAt: datetimeTypePolicy,
      updatedAt: datetimeTypePolicy,
    },
  },
  Photo: {
    fields: {
      archivedAt: datetimeTypePolicy,
      createdAt: datetimeTypePolicy,
      shotAt: datetimeTypePolicy,
      updatedAt: datetimeTypePolicy,
    },
  },
  PhotosLike: { fields: { createdAt: datetimeTypePolicy, updatedAt: datetimeTypePolicy } },
  User: {
    fields: {
      archivedAt: datetimeTypePolicy,
      createdAt: datetimeTypePolicy,
      updatedAt: datetimeTypePolicy,
    },
  },
};
