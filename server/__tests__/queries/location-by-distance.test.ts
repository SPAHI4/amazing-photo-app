import { runGraphQLQuery } from '../helpers.js';

describe('locations', () => {
  it('location by distance returns correct', async () => {
    await runGraphQLQuery(
      /* GraphQL */
      `
        query {
          locationsByDistance(lat: 41.7225, lng: 44.7900) {
            nodes {
              id
              name
            }
          }
        }
      `,
      {},
      (json) => {
        expect(json.data).toBeTruthy();
        const { nodes } = json.data!.locationsByDistance;

        expect(nodes[0].name).toBe('Tbilisi');
        expect(nodes[1].name).toBe('Batumi');
      },
    );
  });
});
