import { useCallback, useMemo, useState } from 'react';
import { useMutation, useSuspenseQuery } from '@apollo/client';
import {
  DataGrid,
  GridCellParams,
  GridColDef,
  GridFilterModel,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import { css } from '@emotion/react';
import { Alert, Button, LinearProgress, Snackbar, Link as MuiLink, Box } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { StickPointerButton } from '../ui-components/cursor.tsx';
import { graphql } from '../__generated__/gql.ts';

const ROUTE_ADMIN_PHOTOS_QUERY = graphql(`
  query RouteAdminPhotosQuery {
    photos(includeArchived: YES) {
      edges {
        node {
          id
          isArchived
          iso
          shutterSpeed
          aperture
          focalLength
          lens
          camera
          shotAt
          createdAt
          location {
            id
            name
            slug
          }
          likesCount
          lat
          lng
          comments {
            totalCount
          }
          image {
            id
            s3Key
            s3Bucket
            sources {
              s3Key
              size
              type
            }
          }
          author {
            id
            displayName
            pictureUrl
          }
        }
      }
    }
  }
`);

const ROUTE_ADMIN_PHOTOS_UPDATE_PHOTO_MUTATION = graphql(`
  mutation RouteAdminPhotosUpdatePhotoMutation($input: UpdatePhotoInput!) {
    updatePhoto(input: $input) {
      photo {
        id
        isArchived
        iso
        shutterSpeed
        aperture
        focalLength
        shotAt
        createdAt
        location {
          id
          name
          slug
        }
        likesCount
        lat
        lng
        comments {
          totalCount
        }
        image {
          id
          s3Key
          s3Bucket
          sources {
            s3Key
            size
            type
          }
        }
        author {
          id
          displayName
          pictureUrl
        }
      }
    }
  }
`);

const ROUTE_ADMIN_PHOTOS_DELETE_PHOTO_MUTATION = graphql(`
  mutation RouteAdminPhotosDeletePhotoMutation($input: DeletePhotoInput!) {
    deletePhoto(input: $input) {
      photo {
        id
      }
    }
  }
`);

function PhotoEditToolbar() {
  return (
    <GridToolbarContainer
      css={css`
        padding: 6px 12px;
      `}
    >
      <StickPointerButton>
        <Button color="secondary" component={Link} to="/upload" target="_blank">
          upload photo
        </Button>
      </StickPointerButton>
    </GridToolbarContainer>
  );
}

export function RouteAdminPhotos() {
  const [error, setError] = useState<string | null>(null);
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

    if (searchParams.get('authorId_eq') != null) {
      filterModel.items.push({
        id: 2,
        field: 'author.id',
        value: searchParams.get('authorId_eq'),
        operator: 'equals',
      });
    }

    if (searchParams.get('locationId_eq') != null) {
      filterModel.items.push({
        id: 3,
        field: 'location.id',
        value: searchParams.get('locationId_eq'),
        operator: 'equals',
      });
    }

    return filterModel;
  }, [searchParams]);

  const { data } = useSuspenseQuery(ROUTE_ADMIN_PHOTOS_QUERY, {
    fetchPolicy: 'cache-and-network',
  });

  const [updatePhoto, { loading: updateLoading }] = useMutation(
    ROUTE_ADMIN_PHOTOS_UPDATE_PHOTO_MUTATION,
  );

  const [deletePhoto, { loading: deleteLoading }] = useMutation(
    ROUTE_ADMIN_PHOTOS_DELETE_PHOTO_MUTATION,
    {
      refetchQueries: [{ query: ROUTE_ADMIN_PHOTOS_QUERY }],
    },
  );
  const loading = updateLoading || deleteLoading;

  const handleDeletePhoto = useCallback(
    async (id: number) => {
      await deletePhoto({
        variables: {
          input: {
            id,
          },
        },
      });
    },
    [deletePhoto],
  );

  const photosColumns: GridColDef[] = useMemo(
    () => [
      {
        field: 'image',
        headerName: '',
        type: 'string',
        sortable: false,
        width: 70,
        renderCell: (params: GridCellParams) => {
          const source = params.row.image?.sources.find(
            (s: { size: number; type: string }) => s.size === 480 && s.type === 'image/avif',
          );
          const s3src =
            source?.s3Key != null
              ? `https://${params.row.image.s3Bucket}.s3.amazonaws.com/${source?.s3Key}`
              : '';

          return (
            <img
              src={s3src}
              alt=""
              css={css`
                width: 100%;
                height: 100%;
                object-fit: cover;
              `}
            />
          );
        },
      },
      {
        field: 'id',
        headerName: 'ID',
        width: 50,
        sortable: true,
      },
      {
        field: 'location.id',
        headerName: 'Location',
        type: 'string',
        width: 100,
        editable: true,
        valueGetter: ({ row }) => row.location?.id,
        renderCell: ({ row }) => (
          <MuiLink component={Link} to={`../locations/?id_eq=${row.location?.id}`}>
            {row.location?.name}
          </MuiLink>
        ),
      },
      {
        field: 'author.id',
        headerName: 'Author',
        type: 'string',
        width: 100,
        sortable: true,
        valueGetter: ({ row }) => row.author?.id,
        renderCell: ({ row }) => (
          <MuiLink component={Link} to={`../users/?id_eq=${row.author?.id}`}>
            {row.author?.displayName}
          </MuiLink>
        ),
      },
      {
        field: 'iso',
        headerName: 'ISO',
        type: 'number',
        width: 50,
        editable: true,
      },
      {
        field: 'shutterSpeed',
        headerName: 'Shutter Speed',
        type: 'number',
        width: 75,
        editable: true,
      },
      {
        field: 'aperture',
        headerName: 'Aperture',
        type: 'number',
        width: 75,
        editable: true,
      },
      {
        field: 'focalLength',
        headerName: 'Focal Length',
        type: 'number',
        width: 75,
        editable: true,
      },
      {
        field: 'camera',
        headerName: 'Camera',
        type: 'string',
        width: 130,
        editable: true,
      },
      {
        field: 'lens',
        headerName: 'Lens',
        type: 'string',
        width: 150,
        editable: true,
      },
      {
        field: 'shotAt',
        headerName: 'Shot At',
        type: 'date',
        width: 90,
        editable: true,
        valueGetter: ({ row }) =>
          row.shotAt instanceof Date || row.shotAt == null ? row.shotAt : new Date(row.shotAt),
      },
      {
        field: 'createdAt',
        headerName: 'Created At',
        type: 'date',
        width: 90,
        editable: false,
        valueGetter: ({ row }) =>
          row.createdAt instanceof Date || row.createdAt == null
            ? row.createdAt
            : new Date(row.createdAt),
      },
      {
        field: 'likesCount',
        headerName: 'Likes',
        type: 'number',
        width: 75,
      },
      {
        field: 'comments',
        headerName: 'Comments',
        type: 'number',
        width: 75,
        renderCell: ({ row }) => (
          <MuiLink component={Link} to={`../comments/?photoId_eq=${row.id}`}>
            {row.comments.totalCount}
          </MuiLink>
        ),
      },
      {
        field: 'isArchived',
        headerName: 'Archived',
        type: 'boolean',
        width: 80,
        editable: true,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        headerAlign: 'right',
        align: 'right',
        type: 'actions',
        width: 150,
        getActions: (params) => [
          <StickPointerButton key="view">
            <Button
              size="small"
              component={Link}
              to={`/location/${params.row.location.slug}/${params.row.id}`}
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
                if (window.confirm(`Are you sure you want to delete photo?`)) {
                  handleDeletePhoto(params.row.id);
                }
              }}
            >
              delete
            </Button>
          </StickPointerButton>,
        ],
      },
    ],
    [handleDeletePhoto],
  );

  const photosRows = useMemo(
    () => data.photos?.edges.map((edge) => edge.node) ?? [],
    [data.photos?.edges],
  );

  const handleUpdate = useCallback(
    async (row: (typeof photosRows)[number]) => {
      const res = await updatePhoto({
        variables: {
          input: {
            id: row.id,
            patch: {
              iso: row.iso,
              shutterSpeed: row.shutterSpeed,
              aperture: row.aperture,
              focalLength: row.focalLength,
              camera: row.camera,
              lens: row.lens,
              shotAt: row.shotAt,
              locationId: row.location?.id,
              isArchived: row.isArchived,
            },
          },
        },
      });

      return res.data?.updatePhoto?.photo;
    },
    [updatePhoto],
  );

  return (
    <>
      <Helmet>
        <title>{import.meta.env.VITE_BASE_TITLE} | Admin | Photos</title>
      </Helmet>
      <Box px={4}>
        <Snackbar open={error != null} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
        <DataGrid
          css={css`
            height: 80vh;
          `}
          rows={photosRows}
          columns={photosColumns}
          initialState={{
            filter: {
              filterModel: initialFilterModel,
            },
          }}
          loading={loading}
          processRowUpdate={(updatedRow) => handleUpdate(updatedRow)}
          onProcessRowUpdateError={(err) => {
            setError(err.message);
          }}
          slots={{
            loadingOverlay: LinearProgress,
            toolbar: PhotoEditToolbar,
          }}
          autoHeight
        />
      </Box>
    </>
  );
}
