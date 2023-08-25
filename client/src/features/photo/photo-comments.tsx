import React, { memo, useCallback, useRef, useState, Suspense, useTransition } from 'react';
import { useFragment, useMutation, useSuspenseQuery } from '@apollo/client';
import { css, Global, keyframes } from '@emotion/react';
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
  Link as MuiLink,
  Skeleton,
  useMediaQuery,
  type Theme,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns/esm';
import { LoadingButton } from '@mui/lab';
import { useInterval } from 'react-use/esm';
import { Link } from 'react-router-dom';
import useTheme from '@mui/material/styles/useTheme';
import { grey } from '@mui/material/colors';
import { notEmpty } from '../../utils/array.ts';
import { StickPointerButton, StickPointerText } from '../../ui-components/cursor.tsx';
import { Nl2Br } from '../../ui-components/nl2br.tsx';
import { graphql } from '../../__generated__';
import { useAppGoogleLogin } from '../../hooks/use-app-google-login.tsx';
import { useCurrentUser } from '../../hooks/use-user.ts';
import type { CommentsQueryQuery } from '../../__generated__/graphql.ts';
import { useSafeTimeout } from '../../hooks/use-safe-timeout.ts';
import { LoadMoreContainer } from '../../ui-components/load-more-conainer.tsx';
import { PullableDrawer } from '../../ui-components/pullable-drawer.tsx';

export const VIEW_TRANSITION_COMMENTS = 'photo-comments';
export const VIEW_TRANSITION_COMMENT_ITEM = 'photo-comment-item';

const PHOTO_COMMENTS_QUERY = graphql(`
  query PhotoComments($id: Int!, $after: Cursor, $first: Int!) {
    comments(condition: { photoId: $id }, orderBy: CREATED_AT_DESC, after: $after, first: $first)
      @connection(key: "PhotoComments_comments", filter: [$id]) {
      totalCount
      pageInfo {
        hasNextPage
        startCursor
        endCursor
      }
      edges {
        cursor
        node {
          id
          body
          createdAt
          user {
            id
            displayName
            pictureUrl
          }
          isArchived
        }
      }
    }
  }
`);

