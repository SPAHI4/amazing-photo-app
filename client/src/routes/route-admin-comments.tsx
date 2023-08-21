import { useCallback, useMemo, useState } from 'react';
import { useMutation, useSuspenseQuery } from '@apollo/client';
import { DataGrid, GridColDef, GridFilterModel } from '@mui/x-data-grid';
import {
  Alert,
  Avatar,
  Button,
  Container,
  LinearProgress,
  Snackbar,
  Link as MuiLink,
} from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import { css } from '@emotion/react';
import { Helmet } from 'react-helmet-async';
import { StickPointerButton } from '../ui-components/cursor.tsx';
import { graphql } from '../__generated__';

const ROUTE_ADMIN_COMMENTS_QUERY = graphql(`
  query CommentsQuery {
    comments(includeArchived: YES) {
      totalCount
      edges {
        node {
          id
          body
          isArchived
          createdAt
          user {
            id
            displayName
            pictureUrl
          }
          photo {
            id
            location {
              id
              slug
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
          }
        }
      }
    }
  }
`);

const ROUTE_ADMIN_COMMENTS_UPDATE_COMMENT_MUTATION = graphql(`
  mutation UpdateCommentMutation($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      comment {
        id
        body
        isArchived
        createdAt
        user {
          id
          displayName
          pictureUrl
        }
        photo {
          id
          location {
            id
            slug
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
        }
      }
    }
  }
`);

const ROUTE_ADMIN_COMMENTS_DELETE_COMMENT_MUTATION = graphql(`
  mutation DeleteCommentMutation($input: DeleteCommentInput!) {
    deleteComment(input: $input) {
      comment {
        id
      }
    }
  }
`);

export function RouteAdminComments() {
  const [error, setError] = useState<string | null>(null);
  const { data } = useSuspenseQuery(ROUTE_ADMIN_COMMENTS_QUERY);
  const [updateComment, { loading: updateLoading }] = useMutation(
    ROUTE_ADMIN_COMMENTS_UPDATE_COMMENT_MUTATION,
  );
  const [deleteComment, { loading: deleteLoading }] = useMutation(
    ROUTE_ADMIN_COMMENTS_DELETE_COMMENT_MUTATION,
    {
      refetchQueries: ['CommentsQuery'],
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

    if (searchParams.get('photoId_eq') != null) {
      filterModel.items.push({
        id: 2,
        field: 'photo.id',
        value: searchParams.get('photoId_eq'),
        operator: 'equals',
      });
    }

    if (searchParams.get('userId_eq') != null) {
      filterModel.items.push({
        id: 3,
        field: 'user.id',
        value: searchParams.get('userId_eq'),
        operator: 'equals',
      });
    }

    return filterModel;
  }, [searchParams]);

  const handleDeleteComment = useCallback(
    async (id: number) => {
      await deleteComment({
        variables: {
          input: {
            id,
          },
        },
      });
    },
    [deleteComment],
  );

  const commentsColumns: GridColDef[] = useMemo(
    () => [
      {
        field: 'photo.id',
        headerName: 'Photo',
        type: 'string',
        sortable: false,
        width: 70,
        valueGetter: ({ row }) => row.photo?.id,
        renderCell: ({ row }) => {
          const source = row.photo.image?.sources.find(
            (s: { size: number; type: string }) => s.size === 480 && s.type === 'image/avif',
          );
          const s3src =
            source?.s3Key != null
              ? `https://${row.photo.image.s3Bucket}.s3.amazonaws.com/${source?.s3Key}`
              : '';

          return (
            <Link to={`../photos/?id_eq=${row.photo.id}`}>
              <img
                src={s3src}
                alt=""
                css={css`
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                `}
              />
            </Link>
          );
        },
      },
      {
        field: 'id',
        headerName: 'ID',
        width: 50,
      },
      {
        field: 'user.id',
        headerName: 'User',
        type: 'string',
        width: 150,
        editable: false,
        valueGetter: ({ row }) => row.user?.id,
        renderCell: ({ row }) => (
          <MuiLink
            component={Link}
            to={`../users/?id_eq=${row.user.id}`}
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            <Avatar
              src={row.user.pictureUrl}
              css={css`
                width: 24px;
                height: 24px;
                margin-right: 8px;
              `}
            />
            {row.user.displayName}
          </MuiLink>
        ),
      },
      {
        field: 'body',
        headerName: 'Body',
        type: 'string',
        width: 440,
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
        field: 'isArchived',
        headerName: 'Archived',
        type: 'boolean',
        width: 100,
        editable: true,
      },
      {
        field: 'actions',
        headerName: 'Actions',
        headerAlign: 'right',
        type: 'actions',
        align: 'right',
        width: 200,
        getActions: (params) => [
          <StickPointerButton key="view">
            <Button
              size="small"
              component={Link}
              to={`/location/${params.row.photo.location.slug}/${params.row.photo.id}`}
              target="_blank"
            >
              view photo
            </Button>
          </StickPointerButton>,
          <StickPointerButton key="delete">
            <Button
              size="small"
              onClick={() => {
                // eslint-disable-next-line no-alert
                if (window.confirm(`Are you sure you want to delete comment?`)) {
                  handleDeleteComment(params.row.id);
                }
              }}
            >
              delete
            </Button>
          </StickPointerButton>,
        ],
      },
    ],
    [handleDeleteComment],
  );

  const commentsRows = useMemo(
    () => data.comments?.edges.map((edge) => edge.node) ?? [],
    [data.comments?.edges],
  );

  const handleUpdate = useCallback(
    async (row: (typeof commentsRows)[number]) => {
      const res = await updateComment({
        variables: {
          input: {
            id: row.id,
            patch: {
              body: row.body,
              isArchived: row.isArchived,
            },
          },
        },
      });

      return res.data?.updateComment?.comment;
    },
    [updateComment],
  );

  return (
    <>
      <Helmet>
        <title>{import.meta.env.VITE_BASE_TITLE} | Admin | Comments</title>
      </Helmet>
      <Container>
        <Snackbar open={error != null} autoHideDuration={6000} onClose={() => setError(null)}>
          <Alert severity="error">{error}</Alert>
        </Snackbar>
        <DataGrid
          css={css`
            height: 80vh;
          `}
          rows={commentsRows}
          columns={commentsColumns}
          loading={loading}
          processRowUpdate={(updatedRow) => handleUpdate(updatedRow)}
          onProcessRowUpdateError={(err) => {
            setError(err.message);
          }}
          slots={{
            loadingOverlay: LinearProgress,
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
