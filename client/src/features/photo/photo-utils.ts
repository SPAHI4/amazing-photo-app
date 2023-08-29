export const preloadImageLink = (src: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;

  document.head.appendChild(link);

  return link;
};

type ImageSize = 2560 | 960 | 3840 | 480 | 1440;

export const getSourceSrc = (
  image: {
    s3Bucket: string;
    sources:
      | ({
          type?: string | null | undefined;
          s3Key?: string | null | undefined;
          size?: number | null | undefined;
        } | null)[]
      | null;
  },
  size: ImageSize,
  type: string,
) => {
  const source = image.sources?.find((src) => src?.size === size && src.type === type);

  return source != null ? `https://${image.s3Bucket}.s3.amazonaws.com/${source.s3Key}` : null;
};
