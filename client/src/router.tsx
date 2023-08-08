import { createBrowserRouter } from 'react-router-dom';
import type { Router } from '@remix-run/router/dist/router';
import { LayoutMain } from './app-components/layout-main.tsx';
import { App } from './app.tsx';
import { routeMainLoader } from './loaders/route-main-loader.ts';
import { routeLocationLoader } from './loaders/route-location-loader.ts';

// all routes of the app
// loaders are stored in a separate file to enable tree-shaking

export const router: Router = createBrowserRouter([
  {
    path: '*',
    element: <App />,
    children: [
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
            path: 'legal',
            lazy: async () => {
              const { RouteLegal } = await import('./routes/route-legal.tsx');
              return { Component: RouteLegal };
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