function Avatar({ pictureUrl, displayName }: { pictureUrl: string; displayName: string }) {
  const theme = useTheme();

  return (
    <div
      css={{
        width: 32,
        height: 32,
        borderRadius: '50%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `1px solid ${theme.vars.palette.divider}`,
        filter: 'grayscale(100%)',
      }}
    >
      <img
        src={pictureUrl}
        alt={displayName}
        referrerPolicy="no-referrer"
        css={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}

const PHOTO_COMMENTS_CREATE_COMMENT_MUTATION = graphql(`
  mutation CreateComment($comment: CommentInput!) {
    createComment(input: { comment: $comment }) {
      comment {
        id
        body
        createdAt
        user {
          id
          displayName
          pictureUrl
        }
        isArchived
      }
    }
  }
`);

const PHOTO_COMMENTS_UPDATE_COMMENT_MUTATION = graphql(`
  mutation UpdateComment($input: UpdateCommentInput!) {
    updateComment(input: $input) {
      comment {
        __typename
        id
        isArchived
      }
    }
  }
`);

interface CommentFormProps {
  photo: {
    id?: number;
  };
  incTmpId: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  firstCommentRef: React.RefObject<HTMLDivElement>;
}

function CommentForm({ photo, incTmpId, firstCommentRef, inputRef }: CommentFormProps) {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));
  const [loginWithGoogle, { loading: googleLoading }] = useAppGoogleLogin();
  const [currentUser] = useCurrentUser();
  const [body, setBody] = React.useState('');
  const formRef = React.useRef<HTMLFormElement>(null);
  const [createComment, { loading }] = useMutation(PHOTO_COMMENTS_CREATE_COMMENT_MUTATION, {
    update(cache, { data }) {
      cache.updateQuery(
        { query: PHOTO_COMMENTS_QUERY, variables: { id: photo.id!, first: 20 } },
        (qdata) => {
          if (qdata?.comments == null || data?.createComment?.comment == null) {
            return qdata;
          }

          return {
            ...qdata,
            comments: {
              ...qdata.comments,
              __typename: 'CommentsConnection' as const,
              totalCount: qdata.comments.totalCount + 1,
              edges: [
                {
                  __typename: 'CommentsEdge' as const,
                  cursor: data.createComment.comment.id,
                  node: data.createComment.comment,
                },
                ...qdata.comments!.edges,
              ],
            },
          };
        },
      );
    },
  });

  const handleSubmit = useCallback(async () => {
    incTmpId();
    setBody(body.trim());
    let user = currentUser;

    if (formRef.current?.reportValidity() !== true) {
      return;
    }

    if (currentUser == null) {
      user = await loginWithGoogle();
      if (user == null) {
        return;
      }
    }

    const commentFn = async () => {
      setBody('');
      await createComment({
        variables: {
          comment: {
            body,
            photoId: photo.id!,
          },
        },
        optimisticResponse(variables) {
          const { comment } = variables;
          if (user == null) {
            throw new Error('user is null');
          }

          return {
            createComment: {
              __typename: 'CreateCommentPayload' as const,
              comment: {
                __typename: 'Comment' as const,
                id: -1,
                body: comment.body,
                createdAt: new Date(),
                isArchived: false,
                user: {
                  __typename: 'User' as const,
                  id: user.id,
                  displayName: user.displayName,
                  pictureUrl: user.pictureUrl,
                },
              },
            },
          };
        },
      });
    };

    if ('startViewTransition' in document && !isMobile) {
      // swap the transition name between the input and the first comment to avoid collision
      // swap back once the transition is done
      inputRef.current?.style.setProperty('view-transition-name', VIEW_TRANSITION_COMMENT_ITEM);
      const transition = document.startViewTransition(async () => {
        inputRef.current?.style.removeProperty('view-transition-name');
        firstCommentRef.current?.style.setProperty(
          'view-transition-name',
          VIEW_TRANSITION_COMMENT_ITEM,
        );
        await commentFn();
      });
      await transition.ready;
      firstCommentRef.current?.style.removeProperty('view-transition-name');
    } else {
      await commentFn();
    }

    firstCommentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [
    body,
    createComment,
    currentUser,
    firstCommentRef,
    incTmpId,
    inputRef,
    isMobile,
    loginWithGoogle,
    photo.id,
  ]);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setBody(event.target.value);
    },
    [setBody],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit],
  );

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        handleSubmit();
      }}
      ref={formRef}
    >
      <FormControl fullWidth variant="outlined" disabled={loading}>
        <InputLabel htmlFor="field-body">Leave your thoughts...</InputLabel>
        <StickPointerText>
          <OutlinedInput
            id="field-body"
            multiline
            value={body}
            onChange={handleChange}
            maxRows={4}
            inputProps={{
              minLength: 2,
              required: true,
              ref: inputRef,
            }}
            label="Leave your thoughts..."
            endAdornment={
              <InputAdornment position="end">
                <StickPointerButton>
                  <LoadingButton type="submit" color="primary" loading={googleLoading}>
                    Send
                  </LoadingButton>
                </StickPointerButton>
              </InputAdornment>
            }
            onKeyDown={handleKeyDown}
          />
        </StickPointerText>
      </FormControl>
      {currentUser == null && body.length > 0 && (
        <Box p={1}>
          <Typography variant="caption" color="textSecondary">
            Continuing, you agree to the{' '}
            <MuiLink component={Link} to="/terms-of-service">
              terms of service
            </MuiLink>{' '}
            and the{' '}
            <MuiLink component={Link} to="/privacy-policy">
              privacy policy
            </MuiLink>
          </Typography>
        </Box>
      )}
    </form>
  );
}

const PHOTO_COMMENTS_PHOTO = graphql(`
  fragment PhotoComments_photo on Photo {
    __typename
    id
  }
`);

interface CommentProps {
  comment: NonNullable<CommentsQueryQuery['comments']>['edges'][number]['node'];
  firstCommentRef: React.RefObject<HTMLDivElement>;
  index: number;
  onDelete: () => void;
  onRevertDelete: () => void;
}

const getTimeAgo = (date: Date): string => {
  let timeAgo = formatDistanceToNow(new Date(date), {
    addSuffix: true,
  });
  // yep it's dirty
  if (timeAgo === 'less than a minute ago') {
    timeAgo = 'just now';
  }

  return timeAgo;
};

const widthAnimation = keyframes`
  to {
    width: 0;
  }
`;

const ARCHIVED_DELAY_S = 4;
const Countdown = memo(() => {
  const theme = useTheme();

  return (
    <div
      css={css`
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: ${theme.vars.palette.action.hover};
        animation: ${widthAnimation} ${ARCHIVED_DELAY_S}s linear forwards;
      `}
    />
  );
});

