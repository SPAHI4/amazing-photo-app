import { expect, jest } from '@jest/globals';

jest.unstable_mockModule('crypto', () => ({
  default: {
    randomUUID: jest.fn().mockReturnValue('mock_randomUUID'),
  },
}));

jest.unstable_mockModule('@aws-sdk/s3-presigned-post', () => ({
  createPresignedPost: jest.fn().mockReturnValue({
    url: 'https://mock_url',
    fields: { mock_field: 'mock_value' },
  }),
}));

const { runGraphQLQuery } = await import('../helpers.js');

const CREATE_IMAGE_UPLOAD = /* GraphQL */ `
  mutation CreateImageUpload {
    createImageUpload(input: { contentType: "image/avif" }) {
      url
      fields
      image {
        id
      }
    }
  }
`;

describe('createImageUpload', () => {
  it('should return presigned post and create image', async () => {
    await runGraphQLQuery(CREATE_IMAGE_UPLOAD, {}, async (json, { pgClient }) => {
      expect(json.errors).toBeFalsy();
      expect(json.data.createImageUpload.url).toBe('https://mock_url');
      expect(json.data.createImageUpload.fields).toEqual({ mock_field: 'mock_value' });

      await pgClient.query('set role app_postgraphile');

      const {
        rows: [image],
      } = await pgClient.query(`
          select
              *
          from
              app_public.images
          where
              id = '${json.data.createImageUpload.image.id}'
          `);

      expect(image.s3_key).toBe('mock_randomUUID.avif');
    });
  });

  it('should disallow invalid content type', async () => {
    await runGraphQLQuery(
      /* GraphQL */ `
        mutation CreateImageUpload {
          createImageUpload(input: { contentType: "image/png" }) {
            url
            fields
            image {
              id
            }
          }
        }
      `,
      {},
      async (json) => {
        expect(json.errors).toBeTruthy();
        expect(json.errors[0].message).toBe('Content type "image/png" is not allowed');
      },
    );
  });
});
