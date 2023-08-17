import { createBrowserRouter } from 'react-router-dom';
import type { Router } from '@remix-run/router/dist/router';
import { LayoutMain } from './app-components/layout-main.tsx';
import { App } from './app.tsx';
import { routeMainLoader } from './loaders/route-main-loader.ts';
import { routeLocationLoader } from './loaders/route-location-loader.ts';
import { RouteError } from './routes/route-error.tsx';

// all routes of the app
// loaders are stored in a separate file to enable tree-shaking
// possible solution to replace loaders is using react router setTransition flag with suspense query, but it doesn't work with patched react router vith startViewTransition api

export const router: Router = createBrowserRouter([
  {
    path: '*',
    element: <App />,
    children: [
      {
        path: '*',
        element: <LayoutMain />,
        children: [
          {
            path: '*',
            element: <RouteError />,
          },
        ],
      },
      {
        element: <LayoutMain />,
        children: [
          {
            index: true,
            loader: routeMainLoader,
            lazy: async () => {
              const { RouteMain } = await import('./routes/route-main.tsx');
              return { Component: RouteMain };
            },
          },
          {
            path: 'terms-of-service',
            lazy: async () => {
              const { RouteTerms } = await import('./routes/route-terms.tsx');
              return { Component: RouteTerms };
            },
          },
          {
            path: 'privacy-policy',
            lazy: async () => {
              const { RoutePolicy } = await import('./routes/route-policy.tsx');
              return { Component: RoutePolicy };
            },
          },
          {
            path: 'location/:slug',
            loader: routeLocationLoader,
            lazy: async () => {
              const { RouteLocation } = await import('./routes/route-location.tsx');
              return { Component: RouteLocation };
            },
          },
          import.meta.env.VITE_UPLOAD_ENABLED === 'true'
            ? {
                path: 'upload',
                lazy: async () => {
                  const { RouteUpload } = await import('./routes/route-upload.tsx');
                  return { Component: RouteUpload };
                },
              }
            : {},
        ],
      },

      {
        path: 'location/:slug/:photoId',
        lazy: async () => {
          const { RoutePhoto } = await import('./routes/route-photo.tsx');
          return { Component: RoutePhoto };
        },
      },

      {
        path: 'admin',
        lazy: async () => {
          const { LayoutAdmin } = await import('./app-components/layout-admin.tsx');
          return { Component: LayoutAdmin };
        },
        children: [
          {
            path: 'locations',
            lazy: async () => {
              const { RouteAdminLocations } = await import('./routes/route-admin-locations.tsx');
              return { Component: RouteAdminLocations };
            },
          },
          {
            path: 'photos',
            lazy: async () => {
              const { RouteAdminPhotos } = await import('./routes/route-admin-photos.tsx');
              return { Component: RouteAdminPhotos };
            },
          },
          {
            path: 'comments',
            lazy: async () => {
              const { RouteAdminComments } = await import('./routes/route-admin-comments.tsx');
              return { Component: RouteAdminComments };
            },
          },
          {
            path: 'users',
            lazy: async () => {
              const { RouteAdminUsers } = await import('./routes/route-admin-users.tsx');
              return { Component: RouteAdminUsers };
            },
          },
        ],
      },
    ],
  },
]);
