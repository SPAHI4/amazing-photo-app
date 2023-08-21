import {
  Box,
  Button,
  ButtonBase,
  Dialog,
  DialogTitle,
  Divider,
  Skeleton,
  Slide,
  SvgIcon,
  Tooltip,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { css, Global } from '@emotion/react';
import React, { Suspense } from 'react';
import { useFragment } from '@apollo/client';
import useTheme from '@mui/material/styles/useTheme';
import { convertShutterSpeed } from '../../utils/number.ts';
import {
  IconContentCopy,
  IconFacebook,
  IconMail,
  IconPrint,
  IconTelegram,
  IconTwitter,
} from '../../icons.tsx';
import { graphql } from '../../__generated__/gql.ts';
import { StickPointerButton } from '../../ui-components/cursor.tsx';
import { PhotoLikes } from './photo-likes.tsx';

function ExifItem({ children, title }: { children: React.ReactNode; title: string }) {
  const theme = useTheme();

  return (
    <Tooltip title={title}>
      <Box
        gap={1}
        css={css`
          display: flex;
          align-items: center;
          font-size: 2rem;
          font-weight: 600;
          font-family: ${theme.typography.h1.fontFamily};

          ${theme.breakpoints.down('md')} {
            font-size: 1.4rem;
          }
        `}
      >
        <span css={{ color: theme.vars.palette.text.disabled, opacity: 0.5 }}>{children}</span>
      </Box>
    </Tooltip>
  );
}

const ShareItem = React.memo(
  ({ icon, title, onClick }: { icon: React.ReactNode; title: string; onClick: () => void }) => (
    <StickPointerButton>
      <ButtonBase onClick={onClick} focusRipple>
        <Box
          gap={1}
          p={2}
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-size: 1.4rem;
          `}
        >
          {icon}
          <Typography variant="body1">{title}</Typography>
        </Box>
      </ButtonBase>
    </StickPointerButton>
  ),
);

const getGoogleMapsLink = (lat: number, lng: number) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

function ShareButton() {
  const theme = useTheme();
  const url = window.location.href;
  const text = 'Check out this awesome photo!';
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const canShare = 'share' in navigator;
  const [shareOpen, setShareOpen] = React.useState(false);

  const getShareUrl = React.useCallback(
    (platform: string) => {
      switch (platform) {
        case 'facebook':
          return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url,
          )}&quote=${encodeURIComponent(text)}`;
        case 'twitter':
          return `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text,
          )}&url=${encodeURIComponent(url)}`;
        case 'telegram':
          return isDesktop
            ? `https://telegram.me/share/msg?url=${encodeURIComponent(
                url,
              )}&text=${encodeURIComponent(text)}`
            : `tg://msg?text=${text}`;
        default:
          return '';
      }
    },
    [url, text, isDesktop],
  );

  const handleShare = React.useCallback(() => {
    if (!canShare) {
      setShareOpen(true);
      return;
    }

    navigator.share({
      title: text,
      url,
    });
  }, [canShare, url, text]);

  return (
    <>
      <StickPointerButton>
        <Button onClick={handleShare} color="inherit" variant="text">
          share
        </Button>
      </StickPointerButton>

      {!canShare && (
        <Dialog
          css={{
            '& .MuiDialog-root': {
              bottom: 0,
            },
          }}
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          TransitionComponent={Slide}
          TransitionProps={
            {
              direction: 'up',
            } as never
          }
        >
          <DialogTitle>Share</DialogTitle>
          <Box p={{ md: 0, lg: 2 }}>
            <Box display="grid" gap={{ md: 1, lg: 2 }} gridTemplateColumns="1fr 1fr 1fr" py={2}>
              <ShareItem
                icon={
                  <SvgIcon>
                    <IconContentCopy />
                  </SvgIcon>
                }
                title="Copy link"
                onClick={() => {
                  navigator.clipboard.writeText(url);
                }}
              />
              <ShareItem
                icon={
                  <SvgIcon>
                    <IconPrint />
                  </SvgIcon>
                }
                title="Print"
                onClick={() => {
                  window.print();
                }}
              />
              <ShareItem
                icon={
                  <SvgIcon>
                    <IconMail />
                  </SvgIcon>
                }
                title="Email"
                onClick={() => {
                  window.location.href = `mailto:?subject=${encodeURIComponent(
                    text,
                  )}&body=${encodeURIComponent(url)}`;
                }}
              />
            </Box>
            <Divider />
            <Box display="grid" gap={{ md: 1, lg: 2 }} gridTemplateColumns="1fr 1fr 1fr" py={2}>
              <ShareItem
                icon={
                  <SvgIcon>
                    <IconTelegram />
                  </SvgIcon>
                }
                title="Telegram"
                onClick={() => window.open(getShareUrl('telegram'), '_blank')}
              />
              <ShareItem
                icon={
                  <SvgIcon>
                    <IconFacebook />
                  </SvgIcon>
                }
                title="Facebook"
                onClick={() => window.open(getShareUrl('facebook'), '_blank')}
              />
              <ShareItem
                icon={
                  <SvgIcon>
                    <IconTwitter />
                  </SvgIcon>
                }
                title="Twitter"
                onClick={() => window.open(getShareUrl('twitter'), '_blank')}
              />
            </Box>
          </Box>
        </Dialog>
      )}
    </>
  );
}

