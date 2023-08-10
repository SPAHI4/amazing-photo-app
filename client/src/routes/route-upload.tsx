import React from 'react';
import { Container, Paper, Typography } from '@mui/material';
import { css } from '@emotion/react';
import { useForm } from 'react-hook-form';
import Grid from '@mui/material/Unstable_Grid2';
import { useMutation } from '@apollo/client';
import useTheme from '@mui/material/styles/useTheme';
import { UploadCardInformation } from '../features/upload/upload-card-information.tsx';
import { Transition } from '../ui-components/transition.tsx';
import { graphql } from '../__generated__/gql.ts';
import { UploadCardImage } from '../features/upload/upload-card-image.tsx';
import { UploadCardMore, UploadCardViewImage } from '../features/upload/upload-cards.tsx';
import { RouteUploadFormValues, UploadStep } from '../features/upload/upload-types.ts';

const CREATE_PHOTO_MUTATION = graphql(`
  mutation CreatePhoto($input: CreatePhotoInput!) {
    createPhoto(input: $input) {
      photo {
        id
        location {
          slug
        }
      }
    }
  }
`);

function Card({ children }: { children: React.ReactNode }) {
  const theme = useTheme();

  return (
    <Paper
      css={{
        border: `1px solid ${theme.vars.palette.divider}`,
      }}
    >
      {children}
    </Paper>
  );
}

export function RouteUpload() {
  const form = useForm<RouteUploadFormValues>({
    defaultValues: {
      uploadStep: UploadStep.Image,
      locationId: '',
    },
  });
  const [uploadStep] = form.watch(['uploadStep']);

  const [createPhoto, { data: mutationData, loading }] = useMutation(CREATE_PHOTO_MUTATION);
  const onSubmit = React.useCallback(
    async (values: RouteUploadFormValues) => {
      if (values.url == null) {
        throw new Error('Missing image URL');
      }
      if (values.imageId == null) {
        throw new Error('Missing image id');
      }

      await createPhoto({
        variables: {
          input: {
            photo: {
              url: values.url,
              iso: values.iso,
              width: values.width ?? 0,
              height: values.height ?? 0,
              aperture: values.aperture?.toString(),
              shutterSpeed: values.shutterSpeed,
              focalLength: values.focalLength?.toString(),
              locationId: Number.parseInt(values.locationId, 10),
              lat: values.lat,
              lng: values.lng,
              shotAt: values.shotAt,
              blurhash: values.blurhash,
              thumbnail: values.thumbnail,
              imageId: values.imageId,
            },
          },
        },
      });

      form.setValue('uploadStep', UploadStep.Done);
    },
    [createPhoto, form],
  );

  return (
    <Container
      css={css`
        display: grid;
        grid-template-rows: auto 1fr;
      `}
    >
      <Typography variant="h1">Upload</Typography>
      <Grid container spacing={2} py={4}>
        {['image', 'info'].includes(uploadStep) && (
          <Grid md={6} xs={12}>
            <Transition transition="fade">
              <Card>
                <UploadCardImage form={form} />
              </Card>
            </Transition>
          </Grid>
        )}
        {uploadStep === 'info' && (
          <Grid md={6} xs={12}>
            <Transition transition="fade" duration={600} delay={200}>
              <Card>
                <UploadCardInformation form={form} onSubmit={onSubmit} loading={loading} />
              </Card>
            </Transition>
          </Grid>
        )}

        {uploadStep === 'done' && (
          <>
            <Grid md={6} xs={12}>
              <Transition transition="fade" delay={1800}>
                <Card>
                  <UploadCardMore form={form} />
                </Card>
              </Transition>
            </Grid>

            <Grid md={6} xs={12}>
              <Transition transition="fade">
                <Card>
                  <UploadCardViewImage createdPhotoPayload={mutationData?.createPhoto} />
                </Card>
              </Transition>
            </Grid>
          </>
        )}
      </Grid>
    </Container>
  );
}
