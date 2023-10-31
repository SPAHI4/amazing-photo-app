import { useCallback, useEffect, useRef } from 'react';
import { animated, config, useSpring, useTrail } from '@react-spring/web';
import { Box, Divider, SvgIcon, useMediaQuery } from '@mui/material';
import { css } from '@emotion/react';
import { useFragment, useMutation, useSuspenseQuery } from '@apollo/client';
import useTheme from '@mui/material/styles/useTheme';
import { LoadingButton } from '@mui/lab';
import { graphql } from '../../__generated__';
import { StickPointerButton } from '../../ui-components/cursor.tsx';
import { useCurrentUser } from '../../hooks/use-user.ts';
import { useAppGoogleLogin } from '../../hooks/use-app-google-login.tsx';
import { IconFavoriteFilled } from '../../icons.tsx';
import { useCursor } from '../../hooks/use-cursor.ts';

const PHOTO_LIKES_PHOTO = graphql(`
  fragment PhotoLikes_photo on Photo {
    id
    likesCount
  }
`);

const PHOTO_LIKES_QUERY = graphql(`
  query PhotoLikesUserLikesQuery($photoId: Int!, $userId: Int!) {
    photosLikeByUserIdAndPhotoId(photoId: $photoId, userId: $userId) {
      id
      count
    }
  }
`);

const PHOTO_LIKES_UPSERT_LIKE_MUTATION = graphql(`
  mutation PhotoLikesUpsertLikeMutation($input: UpsertPhotoLikeInput!) {
    upsertPhotoLike(input: $input) {
      photosLike {
        id
        count
        photo {
          __typename
          id
          likesCount
        }
      }
    }
  }
`);

interface PhotoLikesProps {
  photo: {
    __typename?: 'Photo';
    id?: number;
  };
}