const PHOTO_INFO_PHOTO = graphql(`
  fragment PhotoInfo_photo on Photo {
    ...PhotoLikes_photo @nonreactive
    __typename
    id
    shotAt
    shutterSpeed
    aperture
    focalLength
    camera
    lens
    iso
    lat
    lng
  }
`);

interface PhotoInfoProps {
  photo: {
    __typename?: 'Photo';
    id?: number;
  };
  setFullscreen: (
    fullscreen: boolean,
  ) => void | ((dispatchFn: (fullscreen: boolean) => void) => void);
}

export function PhotoInfo(props: PhotoInfoProps) {
  const theme = useTheme();
  const { data: photo } = useFragment({
    fragment: PHOTO_INFO_PHOTO,
    fragmentName: 'PhotoInfo_photo',
    from: props.photo,
  });

  return (
    <>
      <Global
        styles={css`
          ::view-transition-new(photo-info):only-child {
            animation:
              300ms var(--motion-easing-decelerate) both fade-in,
              400ms var(--motion-easing-emphasized-decelerate) both slide-from-bottom;
            animation-delay: 600ms;
          }
        `}
      />

      <Box
        css={css`
          view-transition-name: photo-info;
          grid-area: photo-info;
          display: grid;
          grid-template: 'info-exif info-likes info-actions' / 1fr auto 400px;
          align-content: center;
          background-color: ${theme.vars.palette.background.paper};
          height: 80px;

          ${theme.breakpoints.down('md')} {
            height: auto;
            align-self: start;
            background-color: transparent;
            grid-template:
              'info-likes' 1fr
              'info-exif' 1fr
              'info-actions' 1fr / 1fr;
            gap: 12px;
            padding: 12px 0;
          }
        `}
      >
        <Box
          px={4}
          css={css`
            display: flex;
            grid-area: info-exif;
            gap: 36px;

            ${theme.breakpoints.down('md')} {
              gap: 24px;
            }
          `}
        >
          <ExifItem title="Shutter speed">
            {convertShutterSpeed(photo.shutterSpeed ?? 0)}
            {(photo.shutterSpeed ?? 0) > 1 && <small>S</small>}
          </ExifItem>
          <ExifItem title="Aperture">F/{photo.aperture ?? 0}</ExifItem>
          <ExifItem title="ISO">{photo.iso ?? 0}</ExifItem>
          <ExifItem title="Focal length">
            {parseInt(photo.focalLength ?? '', 10)}
            <small>mm</small>
          </ExifItem>
        </Box>

        <Suspense fallback={<Skeleton width={200} />}>
          <PhotoLikes photo={photo} />
        </Suspense>

        <Box
          gap={1}
          px={{ xs: 2, md: 4 }}
          css={css`
            grid-area: info-actions;
            display: flex;
            justify-content: end;
            align-items: center;
          `}
        >
          <StickPointerButton>
            <Button onClick={() => props.setFullscreen(true)} variant="text" color="inherit">
              fullscreen
            </Button>
          </StickPointerButton>
          {photo.lat != null && photo.lng != null && (
            <StickPointerButton>
              <Button
                component="a"
                variant="text"
                color="inherit"
                href={getGoogleMapsLink(photo.lat, photo.lng)}
                target="_blank"
              >
                on map
              </Button>
            </StickPointerButton>
          )}

          <ShareButton />
        </Box>
      </Box>
    </>
  );
}
