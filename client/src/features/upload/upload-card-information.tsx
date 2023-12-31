import {
  Box,
  FormControl,
  InputAdornment,
  InputLabel,
  Link as MuiLink,
  MenuItem,
  Select,
  SelectChangeEvent,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { css } from '@emotion/react';
import { useSuspenseQuery } from '@apollo/client';
import { Suspense, useEffect, useRef, useTransition } from 'react';
import { LoadingButton } from '@mui/lab';
import { Link } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import CircularProgress from '@mui/material/CircularProgress';
import { graphql } from '../../__generated__';
import { Transition } from '../../ui-components/transition.tsx';
import { convertShutterSpeed } from '../../utils/number.ts';
import { StickPointerButton } from '../../ui-components/cursor.tsx';
import { IconArrowForward } from '../../icons.tsx';
import { RouteUploadFormValues } from './upload-types.ts';

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
        geo {
          x
          y
        }
      }
    }
  }
`);

const libraries = ['places'];

function MapPicker({ form }: { form: ReturnType<typeof useForm<RouteUploadFormValues>> }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: libraries as never,
  });
  const [, startTransition] = useTransition();

  const [lat, lng, locationId] = form.watch(['lat', 'lng', 'locationId']);

  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  useEffect(() => {
    if (lat != null && lng != null) {
      mapRef.current?.setCenter({ lat, lng });
      markerRef.current?.setPosition({ lat, lng });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationId]);

  if (lng == null || lat == null) {
    return null;
  }

  return (
    <>
      <Box>
        {isLoaded && (
          <Autocomplete
            onLoad={(autocomplete) => {
              autocomplete.addListener('place_changed', () => {
                const place = autocomplete.getPlace();

                if (place.geometry?.location != null) {
                  startTransition(() => {
                    form.setValue('lat', place.geometry!.location!.lat());
                    form.setValue('lng', place.geometry!.location!.lng());
                    form.setValue('locationId', '');
                  });
                }
              });
            }}
          >
            <TextField
              label="Search for a location"
              variant="outlined"
              fullWidth
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }}
            />
          </Autocomplete>
        )}
      </Box>
      <Box
        css={css`
          height: 300px;
          width: 100%;
        `}
      >
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={{
              height: '100%',
              width: '100%',
            }}
            zoom={15}
            center={{ lat, lng }}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
            }}
            onLoad={(map) => {
              mapRef.current = map;
              markerRef.current = new google.maps.Marker({
                position: { lat, lng },
                map,
                draggable: true,
              });

              google.maps.event.addListener(markerRef.current, 'dragend', () => {
                const position = markerRef.current?.getPosition();
                if (position != null) {
                  startTransition(() => {
                    form.setValue('lat', position.lat());
                    form.setValue('lng', position.lng());
                  });
                }
              });
            }}
          />
        )}
      </Box>
    </>
  );
}

interface LocationsSelectProps {
  form: ReturnType<typeof useForm<RouteUploadFormValues>>;
}

function LocationsSelect({ form }: LocationsSelectProps) {
  const values = form.watch();
  const { data } = useSuspenseQuery(locationsByDistanceQuery, {
    variables: {
      lng: values.lng ?? 0,
      lat: values.lat ?? 0,
    },
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const firstLocation = data.locationsByDistance?.nodes[0];
    if (firstLocation != null) {
      startTransition(() => {
        form.setValue('locationId', firstLocation.id.toLocaleString());

        if (values.lat == null && values.lng == null) {
          form.setValue('lat', firstLocation.geo.x);
          form.setValue('lng', firstLocation.geo.y);
        }
      });
    }
  }, [data.locationsByDistance?.nodes, form, values.lat, values.lng]);

  return (
    <Box display="grid" gap={2}>
      <Box>
        <Typography variant="h5" gutterBottom>
          It was taken, precisely
        </Typography>
        <MapPicker form={form} />
      </Box>
      <Typography variant="h5">So, its location is...</Typography>
      <FormControl variant="outlined" fullWidth required>
        <InputLabel id="field-location">Location</InputLabel>
        <Select
          labelId="field-location"
          id="field-location"
          value={values.locationId.toString()}
          onChange={(event: SelectChangeEvent<string>) => {
            const location = data.locationsByDistance?.nodes.find(
              (loc) => loc.id.toString() === event.target.value,
            );

            if (location != null) {
              form.setValue('locationId', location.id.toString());
              form.setValue('lat', location.geo.x);
              form.setValue('lng', location.geo.y);
            }
          }}
          label="Location"
          endAdornment={
            <InputAdornment position="end">{isPending && <CircularProgress />}</InputAdornment>
          }
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

  const canSubmit = values.imageId != null && values.lng != null && values.lat != null;

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
          <Typography variant="h5">Photo details</Typography>
          <Box display="flex" gap={6}>
            <Typography
              variant="h5"
              css={css`
                display: flex;
                align-items: center;
              `}
            >
              F/{values.aperture}
            </Typography>
            <Typography
              variant="h5"
              css={css`
                display: flex;
                align-items: center;
              `}
            >
              {convertShutterSpeed(values.shutterSpeed ?? 0)}
            </Typography>
            <Typography
              variant="h5"
              css={css`
                display: flex;
                align-items: center;
              `}
            >
              {values.iso}
            </Typography>
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end" p={4}>
          <div>
            <StickPointerButton>
              <LoadingButton
                type="submit"
                color="primary"
                size="large"
                variant="contained"
                endIcon={
                  <SvgIcon>
                    <IconArrowForward />
                  </SvgIcon>
                }
                loading={loading}
                disabled={!canSubmit}
              >
                Finish
              </LoadingButton>
            </StickPointerButton>
          </div>
        </Box>

        <Box px={3} py={2}>
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
      </Transition>
    </form>
  );
}
