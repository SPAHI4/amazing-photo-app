import { Box, Button, SvgIcon, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { StickPointerButton } from '../../ui-components/cursor.tsx';
import { CreatePhotoMutation } from '../../__generated__/graphql.ts';
import { Transition } from '../../ui-components/transition.tsx';
import { IconArrowBack, IconArrowForward } from '../../icons.tsx';
import { RouteUploadFormValues, UploadStep } from './upload-types.ts';

type CardMoreProps = {
  form: ReturnType<typeof useForm<RouteUploadFormValues>>;
};

export function UploadCardMore({ form }: CardMoreProps) {
  return (
    <Box p={3}>
      <Typography variant="subtitle1" gutterBottom={false}>
        Have some more?
      </Typography>
      <Typography variant="h3">Do it again</Typography>
      <Box p={3} mt={2}>
        <StickPointerButton>
          <Button
            variant="outlined"
            size="large"
            onClick={() => {
              form.reset({
                uploadStep: UploadStep.Image,
                locationId: '',
              });
            }}
            startIcon={
              <SvgIcon>
                <IconArrowBack />
              </SvgIcon>
            }
          >
            Back
          </Button>
        </StickPointerButton>
      </Box>
    </Box>
  );
}

type CardViewImageProps = {
  createdPhotoPayload: CreatePhotoMutation['createPhoto'];
};

export function UploadCardViewImage({ createdPhotoPayload }: CardViewImageProps) {
  return (
    <Box p={3}>
      <Transition transition="fade-slide" delay={100}>
        <Typography variant="subtitle1" gutterBottom={false}>
          Great job!
        </Typography>
      </Transition>
      <Transition transition="fade-slide" delay={700}>
        <Box display="grid" gap={1}>
          <Typography variant="h3">New image added</Typography>
          <Typography variant="body1">
            However, it should being processing for about a minute
          </Typography>
        </Box>
      </Transition>

      <Box display="flex" justifyContent="flex-end" p={3} mt={2}>
        <Transition transition="fade-bounce" delay={1000} duration={800}>
          <StickPointerButton>
            <Button
              component={Link}
              to={`/location/${createdPhotoPayload?.photo?.location?.slug}/${createdPhotoPayload?.photo?.id}`}
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              endIcon={
                <SvgIcon>
                  <IconArrowForward />
                </SvgIcon>
              }
            >
              Check it out
            </Button>
          </StickPointerButton>
        </Transition>
      </Box>
    </Box>
  );
}