const Comment = memo(
  ({ comment, index, firstCommentRef, onDelete, onRevertDelete }: CommentProps) => {
    const theme = useTheme();
    const [currentUser] = useCurrentUser();
    const [timeAgoValue, setTimeAgoValue] = useState(getTimeAgo(comment.createdAt));
    const [hovered, setHovered] = useState(false);

    useInterval(() => {
      setTimeAgoValue(getTimeAgo(comment.createdAt));
    }, 1000 * 15);

    if (comment.isArchived) {
      return (
        <Box
          px={6}
          py={3}
          css={css`
            position: relative;
            display: grid;
            align-items: center;
          `}
        >
          <Countdown />
          <div>
            <StickPointerButton>
              <Button variant="text" color="inherit" onClick={onRevertDelete}>
                Revert
              </Button>
            </StickPointerButton>
          </div>
        </Box>
      );
    }

    const canDelete = currentUser?.id === comment.user?.id;

    return (
      <div
        css={css`
          position: relative;
        `}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {canDelete && (
          <div
            css={css`
              position: absolute;
              top: 0;
              bottom: 0;
              height: 100%;
              right: 0;
              aspect-ratio: 1/1;
              rotate: 90deg;
            `}
          >
            <StickPointerButton>
              <Button
                variant="text"
                color="inherit"
                size="small"
                css={css`
                  width: 100%;
                  border-radius: 0;
                `}
                onClick={() => {
                  onDelete();
                  setHovered(false);
                }}
              >
                delete
              </Button>
            </StickPointerButton>
          </div>
        )}
        <Box
          px={{ md: 0, lg: 4 }}
          py={2}
          gap={2}
          css={css`
            display: flex;
            transition: translate 0.2s var(--motion-easing-emphasized-decelerate);
            translate: ${hovered && canDelete ? '-42px 0' : '0 0'};
            background-color: ${theme.vars.palette.background.default};
            z-index: 1;
            &:hover {
              background-color: ${theme.vars.palette.action.hover};
            }

            ${theme.breakpoints.down('md')} {
              background-color: ${theme.palette.mode === 'light' ? '#fff' : grey[800]};
            }
          `}
        >
          <Avatar
            pictureUrl={comment.user?.pictureUrl ?? ''}
            displayName={comment.user?.displayName ?? ''}
          />
          <Box flexGrow={1}>
            <Box display="flex" gap={1} alignItems="center">
              <StickPointerText>
                <Typography variant="body2">{comment.user?.displayName}</Typography>
              </StickPointerText>
            </Box>
            <Box
              gap={2}
              css={css`
                position: relative;
                display: flex;
                align-items: center;
              `}
            >
              <Typography
                ref={index === 0 ? firstCommentRef : null}
                variant="body2"
                css={{
                  padding: 0,
                  margin: '8px 0',
                  width: 'fit-content',
                  maxWidth: '65%',
                }}
              >
                <StickPointerText>
                  <span>
                    <Nl2Br>{comment.body}</Nl2Br>
                  </span>
                </StickPointerText>
              </Typography>

              <Typography
                variant="caption"
                color={theme.vars.palette.text.disabled}
                textAlign="right"
                css={css`
                  position: absolute;
                  bottom: 0;
                  right: 0;
                `}
              >
                <time
                  dateTime={comment.createdAt.toISOString()}
                  title={comment.createdAt.toLocaleString()}
                >
                  {timeAgoValue}
                </time>
              </Typography>
            </Box>
          </Box>
        </Box>
      </div>
    );
  },
  (prevProps, nextProps) => prevProps.comment === nextProps.comment,
);

interface CommentsProps {
  photo: {
    __typename?: 'Photo';
    id?: number;
  };
  firstCommentRef: React.RefObject<HTMLDivElement>;
  tmpId: number;
}

