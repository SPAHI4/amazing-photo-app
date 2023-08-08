import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  SvgIcon,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { css } from '@emotion/react';
import { useSuspenseQuery } from '@apollo/client';
import { Suspense, useEffect } from 'react';
import { LoadingButton } from '@mui/lab';
import type { RouteUploadFormValues } from '../../routes/route-upload.tsx';
import { graphql } from '../../__generated__/gql.ts';
import { Transition } from '../../ui-components/transition.tsx';
import { convertShutterSpeed } from '../../utils/number.ts';
import { StickPointerButton } from '../../ui-components/cursor.tsx';
import { IconArrowForward } from '../../icons.tsx';

type UploadCardInformationProps = {
  form: ReturnType<typeof useForm<RouteUploadFormValues>>;
  onSubmit: (data: RouteUploadFormValues) => void;
  loading: boolean;
};

const locationsByDistanceQuery = graphql(`
  query LocationsByDistance($lat: Float!, $lng: Float!) {
    locationsByDistance(lat: $lat, lng: $lng) {
      nodes {
        id
        name
      }
    }
  }
`);

function LocationsSelect({ form }: { form: ReturnType<typeof useForm<RouteUploadFormValues>> }) {
  const values = form.watch();
  const { data } = useSuspenseQuery(locationsByDistanceQuery, {
    variables: {
      lng: values.lng ?? 0,
      lat: values.lat ?? 0,
    },
  });

  useEffect(() => {
    const firstLocation = data.locationsByDistance?.nodes[0];
    if (firstLocation != null) {
      form.setValue('locationId', firstLocation.id.toLocaleString());
    }
  }, [data.locationsByDistance?.nodes, form]);

  return (
    <Box display="grid" gap={2}>
      <Typography variant="h5">
        {values.lat != null && values.lng != null ? (
          <>So, its location is</>
        ) : (
          <>Choose a location (GPS data unavailable)</>
        )}
      </Typography>
      <FormControl variant="outlined" fullWidth required>
        <InputLabel id="field-location">Location</InputLabel>
        <Select
          labelId="field-location"
          id="field-location"
          value={values.locationId.toString()}
          onChange={(event: SelectChangeEvent<string>) => {
            form.setValue('locationId', event.target.value);
          }}
          label="Location"
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {data.locationsByDistance?.nodes.map((location) => (
            <MenuItem key={location.name} value={location.id.toString()}>
              {location.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

export function UploadCardInformation({ form, onSubmit, loading }: UploadCardInformationProps) {
  const values = form.watch();

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      css={css`
        display: grid;
      `}
    >
      <Box p={3}>
        <Transition transition="fade-slide" delay={300}>
          <Typography variant="subtitle1" gutterBottom={false}>
            ... Moving on ...
          </Typography>
        </Transition>
        <Transition transition="fade-slide" delay={1200}>
          <Typography variant="h3">Add some information</Typography>
        </Transition>
      </Box>

      <Transition transition="fade" delay={2000}>
        <Box p={3} display="grid" gap={3}>
          <Suspense fallback={<div>Loading...</div>}>
            <LocationsSelect form={form} />
          </Suspense>
          <Typography variant="h5">Technical things</Typography>
          <Box display="flex" alignItems="center" justifyContent="space-evenly" gap={2}>
            <Typography
              variant="subtitle1"
              css={css`
                display: flex;
                align-items: center;
              `}
            >
              {values.aperture}
            </Typography>
            <Typography
              variant="subtitle1"
              css={css`
                display: flex;
                align-items: center;
              `}
            >
              {convertShutterSpeed(values.shutterSpeed ?? 0)}
            </Typography>
            <Typography
              variant="subtitle1"
              css={css`
                display: flex;
                align-items: center;
              `}
            >
              <Chip label="ISO" css={{ marginRight: 8 }} /> {values.iso}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end" p={3} mb={2}>
          <StickPointerButton>
            <LoadingButton
              type="submit"
              color="primary"
              size="large"
              endIcon={
                <SvgIcon>
                  <IconArrowForward />
                </SvgIcon>
              }
              loading={loading}
              disabled={values.imageId == null}
            >
              Finish
            </LoadingButton>
          </StickPointerButton>
        </Box>
      </Transition>
    </form>
  );
}
