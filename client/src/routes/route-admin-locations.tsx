import { useApolloClient, useMutation, useSuspenseQuery } from '@apollo/client';
import { Alert, Button, Container, LinearProgress, Snackbar, Link as MuiLink } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowModesModel,
  GridRowModes,
  GridToolbarContainer,
  GridFilterModel,
} from '@mui/x-data-grid';
import { css } from '@emotion/react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { graphql } from '../__generated__/gql.ts';
import { StickPointerButton } from '../ui-components/cursor.tsx';

const ROUTE_ADMIN_LOCATIONS_QUERY = graphql(`
  query RouteAdminLocationsQuery {
    locations(includeArchived: YES) {
      totalCount
      edges {
        node {
          id
          name
          slug
          description
          photos {
            totalCount
          }
          isArchived
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        startCursor
      }
    }
  }
`);

const ROUTE_ADMIN_CREATE_LOCATION_MUTATION = graphql(`
  mutation createLocation($input: CreateLocationInput!) {
    createLocation(input: $input) {
      location {
        id
        name
        slug
        description
        photos {
          totalCount
        }
        isArchived
      }
    }
  }
`);

const ROUTE_ADMIN_UPDATE_LOCATION_MUTATION = graphql(`
  mutation updateLocation($input: UpdateLocationInput!) {
    updateLocation(input: $input) {
      location {
        id
        name
        slug
        description
        photos {
          totalCount
        }
        isArchived
      }
    }
  }
`);

const ROUTE_ADMIN_DELETE_LOCATION_MUTATION = graphql(`
  mutation deleteLocation($input: DeleteLocationInput!) {
    deleteLocation(input: $input) {
      location {
        id
        name
        slug
        description
        photos {
          totalCount
        }
        isArchived
      }
    }
  }
`);

const isLocationNew = ({ id }: { id: number }) => id < 0;

interface LocationEditToolbarProps {
  createLocationLocal: () => void;
  hasNew: boolean;
}

function LocationEditToolbar(props: LocationEditToolbarProps) {
  const { createLocationLocal, hasNew } = props;
  return (
    <GridToolbarContainer
      css={css`
        padding: 6px 12px;
      `}
    >
      <StickPointerButton>
        <Button color="secondary" onClick={createLocationLocal} disabled={hasNew}>
          add location
        </Button>
      </StickPointerButton>
      {/* <GridToolbar rowModel={rowModel} showQuickFilter /> */}
    </GridToolbarContainer>
  );
}

