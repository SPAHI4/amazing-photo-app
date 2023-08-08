// mui.d.ts

export {};

// Declare a module augmentation for '@mui/material/Typography'
declare module '@mui/material/Typography' {
  // declare the additional property for the `variant` prop
  interface TypographyPropsVariantOverrides {
    quote: true;
  }
}
