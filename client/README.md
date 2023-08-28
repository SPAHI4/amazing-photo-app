# Client package

Frontend app build with React and TS

## Vite

There were 2 options considered for the client app architecture:
- [next.js](https://nextjs.org/)
- [vite](https://vitejs.dev/)

Next.js is a framework that provides a lot of features out of the box, including SSR, routing, code splitting, etc. It is a great choice for a large scale app, but it is an overkill for a small app like this one.
Especially considering that google is able to index SPA apps, so SEO is not a problem anymore. 

For og:image and other meta tags support, aws lambda function could be used in the future.
So the choice was made in favor of vite, which is really fast and lightweight.

## Development

Vite provides a great dev experience out of the box. It has a built-in dev server with hot module replacement and fast build times.

To start the app in dev mode, run:
```bash
pnpm dev
```

## Data and state

GraphQL is the best choice for almost any app regardless of its size.
Typed data with codegen, persisted queries, caching, scalars and many other features make it industry standard.

There were 3 client libraries considered:
- Apollo
- Urql
- Relay

Apollo and Urql are very similar, but Urql is more lightweight and a bit faster.
Therefore, Apollo has a really good caching mechanism, and it is useful even for this small app.
Relay has its own pros, but it is not a good choice for a small app, because it requires a lot of boilerplate code. 
Some good practices from Relay were used in this app, like strict fragments validation and [paginating](src/apollo-client.ts#L239)

## UI, styling and components

Material UI is one of the most popular UI libraries for React. It has a lot of components and friendly API.
Also, it uses emotion under the hood, which is a great CSS-in-JS library.

My personal preference is `css` template string. Though it could look a bit redundant comparing to tailwind or "dirty" comparing to styled-components way,
it has great readability and IDE support. Performance is still great because of swc plugin.

## Routing and directory structure

`react-router` is an industry standard for routing in React apps, so it was an obvious choice.

To enable [startViewTransition](https://developer.chrome.com/docs/web-platform/view-transitions/) support, `@remix-run/router` is [patched](../patches), wrapping `completeNavigation` function implementation internally.

Directory structure is quite simple:
- .src/
  - app-components: contains app specific components like header, footer, etc. they could include data fetching logic
  - ui-components: contains reusable components like buttons, inputs, etc
  - routes: contains all routes and pages, each route could have its own loader that is handled by `react-router` and simple logic
  - features: contains complex features that could be reused across the app and are too large to be placed in a route
  - loaders: almost redundant directory, `react-router` could use `useTransition` flag to handle loading state caused by `useSuspenseQuery` hooks, but it doesn't work well with `startViewTransition` api
  - hooks
  - utils
  - \_\_generated__: contains generated types for graphql queries and mutations, tracked by git to simplify CI/CD and transparent commit history

## Libraries worth mentioning
- [react-hook-form](https://react-hook-form.com/) - great library for forms with built-in validation and performance optimizations
- react-use
- 

## Security and auth

Client app is using JWT for authentication. 

Access token is stored in the memory and is not persisted anywhere.

Refresh token is stored in cookies with proper `httpOnly`, `secure` and `sameSite` flags.

Every time when the app is loaded, it tries to get a new access token from the server using refresh token.
In case of success, the new access token is stored in the memory and is used for all subsequent requests.

Any graphql queries are queued within apollo link until the access token is received.


For graphql security, we use persisted queries that works seamlessly with graphql codegen and postgraphile.


[source](src/apollo-client.ts#L53)

## Error handling

Sentry is used for error tracking. It is a great tool with a lot of features and integrations. 
React error boundaries are used to catch errors in the UI and send them to Sentry.

To simplify graphql errors handling in UI, we use simple Observer pattern to show errors in the same place.

## Performance

The app is quite small so basic optimizations are enough for now. It includes:

- code splitting: packages are groped by chunks, so only required code is loaded. `rollup-plugin-visualizer` is used to analyze bundle size
- lazy loading: implemented with `React.lazy`, `Suspense` and `react-router` it is easy to support and has good UI fallback
- caching: apollo client has a built-in caching mechanism, so it is easy to implement and use
- swc: it is a great alternative to babel, it is faster and has better tree shaking
- cache-control: it is used to cache static assets from S3
- preload and preconnect: it is used to speed up fonts and api requests
- images are resized and loaded on demand with loading="lazy", decoding="async" and srcset

there are some downsides though:
- no server side rendering
- fonts take a big role in the app visuals, so we can't use `font-display: swap` for them. So yes, waiting for fonts greatly affects TTI
- HDR images are unstable now, so they are the main performance bottleneck. Some hacks were used to make them work better, but it is still not perfect
- There are a lot of visual effects and animations, so it is hard to make them work smoothly on all devices


## Accessibility

Basic accessibility features are implemented by default with Material UI components and linted with eslint-plugin-jsx-a11y


## Browser support

The app targets modern browsers only with ES2020 features support. It makes build size smaller and performance better.

Mobile browsers are supported as well, there are some issues with HDR images though.

## Testing

**TBD**

## [Deployment](../terraform/README.md#deploy-client)