export function RouteAdminLocations() {
  const { data } = useSuspenseQuery(ROUTE_ADMIN_LOCATIONS_QUERY);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [error, setError] = useState<string | null>(null);
  const client = useApolloClient();
  const [createLocation, { loading: createLoading }] = useMutation(
    ROUTE_ADMIN_CREATE_LOCATION_MUTATION,
    {
      refetchQueries: [ROUTE_ADMIN_LOCATIONS_QUERY],
    },
  );
  const [updateLocation, { loading: updateLoading }] = useMutation(
    ROUTE_ADMIN_UPDATE_LOCATION_MUTATION,
  );
  const [deleteLocation, { loading: deleteLoading }] = useMutation(
    ROUTE_ADMIN_DELETE_LOCATION_MUTATION,
    {
      refetchQueries: [ROUTE_ADMIN_LOCATIONS_QUERY],
    },
  );
  const loading = createLoading || updateLoading || deleteLoading;

  const [searchParams] = useSearchParams();

  const initialFilterModel = useMemo(() => {
    const filterModel = {
      items: [],
    } as GridFilterModel;

    if (searchParams.get('id_eq') != null) {
      filterModel.items.push({
        id: 1,
        field: 'id',
        value: searchParams.get('id_eq'),
        operator: 'equals',
      });
    }

    return filterModel;
  }, [searchParams]);

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleCreateLocation = useCallback(async () => {
    client.cache.modify({
      fields: {
        locations(connection) {
          const newLocationRef = client.cache.writeFragment({
            data: {
              __typename: 'Location',
              id: -1,
              name: '',
              slug: '',
              description: '',
              photos: {
                __typename: 'PhotosConnection' as const,
                totalCount: 0,
              },
              isArchived: false,
            },
            fragment: graphql(`
              fragment NewLocation on Location {
                id
                name
                slug
                description
                photos {
                  totalCount
                }
                isArchived
              }
            `),
          });
          return {
            ...connection,
            totalCount: connection.totalCount + 1,
            edges: [
              ...connection.edges,
              {
                __typename: 'LocationEdge',
                cursor: '',
                node: newLocationRef,
              },
            ],
          };
        },
      },
    });
  }, [client.cache]);

  const handleDeleteLocation = useCallback(
    async (id: number) => {
      if (isLocationNew({ id })) {
        client.cache.modify({
          fields: {
            locations(connection) {
              return {
                ...connection,
                totalCount: connection.totalCount - 1,
                edges: connection.edges.filter(
                  (edge: { node: { id: number } }) => edge.node.id !== id,
                ),
              };
            },
          },
        });
        return;
      }

      await deleteLocation({ variables: { input: { id } } });
    },
    [client.cache, deleteLocation],
  );

  const locationsColumns: GridColDef[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        width: 50,
      },
      {
        field: 'name',
        headerName: 'Name',
        width: 125,
        editable: true,
      },
      {
        field: 'slug',
        headerName: 'Slug',
        width: 125,
        editable: true,
        sortable: false,
      },
      {
        field: 'description',
        headerName: 'Description',
        width: 500,
        editable: true,
        sortable: false,
      },
      {
        field: 'photos',
        headerName: 'Photos',
        width: 80,
        editable: false,
        renderCell: ({ row }) => (
          <MuiLink component={Link} to={`../photos/?locationId_eq=${row.id}`}>
            {row.photos}
          </MuiLink>
        ),
      },
      {
        field: 'isArchived',
        headerName: 'Archived',
        width: 80,
        editable: true,
        sortable: true,
        type: 'boolean',
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'Actions',
        headerAlign: 'right',
        align: 'right',
        width: 180,
        getActions: (params) => [
          <StickPointerButton key="view">
            <Button
              size="small"
              component={Link}
              to={`/location/${params.row.slug}`}
              target="_blank"
            >
              view
            </Button>
          </StickPointerButton>,
          <StickPointerButton key="delete">
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                // eslint-disable-next-line no-alert
                if (window.confirm(`Are you sure you want to delete "${params.row.name}?`)) {
                  handleDeleteLocation(params.row.id);
                }
              }}
            >
              delete
            </Button>
          </StickPointerButton>,
        ],
      },
    ],
    [handleDeleteLocation],
  );

  type LocationNode = NonNullable<NonNullable<typeof data.locations>['edges'][number]['node']>;

  const mapNodeToRow = useCallback(
    (node: LocationNode) => ({
      id: node.id,
      name: node.name,
      slug: node.slug,
      description: node.description ?? '',
      photos: node.photos.totalCount,
      isArchived: node.isArchived,
    }),
    [],
  );

  const rows = useMemo(
    () => data.locations?.edges.map((edge) => mapNodeToRow(edge.node)) ?? [],
    [data.locations?.edges, mapNodeToRow],
  );

  const handleUpdate = useCallback(
    async (row: (typeof rows)[number]) => {
      if (isLocationNew(row)) {
        const res = await createLocation({
          variables: {
            input: {
              location: {
                name: row.name,
                slug: row.slug,
                description: row.description,
              },
            },
          },
        });
        return res.data?.createLocation?.location;
      }

      const res = await updateLocation({
        variables: {
          input: {
            id: row.id,
            patch: {
              name: row.name,
              slug: row.slug,
              description: row.description,
              isArchived: row.isArchived,
            },
          },
        },
      });

      const node = res.data?.updateLocation?.location;

      if (node == null) {
        return null;
      }

      return mapNodeToRow(node);
    },
    [createLocation, mapNodeToRow, updateLocation],
  );

  const hasNew = data.locations?.edges.some((edge) => isLocationNew(edge.node)) ?? false;

  useEffect(() => {
    if (hasNew) {
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [-1]: { mode: GridRowModes.Edit, fieldToFocus: 'name' },
      }));
    }
  }, [hasNew]);

  return (
    <>
      <Helmet>
        <title>{import.meta.env.VITE_BASE_TITLE} | Admin | Locations</title>
      </Helmet>
      <Container>
        <Snackbar open={error != null} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
        <DataGrid
          css={css`
            height: 80vh;
          `}
          loading={loading}
          rows={rows}
          editMode="row"
          columns={locationsColumns}
          initialState={{
            filter: {
              filterModel: initialFilterModel,
            },
          }}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={(updatedRow) => handleUpdate(updatedRow)}
          onProcessRowUpdateError={(err) => {
            setError(err.message);
          }}
          slots={{
            toolbar: LocationEditToolbar,
            loadingOverlay: LinearProgress,
          }}
          slotProps={{
            toolbar: { createLocationLocal: handleCreateLocation, setRowModesModel, hasNew },
          }}
        />
      </Container>
    </>
  );
}
