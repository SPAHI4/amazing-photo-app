import { useCallback, useMemo, useState } from 'react';
import { useMutation, useSuspenseQuery } from '@apollo/client';
import { DataGrid, GridColDef, GridFilterModel } from '@mui/x-data-grid';
import { Alert, Avatar, Button, Container, Snackbar, Link as MuiLink } from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { css } from '@emotion/react';
import { Helmet } from 'react-helmet-async';
import { StickPointerButton } from '../ui-components/cursor.tsx';
import { graphql } from '../__generated__';

const ROUTE_ADMIN_USERS_QUERY = graphql(`
  query UsersQuery {
    users(includeArchived: YES) {
      totalCount
      edges {
        node {
          id
          displayName
          createdAt
          pictureUrl
          authoredPhotos {
            totalCount
          }
          comments {
            totalCount
          }
          photosLikes {
            totalCount
          }
          isArchived
        }
      }
    }
  }
`);

const ROUTE_ADMIN_USERS_UPDATE_USER_MUTATION = graphql(`
  mutation UpdateUserMutation($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        displayName
        createdAt
        pictureUrl
        authoredPhotos {
          totalCount
        }
        comments {
          totalCount
        }
        photosLikes {
          totalCount
        }
        isArchived
      }
    }
  }
`);

const ROUTE_ADMIN_USERS_DELETE_USER_MUTATION = graphql(`
  mutation DeleteUserMutation($input: DeleteUserInput!) {
    deleteUser(input: $input) {
      user {
        id
      }
    }
  }
`);

export function RouteAdminUsers() {
  const [error, setError] = useState<string | null>(null);
  const { data } = useSuspenseQuery(ROUTE_ADMIN_USERS_QUERY);
  const [updateUser, { loading: updateLoading }] = useMutation(
    ROUTE_ADMIN_USERS_UPDATE_USER_MUTATION,
  );
  const [deleteUser, { loading: deleteLoading }] = useMutation(
    ROUTE_ADMIN_USERS_DELETE_USER_MUTATION,
    {
      refetchQueries: ['UsersQuery'],
    },
  );
  const loading = updateLoading || deleteLoading;

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

  const handleDeleteUser = useCallback(
    async (id: number) => {
      await deleteUser({
        variables: {
          input: {
            id,
          },
        },
      });
    },
    [deleteUser],
  );

  const usersColumns: GridColDef[] = useMemo(
    () => [
      {
        field: 'pictureUrl',
        headerName: '',
        width: 60,
        renderCell: (params) => (
          <Avatar src={params.value as string}>{params.row.displayName}</Avatar>
        ),
      },
      {
        field: 'id',
        headerName: 'ID',
        width: 50,
        valueGetter: (params) => params.row.id,
      },
      {
        field: 'displayName',
        headerName: 'Display Name',
        type: 'string',
        width: 200,
        editable: true,
      },
      {
        field: 'createdAt',
        headerName: 'Created At',
        type: 'date',
        width: 100,
        editable: false,
        valueGetter: ({ row }) =>
          row.createdAt instanceof Date || row.createdAt == null
            ? row.createdAt
            : new Date(row.createdAt),
      },
      {
        field: 'authoredPhotos',
        headerName: 'Photos',
        type: 'number',
        width: 100,
        editable: false,
        renderCell: ({ row }) => (
          <MuiLink component={Link} to={`../photos/?authorId_eq=${row.id}`}>
            {row.authoredPhotos.totalCount}
          </MuiLink>
        ),
      },
      {
        field: 'comments',
        headerName: 'Comments',
        type: 'number',
        width: 100,
        editable: false,
        renderCell: ({ row }) => (
          <MuiLink component={Link} to={`../comments/?userId=${row.id}`}>
            {row.comments.totalCount}
          </MuiLink>
        ),
      },
      {
        field: 'photosLikes',
        headerName: 'Photos Liked',
        type: 'number',
        width: 120,
        editable: false,
        renderCell: ({ row }) => (
          <MuiLink component={Link} to={`../photos/?userLikedId=${row.id}`}>
            {row.photosLikes.totalCount}
          </MuiLink>
        ),
      },
      {
        field: 'isArchived',
        headerName: 'Archived',
        width: 100,
        editable: true,
        sortable: true,
        type: 'boolean',
      },
      {
        field: 'actions',
        headerName: 'Actions',
        headerAlign: 'right',
        type: 'actions',
        align: 'right',
        width: 300,
        getActions: (params) => [
          <StickPointerButton key="delete">
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                // eslint-disable-next-line no-alert
                if (window.confirm(`Are you sure you want to delete user?`)) {
                  handleDeleteUser(params.row.id);
                }
              }}
            >
              delete
            </Button>
          </StickPointerButton>,
        ],
      },
    ],
    [handleDeleteUser],
  );

  const usersRows = useMemo(
    () => data.users?.edges.map((edge) => edge.node) ?? [],
    [data.users?.edges],
  );

  const handleUpdate = useCallback(
    async (row: (typeof usersRows)[number]) => {
      const res = await updateUser({
        variables: {
          input: {
            id: row.id,
            patch: {
              displayName: row.displayName,
              pictureUrl: row.pictureUrl,
              isArchived: row.isArchived,
            },
          },
        },
      });

      return res.data?.updateUser?.user;
    },
    [updateUser],
  );

  return (
    <>
      <Helmet>
        <title>{import.meta.env.VITE_BASE_TITLE} | Admin | Users</title>
      </Helmet>

      <Container>
        <Snackbar open={error != null} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
        <DataGrid
          css={css`
            height: 80vh;
          `}
          rows={usersRows}
          columns={usersColumns}
          loading={loading}
          processRowUpdate={(updatedRow) => handleUpdate(updatedRow)}
          onProcessRowUpdateError={(err) => {
            setError(err.message);
          }}
          initialState={{
            filter: {
              filterModel: initialFilterModel,
            },
          }}
        />
      </Container>
    </>
  );
}