export function PhotoLikes(props: PhotoLikesProps) {
  const maxCount = 5;
  const texts = [
    'Like it?',
    'Really like it!',
    'Absolutely nice!',
    'Outstanding!',
    'Insanely good!',
    'All-time fave!',
  ] satisfies unknown[] & { length: 6 };

  const [currentUser] = useCurrentUser();
  const [loginWithGoogle, { loading: googleLoading }] = useAppGoogleLogin();
  const theme = useTheme();
  const { data } = useSuspenseQuery(PHOTO_LIKES_QUERY, {
    variables: {
      photoId: props.photo.id ?? -1,
      userId: currentUser?.id ?? -1,
    },
  });

  const { data: photo } = useFragment({
    fragment: PHOTO_LIKES_PHOTO,
    fragmentName: 'PhotoLikes_photo',
    from: props.photo,
  });

  const [upsertPhotoLike] = useMutation(PHOTO_LIKES_UPSERT_LIKE_MUTATION, {
    optimisticResponse({ input }) {
      const { photoid, count } = input;

      return {
        upsertPhotoLike: {
          __typename: 'UpsertPhotoLikePayload' as const,
          photosLike: {
            __typename: 'PhotosLike' as const,
            id: -1,
            count: count ?? 0,
            photo: {
              __typename: 'Photo' as const,
              id: photoid ?? -1,
              likesCount: (photo.likesCount ?? 0) + (count === 0 ? -maxCount : 1),
            },
          },
        },
      };
    },
    update(cache, result) {
      const photosLike = result.data?.upsertPhotoLike?.photosLike;
      if (photosLike == null) {
        return;
      }
      cache.writeQuery({
        query: PHOTO_LIKES_QUERY,
        variables: {
          photoId: photosLike.photo!.id,
          userId: currentUser!.id,
        },
        data: {
          photosLikeByUserIdAndPhotoId: {
            __typename: 'PhotosLike' as const,
            id: photosLike.id!,
            count: photosLike.count!,
          },
        },
      });
    },
  });

  const userLikesCount = data.photosLikeByUserIdAndPhotoId?.count ?? 0;
  const likesCount = photo.likesCount ?? 0;

  const { cursorRef } = useCursor();

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const ICON_SIZE = isMobile ? 40 : 50;
  const HALF_ICON_SIZE = ICON_SIZE / 2;

  const [buttonProps, buttonApi] = useSpring(() => ({
    from: {
      scaleX: 1,
      translateX: '0',
      transformOrigin: 'center center',
    },
    reset: true,
    loop: true,
    duration: 1000,
    onChange: ({ value }) => {
      cursorRef.current?.style.setProperty('--cursor-scale-x', value.scaleX);
    },
  }));

  const handleLike = useCallback(async () => {
    buttonApi.start({
      from: { scaleX: 0.6, translateX: '-20px' },
      to: { scaleX: 1, translateX: '0' },
    });

    if (currentUser == null) {
      await loginWithGoogle();
    }

    await upsertPhotoLike({
      variables: {
        input: {
          photoid: photo.id,
          count: userLikesCount === maxCount ? 0 : userLikesCount + 1,
        },
      },
    });
  }, [buttonApi, currentUser, upsertPhotoLike, photo.id, userLikesCount, loginWithGoogle]);

  // show maximum 5 (from current user) + 1 (from other users) icons
  const visibleLikesCount = Math.min(likesCount, maxCount + 1);

  const likesArray = Array.from({ length: visibleLikesCount }, (_, i) => i);

  const [trail, trailApi] = useTrail(
    likesArray.length,
    () => ({
      translateX: '0%',
      scale: 1,
    }),
    [likesArray.length],
  );

  // run counter animation on likesCount change, animate value and translateX to move to the left by the count of visible likes
  const [counterProps] = useSpring(
    () => ({
      likesCount,
      translateX: `-${visibleLikesCount * HALF_ICON_SIZE + HALF_ICON_SIZE}px`,
      to: {
        likesCount,
        translateX: `-${visibleLikesCount * HALF_ICON_SIZE}px`,
      },
      config: {
        ...config.wobbly,
        mass: 1.2,
      },
      delay: (visibleLikesCount + 1) * ICON_SIZE,
      reset: true,
    }),
    [likesCount, visibleLikesCount],
  );

  const isFirstRender = useRef(true);

  // run trail animation on likesCount change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // added icon is animated from the very right to it's position on the left
    // all other icons are animated like a wave, shaking from the added icon touch
    trailApi.start((index) => {
      const currentIndex = index + 1;
      const isSelected = currentIndex === visibleLikesCount;
      let position = isSelected ? `${currentIndex * 50}%` : '-50%';
      let scaleValue = isSelected && index > 0 ? 3 : 1.2;
      const duration = isSelected ? currentIndex * 1200 : 600;
      const configOptions = {
        ...config.wobbly,
        mass: Math.max(currentIndex / (maxCount * 4), 1),
      };
      if (userLikesCount === 0) {
        position = '-100%';
        scaleValue = 1;
      }

      return {
        from: {
          translateX: position,
          scale: scaleValue,
        },
        to: {
          scale: 1,
          translateX: '0',
        },
        delay: index + 1 === visibleLikesCount ? 0 : (index + 1) * ICON_SIZE,
        duration,
        config: configOptions,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [likesCount]);

  return (
    <Box
      mr={2}
      css={css`
        grid-area: info-likes;
        display: flex;
        align-items: center;
        justify-content: end;
      `}
    >
      <Box
        mr={5}
        css={css`
          display: flex;
          align-items: center;
          position: relative;
          margin-top: 3px;
          translate: ${visibleLikesCount * HALF_ICON_SIZE}px 0;
        `}
      >
        <animated.div
          style={counterProps}
          css={css`
            font-family: ${theme.typography.h1.fontFamily};
            font-size: 3.6rem;
            font-weight: 600;
            color: ${theme.vars.palette.text.primary};
            padding-right: 6px;
            margin-right: -${visibleLikesCount * HALF_ICON_SIZE}px;

            ${theme.breakpoints.down('md')} {
              font-size: 2.8rem;
            }
          `}
        >
          {likesCount > 0 && counterProps.likesCount.to((value) => Math.max(Math.round(value), 1))}
        </animated.div>

        {trail.reverse().map((style, index) => (
          <animated.span
            style={{
              ...style,
              transformOrigin: 'center center',
              position: 'relative',
              zIndex: visibleLikesCount - index,
              left: `${-index * HALF_ICON_SIZE}px`,
            }}
            key={
              // eslint-disable-next-line react/no-array-index-key
              index
            }
          >
            <SvgIcon
              css={css`
                --color: ${(index + 1) * 15 - 15}%;
                font-size: ${ICON_SIZE}px;
                position: relative;
                color: hsl(0, 0%, var(--color));

                ${theme.getColorSchemeSelector('dark')} {
                  --color: ${100 - (index + 1) * 10}%;
                }
              `}
            >
              <IconFavoriteFilled />
            </SvgIcon>
          </animated.span>
        ))}
      </Box>

      <animated.div style={buttonProps}>
        <StickPointerButton>
          <LoadingButton
            onClick={handleLike}
            color="inherit"
            variant={userLikesCount === maxCount ? 'contained' : 'text'}
            loading={googleLoading}
            css={css`
              width: 200px;
              font-size: 1.2rem;
              position: relative;
              right: 0;
              z-index: 10;
              transform-origin: center center;

              ${theme.breakpoints.down('md')} {
                width: 180px;
                font-size: 1rem;
              }
            `}
          >
            {texts[userLikesCount]}
          </LoadingButton>
        </StickPointerButton>
      </animated.div>

      <Divider
        orientation="vertical"
        css={css`
          margin-right: -16px;
          margin-left: 16px;
          height: 40px;

          ${theme.breakpoints.down('md')} {
            display: none;
          }
        `}
      />
    </Box>
  );
}
