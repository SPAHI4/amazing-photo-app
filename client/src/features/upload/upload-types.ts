export enum UploadStep {
  Image = 'image',
  Info = 'info',
  Done = 'done',
}

export type RouteUploadFormValues = {
  uploadStep: UploadStep;
  imageId: number | null;
  url: string | null;
  thumbnail: string | null;
  locationId: string;
  shotAt: Date | null;
  width: number | null;
  height: number | null;
  lat: number | null;
  lng: number | null;
  camera: string | null;
  lens: string | null;
  focalLength: number | null;
  iso: number | null;
  aperture: number | null;
  shutterSpeed: number | null;
  blurhash: string;
};