const Comments = memo((props: CommentsProps) => {
  const [isPending, startTransition] = useTransition();
  const { firstCommentRef, tmpId, photo } = props;
  const [safeSetTimeout, safeClearTimeout] = useSafeTimeout();

  const PAGE_SIZE = 20;
  const { data, fetchMore, refetch } = useSuspenseQuery(PHOTO_COMMENTS_QUERY, {
    variables: {
      id: photo.id!,
      after: null,
      first: PAGE_SIZE,
    },
  });
  const comments = data.comments?.edges.map((edge) => edge.node) ?? [];

  const handleLoadMore = useCallback(() => {
    if (data.comments?.pageInfo.hasNextPage !== true) {
      return;
    }

    startTransition(() => {
      fetchMore({
        variables: {
          id: photo.id!,
          after: data.comments?.pageInfo.endCursor,
          first: PAGE_SIZE,
        },
      });
    });
  }, [data.comments?.pageInfo.endCursor, data.comments?.pageInfo.hasNextPage, fetchMore, photo.id]);

  const handleRefetch = useCallback(() => {
    startTransition(() => {
      refetch({
        id: photo.id!,
        after: null,
        first: comments.length + 1,
      });
    });
  }, [comments.length, photo.id, refetch]);

  const [updateComment] = useMutation(PHOTO_COMMENTS_UPDATE_COMMENT_MUTATION, {
    optimisticResponse(variables) {
      const { id, patch } = variables.input;
      return {
        updateComment: {
          __typename: 'UpdateCommentPayload' as const,
          comment: {
            __typename: 'Comment' as const,
            id,
            isArchived: patch.isArchived ?? false,
          },
        },
      };
    },
  });

  // archive comment, refetch query next, archived comments are excluded from the query
  const handleDelete = useCallback(
    async (id: number) => {
      await updateComment({
        variables: {
          input: {
            id,
            patch: {
              isArchived: true,
            },
          },
        },
      });
      safeSetTimeout(() => {
        handleRefetch();
      }, ARCHIVED_DELAY_S * 1000);
    },
    [handleRefetch, safeSetTimeout, updateComment],
  );

  // unarchive comment, on the server you can update it within 5 minutes
  const handleRevertDelete = useCallback(
    async (id: number) => {
      safeClearTimeout();
      await updateComment({
        variables: {
          input: {
            id,
            patch: {
              isArchived: false,
            },
          },
        },
      });
    },
    [safeClearTimeout, updateComment],
  );

  return (
    <Box
      css={css`
        position: relative;
        display: grid;
      `}
    >
      {comments.filter(notEmpty).map((comment, index) => (
        <Comment
          key={index === 0 ? tmpId : `comment-${comment.id}`}
          comment={comment}
          index={index}
          firstCommentRef={firstCommentRef}
          onDelete={() => handleDelete(comment.id)}
          onRevertDelete={() => handleRevertDelete(comment.id)}
        />
      ))}

      {data.comments?.pageInfo.hasNextPage === true && (
        <LoadMoreContainer loading={isPending} onLoadMore={handleLoadMore} />
      )}
    </Box>
  );
});

interface PhotoCommentsProps {
  photo: {
    __typename?: 'Photo';
    id?: number;
  };
}

export function PhotoComments(props: PhotoCommentsProps) {
  const { data: photo, complete } = useFragment({
    fragment: PHOTO_COMMENTS_PHOTO,
    fragmentName: 'PhotoComments_photo',
    from: props.photo,
  });
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const firstCommentRef = useRef<HTMLDivElement>(null);
  const [tmpId, setTmpId] = useState(0);
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const incTmpId = () => setTmpId((id) => id + 1);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!complete || photo.id == null) {
    return null;
  }

  if (isMobile) {
    return (
      <PullableDrawer title="Comments">
        <Box pt={1} pb={3}>
          <CommentForm
            photo={photo}
            incTmpId={incTmpId}
            inputRef={inputRef}
            firstCommentRef={firstCommentRef}
          />
        </Box>
        <Suspense
          fallback={
            <Box px={3}>
              <Skeleton height={72} />
            </Box>
          }
        >
          <Comments photo={photo} firstCommentRef={firstCommentRef} tmpId={tmpId} />
        </Suspense>
      </PullableDrawer>
    );
  }

  return (
    <>
      <Global
        styles={css`
          ::view-transition-old(${VIEW_TRANSITION_COMMENTS}),
          ::view-transition-new(${VIEW_TRANSITION_COMMENTS}) {
            animation: none;
            mix-blend-mode: normal;
          }

          ::view-transition-new(${VIEW_TRANSITION_COMMENTS}):only-child {
            animation:
              300ms var(--motion-easing-decelerate) both fade-in,
              300ms var(--motion-easing-emphasized-decelerate) both slide-from-right;
            animation-delay: 600ms;
          }

          ::view-transition-new(${VIEW_TRANSITION_COMMENT_ITEM}) {
            animation-timing-function: var(--motion-easing-emphasized);
            animation-duration: 800ms;
          }
          ::view-transition-old(${VIEW_TRANSITION_COMMENT_ITEM}) {
            animation-timing-function: var(--motion-easing-accelerated);
            animation-duration: 800ms;
          }
        `}
      />
      <Box
        pb={8}
        css={css`
          view-transition-name: ${VIEW_TRANSITION_COMMENTS};
          overflow: auto;
          max-height: 100%;
          grid-area: photo-comments;
          background-color: ${theme.vars.palette.background.paper};
          position: relative;
        `}
      >
        <Box
          px={4}
          pt={3}
          pb={1}
          css={css`
            backdrop-filter: blur(20px);
            top: 0;
            z-index: 1;
            position: sticky;
          `}
        >
          <Typography variant="h4">Comments</Typography>

          <Box py={3}>
            <CommentForm
              photo={photo}
              incTmpId={incTmpId}
              inputRef={inputRef}
              firstCommentRef={firstCommentRef}
            />
          </Box>
        </Box>
        <Suspense
          fallback={
            <Box px={3}>
              <Skeleton height={100} />
            </Box>
          }
        >
          <Comments photo={props.photo} tmpId={tmpId} firstCommentRef={firstCommentRef} />
        </Suspense>
      </Box>
    </>
  );
}
