/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n  mutation GetAccessToken {\n    getAccessToken(input: { fromCookie: true }) {\n      accessToken\n    }\n  }\n':
    types.GetAccessTokenDocument,
  '\n  fragment PhotoCard_photo on Photo {\n    id\n    width\n    height\n    blurhash\n    thumbnail\n    likesCount\n    image {\n      s3Bucket\n      sources {\n        type\n        s3Key\n        size\n      }\n    }\n    comments {\n      totalCount\n    }\n    location {\n      id\n      slug\n    }\n  }\n':
    types.PhotoCard_PhotoFragmentDoc,
  '\n  query PhotoComments($id: Int!, $after: Cursor, $first: Int!) {\n    comments(condition: { photoId: $id }, orderBy: CREATED_AT_DESC, after: $after, first: $first)\n      @connection(key: "PhotoComments_comments", filter: [$id]) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        startCursor\n        endCursor\n      }\n      edges {\n        cursor\n        node {\n          id\n          body\n          createdAt\n          user {\n            id\n            displayName\n            pictureUrl\n          }\n          isArchived\n        }\n      }\n    }\n  }\n':
    types.PhotoCommentsDocument,
  '\n  mutation CreateComment($comment: CommentInput!) {\n    createComment(input: { comment: $comment }) {\n      comment {\n        id\n        body\n        createdAt\n        user {\n          id\n          displayName\n          pictureUrl\n        }\n        isArchived\n      }\n    }\n  }\n':
    types.CreateCommentDocument,
  '\n  mutation UpdateComment($input: UpdateCommentInput!) {\n    updateComment(input: $input) {\n      comment {\n        __typename\n        id\n        isArchived\n      }\n    }\n  }\n':
    types.UpdateCommentDocument,
  '\n  fragment PhotoComments_photo on Photo {\n    __typename\n    id\n  }\n':
    types.PhotoComments_PhotoFragmentDoc,
  '\n  fragment PhotoHeader_photo on Photo {\n    id\n    location {\n      id\n      slug\n      name\n    }\n  }\n':
    types.PhotoHeader_PhotoFragmentDoc,
  '\n  fragment PhotoImage_photo on Photo {\n    id\n    location {\n      id\n      name\n    }\n    image {\n      s3Bucket\n      sources {\n        type\n        s3Key\n        size\n      }\n    }\n    width\n    height\n    blurhash\n  }\n':
    types.PhotoImage_PhotoFragmentDoc,
  '\n  fragment PhotoInfo_photo on Photo {\n    ...PhotoLikes_photo @nonreactive\n    __typename\n    id\n    shotAt\n    shutterSpeed\n    aperture\n    focalLength\n    camera\n    lens\n    iso\n    lat\n    lng\n  }\n':
    types.PhotoInfo_PhotoFragmentDoc,
  '\n  fragment PhotoLikes_photo on Photo {\n    id\n    likesCount\n  }\n':
    types.PhotoLikes_PhotoFragmentDoc,
  '\n  query PhotoLikesUserLikesQuery($photoId: Int!, $userId: Int!) {\n    photosLikeByUserIdAndPhotoId(photoId: $photoId, userId: $userId) {\n      id\n      count\n    }\n  }\n':
    types.PhotoLikesUserLikesQueryDocument,
  '\n  mutation PhotoLikesUpsertLikeMutation($input: UpsertPhotoLikeInput!) {\n    upsertPhotoLike(input: $input) {\n      photosLike {\n        id\n        count\n        photo {\n          __typename\n          id\n          likesCount\n        }\n      }\n    }\n  }\n':
    types.PhotoLikesUpsertLikeMutationDocument,
  '\n  mutation createImageUpload($input: CreateImageUploadInput!) {\n    createImageUpload(input: $input) {\n      url\n      fields\n      image {\n        id\n      }\n    }\n  }\n':
    types.CreateImageUploadDocument,
  '\n  mutation updateImage($input: UpdateImageInput!) {\n    updateImage(input: $input) {\n      image {\n        id\n        isUploaded\n      }\n    }\n  }\n':
    types.UpdateImageDocument,
  '\n  query LocationsByDistance($lat: Float!, $lng: Float!) {\n    locationsByDistance(lat: $lat, lng: $lng) {\n      nodes {\n        id\n        name\n      }\n    }\n  }\n':
    types.LocationsByDistanceDocument,
  '\n  mutation LoginWithGoogle($code: String!) {\n    loginWithGoogle(input: { code: $code, toCookie: true }) {\n      accessToken\n      refreshToken\n    }\n  }\n':
    types.LoginWithGoogleDocument,
  '\n  query CurrentUserQuery {\n    currentUser {\n      __typename\n      id\n      displayName\n      pictureUrl\n      role\n    }\n  }\n':
    types.CurrentUserQueryDocument,
  '\n  mutation LogoutMutation {\n    logout(input: { fromCookie: true })\n  }\n':
    types.LogoutMutationDocument,
  '\n  query LocationQuery($slug: String!, $after: Cursor, $first: Int!) {\n    location: locationBySlug(slug: $slug) {\n      id\n      name\n      slug\n      description\n      photos(orderBy: [SHOT_AT_DESC, CREATED_AT_DESC], after: $after, first: $first)\n        @connection(key: "RouteLocation_photos", filter: [$slug]) {\n        totalCount\n        pageInfo {\n          hasNextPage\n          startCursor\n          endCursor\n        }\n        edges {\n          cursor\n          node {\n            ...RoutePhoto_EssentialsFragment\n            ...PhotoCard_photo @nonreactive\n            id\n            width\n            height\n            blurhash\n            thumbnail\n            image {\n              s3Bucket\n              sources {\n                type\n                s3Key\n                size\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n':
    types.LocationQueryDocument,
  '\n  query RouteMainQuery {\n    locations {\n      nodes {\n        id\n        name\n        slug\n        description\n        geo {\n          x\n          y\n        }\n      }\n    }\n  }\n':
    types.RouteMainQueryDocument,
  '\n  query CommentsQuery {\n    comments(includeArchived: YES) {\n      totalCount\n      edges {\n        node {\n          id\n          body\n          isArchived\n          createdAt\n          user {\n            id\n            displayName\n            pictureUrl\n          }\n          photo {\n            id\n            location {\n              id\n              slug\n            }\n            image {\n              id\n              s3Key\n              s3Bucket\n              sources {\n                s3Key\n                size\n                type\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n':
    types.CommentsQueryDocument,
  '\n  mutation UpdateCommentMutation($input: UpdateCommentInput!) {\n    updateComment(input: $input) {\n      comment {\n        id\n        body\n        isArchived\n        createdAt\n        user {\n          id\n          displayName\n          pictureUrl\n        }\n        photo {\n          id\n          location {\n            id\n            slug\n          }\n          image {\n            id\n            s3Key\n            s3Bucket\n            sources {\n              s3Key\n              size\n              type\n            }\n          }\n        }\n      }\n    }\n  }\n':
    types.UpdateCommentMutationDocument,
  '\n  mutation DeleteCommentMutation($input: DeleteCommentInput!) {\n    deleteComment(input: $input) {\n      comment {\n        id\n      }\n    }\n  }\n':
    types.DeleteCommentMutationDocument,
  '\n  query RouteAdminLocationsQuery {\n    locations(includeArchived: YES) {\n      totalCount\n      edges {\n        node {\n          id\n          name\n          slug\n          description\n          photos {\n            totalCount\n          }\n          isArchived\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n        startCursor\n      }\n    }\n  }\n':
    types.RouteAdminLocationsQueryDocument,
  '\n  mutation createLocation($input: CreateLocationInput!) {\n    createLocation(input: $input) {\n      location {\n        id\n        name\n        slug\n        description\n        photos {\n          totalCount\n        }\n        isArchived\n      }\n    }\n  }\n':
    types.CreateLocationDocument,
  '\n  mutation updateLocation($input: UpdateLocationInput!) {\n    updateLocation(input: $input) {\n      location {\n        id\n        name\n        slug\n        description\n        photos {\n          totalCount\n        }\n        isArchived\n      }\n    }\n  }\n':
    types.UpdateLocationDocument,
  '\n  mutation deleteLocation($input: DeleteLocationInput!) {\n    deleteLocation(input: $input) {\n      location {\n        id\n        name\n        slug\n        description\n        photos {\n          totalCount\n        }\n        isArchived\n      }\n    }\n  }\n':
    types.DeleteLocationDocument,
  '\n              fragment NewLocation on Location {\n                id\n                name\n                slug\n                description\n                photos {\n                  totalCount\n                }\n                isArchived\n              }\n            ':
    types.NewLocationFragmentDoc,
  '\n  query RouteAdminPhotosQuery {\n    photos(includeArchived: YES) {\n      edges {\n        node {\n          id\n          isArchived\n          iso\n          shutterSpeed\n          aperture\n          focalLength\n          shotAt\n          createdAt\n          location {\n            id\n            name\n            slug\n          }\n          likesCount\n          lat\n          lng\n          comments {\n            totalCount\n          }\n          image {\n            id\n            s3Key\n            s3Bucket\n            sources {\n              s3Key\n              size\n              type\n            }\n          }\n          author {\n            id\n            displayName\n            pictureUrl\n          }\n        }\n      }\n    }\n  }\n':
    types.RouteAdminPhotosQueryDocument,
  '\n  mutation RouteAdminPhotosUpdatePhotoMutation($input: UpdatePhotoInput!) {\n    updatePhoto(input: $input) {\n      photo {\n        id\n        isArchived\n        iso\n        shutterSpeed\n        aperture\n        focalLength\n        shotAt\n        createdAt\n        location {\n          id\n          name\n          slug\n        }\n        likesCount\n        lat\n        lng\n        comments {\n          totalCount\n        }\n        image {\n          id\n          s3Key\n          s3Bucket\n          sources {\n            s3Key\n            size\n            type\n          }\n        }\n        author {\n          id\n          displayName\n          pictureUrl\n        }\n      }\n    }\n  }\n':
    types.RouteAdminPhotosUpdatePhotoMutationDocument,
  '\n  mutation RouteAdminPhotosDeletePhotoMutation($input: DeletePhotoInput!) {\n    deletePhoto(input: $input) {\n      photo {\n        id\n      }\n    }\n  }\n':
    types.RouteAdminPhotosDeletePhotoMutationDocument,
  '\n  query UsersQuery {\n    users(includeArchived: YES) {\n      totalCount\n      edges {\n        node {\n          id\n          displayName\n          createdAt\n          pictureUrl\n          authoredPhotos {\n            totalCount\n          }\n          comments {\n            totalCount\n          }\n          photosLikes {\n            totalCount\n          }\n          isArchived\n        }\n      }\n    }\n  }\n':
    types.UsersQueryDocument,
  '\n  mutation UpdateUserMutation($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      user {\n        id\n        displayName\n        createdAt\n        pictureUrl\n        authoredPhotos {\n          totalCount\n        }\n        comments {\n          totalCount\n        }\n        photosLikes {\n          totalCount\n        }\n        isArchived\n      }\n    }\n  }\n':
    types.UpdateUserMutationDocument,
  '\n  mutation DeleteUserMutation($input: DeleteUserInput!) {\n    deleteUser(input: $input) {\n      user {\n        id\n      }\n    }\n  }\n':
    types.DeleteUserMutationDocument,
  '\n  fragment RoutePhoto_EssentialsFragment on Photo {\n    ...PhotoInfo_photo @nonreactive\n    ...PhotoHeader_photo @nonreactive\n    ...PhotoImage_photo @nonreactive\n    id\n    location {\n      id\n      name\n      slug\n    }\n  }\n':
    types.RoutePhoto_EssentialsFragmentFragmentDoc,
  '\n  query RoutePhotoQuery($id: Int!) {\n    photo(id: $id) {\n      id\n      ...RoutePhoto_EssentialsFragment\n      ...PhotoComments_photo @nonreactive\n      ...PhotoLikes_photo @nonreactive\n    }\n  }\n':
    types.RoutePhotoQueryDocument,
  '\n  mutation CreatePhoto($input: CreatePhotoInput!) {\n    createPhoto(input: $input) {\n      photo {\n        id\n        location {\n          slug\n        }\n      }\n    }\n  }\n':
    types.CreatePhotoDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation GetAccessToken {\n    getAccessToken(input: { fromCookie: true }) {\n      accessToken\n    }\n  }\n',
): (typeof documents)['\n  mutation GetAccessToken {\n    getAccessToken(input: { fromCookie: true }) {\n      accessToken\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment PhotoCard_photo on Photo {\n    id\n    width\n    height\n    blurhash\n    thumbnail\n    likesCount\n    image {\n      s3Bucket\n      sources {\n        type\n        s3Key\n        size\n      }\n    }\n    comments {\n      totalCount\n    }\n    location {\n      id\n      slug\n    }\n  }\n',
): (typeof documents)['\n  fragment PhotoCard_photo on Photo {\n    id\n    width\n    height\n    blurhash\n    thumbnail\n    likesCount\n    image {\n      s3Bucket\n      sources {\n        type\n        s3Key\n        size\n      }\n    }\n    comments {\n      totalCount\n    }\n    location {\n      id\n      slug\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query PhotoComments($id: Int!, $after: Cursor, $first: Int!) {\n    comments(condition: { photoId: $id }, orderBy: CREATED_AT_DESC, after: $after, first: $first)\n      @connection(key: "PhotoComments_comments", filter: [$id]) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        startCursor\n        endCursor\n      }\n      edges {\n        cursor\n        node {\n          id\n          body\n          createdAt\n          user {\n            id\n            displayName\n            pictureUrl\n          }\n          isArchived\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query PhotoComments($id: Int!, $after: Cursor, $first: Int!) {\n    comments(condition: { photoId: $id }, orderBy: CREATED_AT_DESC, after: $after, first: $first)\n      @connection(key: "PhotoComments_comments", filter: [$id]) {\n      totalCount\n      pageInfo {\n        hasNextPage\n        startCursor\n        endCursor\n      }\n      edges {\n        cursor\n        node {\n          id\n          body\n          createdAt\n          user {\n            id\n            displayName\n            pictureUrl\n          }\n          isArchived\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreateComment($comment: CommentInput!) {\n    createComment(input: { comment: $comment }) {\n      comment {\n        id\n        body\n        createdAt\n        user {\n          id\n          displayName\n          pictureUrl\n        }\n        isArchived\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation CreateComment($comment: CommentInput!) {\n    createComment(input: { comment: $comment }) {\n      comment {\n        id\n        body\n        createdAt\n        user {\n          id\n          displayName\n          pictureUrl\n        }\n        isArchived\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateComment($input: UpdateCommentInput!) {\n    updateComment(input: $input) {\n      comment {\n        __typename\n        id\n        isArchived\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation UpdateComment($input: UpdateCommentInput!) {\n    updateComment(input: $input) {\n      comment {\n        __typename\n        id\n        isArchived\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment PhotoComments_photo on Photo {\n    __typename\n    id\n  }\n',
): (typeof documents)['\n  fragment PhotoComments_photo on Photo {\n    __typename\n    id\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment PhotoHeader_photo on Photo {\n    id\n    location {\n      id\n      slug\n      name\n    }\n  }\n',
): (typeof documents)['\n  fragment PhotoHeader_photo on Photo {\n    id\n    location {\n      id\n      slug\n      name\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment PhotoImage_photo on Photo {\n    id\n    location {\n      id\n      name\n    }\n    image {\n      s3Bucket\n      sources {\n        type\n        s3Key\n        size\n      }\n    }\n    width\n    height\n    blurhash\n  }\n',
): (typeof documents)['\n  fragment PhotoImage_photo on Photo {\n    id\n    location {\n      id\n      name\n    }\n    image {\n      s3Bucket\n      sources {\n        type\n        s3Key\n        size\n      }\n    }\n    width\n    height\n    blurhash\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment PhotoInfo_photo on Photo {\n    ...PhotoLikes_photo @nonreactive\n    __typename\n    id\n    shotAt\n    shutterSpeed\n    aperture\n    focalLength\n    camera\n    lens\n    iso\n    lat\n    lng\n  }\n',
): (typeof documents)['\n  fragment PhotoInfo_photo on Photo {\n    ...PhotoLikes_photo @nonreactive\n    __typename\n    id\n    shotAt\n    shutterSpeed\n    aperture\n    focalLength\n    camera\n    lens\n    iso\n    lat\n    lng\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment PhotoLikes_photo on Photo {\n    id\n    likesCount\n  }\n',
): (typeof documents)['\n  fragment PhotoLikes_photo on Photo {\n    id\n    likesCount\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query PhotoLikesUserLikesQuery($photoId: Int!, $userId: Int!) {\n    photosLikeByUserIdAndPhotoId(photoId: $photoId, userId: $userId) {\n      id\n      count\n    }\n  }\n',
): (typeof documents)['\n  query PhotoLikesUserLikesQuery($photoId: Int!, $userId: Int!) {\n    photosLikeByUserIdAndPhotoId(photoId: $photoId, userId: $userId) {\n      id\n      count\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation PhotoLikesUpsertLikeMutation($input: UpsertPhotoLikeInput!) {\n    upsertPhotoLike(input: $input) {\n      photosLike {\n        id\n        count\n        photo {\n          __typename\n          id\n          likesCount\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation PhotoLikesUpsertLikeMutation($input: UpsertPhotoLikeInput!) {\n    upsertPhotoLike(input: $input) {\n      photosLike {\n        id\n        count\n        photo {\n          __typename\n          id\n          likesCount\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation createImageUpload($input: CreateImageUploadInput!) {\n    createImageUpload(input: $input) {\n      url\n      fields\n      image {\n        id\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation createImageUpload($input: CreateImageUploadInput!) {\n    createImageUpload(input: $input) {\n      url\n      fields\n      image {\n        id\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation updateImage($input: UpdateImageInput!) {\n    updateImage(input: $input) {\n      image {\n        id\n        isUploaded\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation updateImage($input: UpdateImageInput!) {\n    updateImage(input: $input) {\n      image {\n        id\n        isUploaded\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query LocationsByDistance($lat: Float!, $lng: Float!) {\n    locationsByDistance(lat: $lat, lng: $lng) {\n      nodes {\n        id\n        name\n      }\n    }\n  }\n',
): (typeof documents)['\n  query LocationsByDistance($lat: Float!, $lng: Float!) {\n    locationsByDistance(lat: $lat, lng: $lng) {\n      nodes {\n        id\n        name\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation LoginWithGoogle($code: String!) {\n    loginWithGoogle(input: { code: $code, toCookie: true }) {\n      accessToken\n      refreshToken\n    }\n  }\n',
): (typeof documents)['\n  mutation LoginWithGoogle($code: String!) {\n    loginWithGoogle(input: { code: $code, toCookie: true }) {\n      accessToken\n      refreshToken\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query CurrentUserQuery {\n    currentUser {\n      __typename\n      id\n      displayName\n      pictureUrl\n      role\n    }\n  }\n',
): (typeof documents)['\n  query CurrentUserQuery {\n    currentUser {\n      __typename\n      id\n      displayName\n      pictureUrl\n      role\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation LogoutMutation {\n    logout(input: { fromCookie: true })\n  }\n',
): (typeof documents)['\n  mutation LogoutMutation {\n    logout(input: { fromCookie: true })\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query LocationQuery($slug: String!, $after: Cursor, $first: Int!) {\n    location: locationBySlug(slug: $slug) {\n      id\n      name\n      slug\n      description\n      photos(orderBy: [SHOT_AT_DESC, CREATED_AT_DESC], after: $after, first: $first)\n        @connection(key: "RouteLocation_photos", filter: [$slug]) {\n        totalCount\n        pageInfo {\n          hasNextPage\n          startCursor\n          endCursor\n        }\n        edges {\n          cursor\n          node {\n            ...RoutePhoto_EssentialsFragment\n            ...PhotoCard_photo @nonreactive\n            id\n            width\n            height\n            blurhash\n            thumbnail\n            image {\n              s3Bucket\n              sources {\n                type\n                s3Key\n                size\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query LocationQuery($slug: String!, $after: Cursor, $first: Int!) {\n    location: locationBySlug(slug: $slug) {\n      id\n      name\n      slug\n      description\n      photos(orderBy: [SHOT_AT_DESC, CREATED_AT_DESC], after: $after, first: $first)\n        @connection(key: "RouteLocation_photos", filter: [$slug]) {\n        totalCount\n        pageInfo {\n          hasNextPage\n          startCursor\n          endCursor\n        }\n        edges {\n          cursor\n          node {\n            ...RoutePhoto_EssentialsFragment\n            ...PhotoCard_photo @nonreactive\n            id\n            width\n            height\n            blurhash\n            thumbnail\n            image {\n              s3Bucket\n              sources {\n                type\n                s3Key\n                size\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query RouteMainQuery {\n    locations {\n      nodes {\n        id\n        name\n        slug\n        description\n        geo {\n          x\n          y\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query RouteMainQuery {\n    locations {\n      nodes {\n        id\n        name\n        slug\n        description\n        geo {\n          x\n          y\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query CommentsQuery {\n    comments(includeArchived: YES) {\n      totalCount\n      edges {\n        node {\n          id\n          body\n          isArchived\n          createdAt\n          user {\n            id\n            displayName\n            pictureUrl\n          }\n          photo {\n            id\n            location {\n              id\n              slug\n            }\n            image {\n              id\n              s3Key\n              s3Bucket\n              sources {\n                s3Key\n                size\n                type\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query CommentsQuery {\n    comments(includeArchived: YES) {\n      totalCount\n      edges {\n        node {\n          id\n          body\n          isArchived\n          createdAt\n          user {\n            id\n            displayName\n            pictureUrl\n          }\n          photo {\n            id\n            location {\n              id\n              slug\n            }\n            image {\n              id\n              s3Key\n              s3Bucket\n              sources {\n                s3Key\n                size\n                type\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateCommentMutation($input: UpdateCommentInput!) {\n    updateComment(input: $input) {\n      comment {\n        id\n        body\n        isArchived\n        createdAt\n        user {\n          id\n          displayName\n          pictureUrl\n        }\n        photo {\n          id\n          location {\n            id\n            slug\n          }\n          image {\n            id\n            s3Key\n            s3Bucket\n            sources {\n              s3Key\n              size\n              type\n            }\n          }\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation UpdateCommentMutation($input: UpdateCommentInput!) {\n    updateComment(input: $input) {\n      comment {\n        id\n        body\n        isArchived\n        createdAt\n        user {\n          id\n          displayName\n          pictureUrl\n        }\n        photo {\n          id\n          location {\n            id\n            slug\n          }\n          image {\n            id\n            s3Key\n            s3Bucket\n            sources {\n              s3Key\n              size\n              type\n            }\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeleteCommentMutation($input: DeleteCommentInput!) {\n    deleteComment(input: $input) {\n      comment {\n        id\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation DeleteCommentMutation($input: DeleteCommentInput!) {\n    deleteComment(input: $input) {\n      comment {\n        id\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query RouteAdminLocationsQuery {\n    locations(includeArchived: YES) {\n      totalCount\n      edges {\n        node {\n          id\n          name\n          slug\n          description\n          photos {\n            totalCount\n          }\n          isArchived\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n        startCursor\n      }\n    }\n  }\n',
): (typeof documents)['\n  query RouteAdminLocationsQuery {\n    locations(includeArchived: YES) {\n      totalCount\n      edges {\n        node {\n          id\n          name\n          slug\n          description\n          photos {\n            totalCount\n          }\n          isArchived\n        }\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n        startCursor\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation createLocation($input: CreateLocationInput!) {\n    createLocation(input: $input) {\n      location {\n        id\n        name\n        slug\n        description\n        photos {\n          totalCount\n        }\n        isArchived\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation createLocation($input: CreateLocationInput!) {\n    createLocation(input: $input) {\n      location {\n        id\n        name\n        slug\n        description\n        photos {\n          totalCount\n        }\n        isArchived\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation updateLocation($input: UpdateLocationInput!) {\n    updateLocation(input: $input) {\n      location {\n        id\n        name\n        slug\n        description\n        photos {\n          totalCount\n        }\n        isArchived\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation updateLocation($input: UpdateLocationInput!) {\n    updateLocation(input: $input) {\n      location {\n        id\n        name\n        slug\n        description\n        photos {\n          totalCount\n        }\n        isArchived\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation deleteLocation($input: DeleteLocationInput!) {\n    deleteLocation(input: $input) {\n      location {\n        id\n        name\n        slug\n        description\n        photos {\n          totalCount\n        }\n        isArchived\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation deleteLocation($input: DeleteLocationInput!) {\n    deleteLocation(input: $input) {\n      location {\n        id\n        name\n        slug\n        description\n        photos {\n          totalCount\n        }\n        isArchived\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n              fragment NewLocation on Location {\n                id\n                name\n                slug\n                description\n                photos {\n                  totalCount\n                }\n                isArchived\n              }\n            ',
): (typeof documents)['\n              fragment NewLocation on Location {\n                id\n                name\n                slug\n                description\n                photos {\n                  totalCount\n                }\n                isArchived\n              }\n            '];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query RouteAdminPhotosQuery {\n    photos(includeArchived: YES) {\n      edges {\n        node {\n          id\n          isArchived\n          iso\n          shutterSpeed\n          aperture\n          focalLength\n          shotAt\n          createdAt\n          location {\n            id\n            name\n            slug\n          }\n          likesCount\n          lat\n          lng\n          comments {\n            totalCount\n          }\n          image {\n            id\n            s3Key\n            s3Bucket\n            sources {\n              s3Key\n              size\n              type\n            }\n          }\n          author {\n            id\n            displayName\n            pictureUrl\n          }\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query RouteAdminPhotosQuery {\n    photos(includeArchived: YES) {\n      edges {\n        node {\n          id\n          isArchived\n          iso\n          shutterSpeed\n          aperture\n          focalLength\n          shotAt\n          createdAt\n          location {\n            id\n            name\n            slug\n          }\n          likesCount\n          lat\n          lng\n          comments {\n            totalCount\n          }\n          image {\n            id\n            s3Key\n            s3Bucket\n            sources {\n              s3Key\n              size\n              type\n            }\n          }\n          author {\n            id\n            displayName\n            pictureUrl\n          }\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RouteAdminPhotosUpdatePhotoMutation($input: UpdatePhotoInput!) {\n    updatePhoto(input: $input) {\n      photo {\n        id\n        isArchived\n        iso\n        shutterSpeed\n        aperture\n        focalLength\n        shotAt\n        createdAt\n        location {\n          id\n          name\n          slug\n        }\n        likesCount\n        lat\n        lng\n        comments {\n          totalCount\n        }\n        image {\n          id\n          s3Key\n          s3Bucket\n          sources {\n            s3Key\n            size\n            type\n          }\n        }\n        author {\n          id\n          displayName\n          pictureUrl\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation RouteAdminPhotosUpdatePhotoMutation($input: UpdatePhotoInput!) {\n    updatePhoto(input: $input) {\n      photo {\n        id\n        isArchived\n        iso\n        shutterSpeed\n        aperture\n        focalLength\n        shotAt\n        createdAt\n        location {\n          id\n          name\n          slug\n        }\n        likesCount\n        lat\n        lng\n        comments {\n          totalCount\n        }\n        image {\n          id\n          s3Key\n          s3Bucket\n          sources {\n            s3Key\n            size\n            type\n          }\n        }\n        author {\n          id\n          displayName\n          pictureUrl\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation RouteAdminPhotosDeletePhotoMutation($input: DeletePhotoInput!) {\n    deletePhoto(input: $input) {\n      photo {\n        id\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation RouteAdminPhotosDeletePhotoMutation($input: DeletePhotoInput!) {\n    deletePhoto(input: $input) {\n      photo {\n        id\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query UsersQuery {\n    users(includeArchived: YES) {\n      totalCount\n      edges {\n        node {\n          id\n          displayName\n          createdAt\n          pictureUrl\n          authoredPhotos {\n            totalCount\n          }\n          comments {\n            totalCount\n          }\n          photosLikes {\n            totalCount\n          }\n          isArchived\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  query UsersQuery {\n    users(includeArchived: YES) {\n      totalCount\n      edges {\n        node {\n          id\n          displayName\n          createdAt\n          pictureUrl\n          authoredPhotos {\n            totalCount\n          }\n          comments {\n            totalCount\n          }\n          photosLikes {\n            totalCount\n          }\n          isArchived\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation UpdateUserMutation($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      user {\n        id\n        displayName\n        createdAt\n        pictureUrl\n        authoredPhotos {\n          totalCount\n        }\n        comments {\n          totalCount\n        }\n        photosLikes {\n          totalCount\n        }\n        isArchived\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation UpdateUserMutation($input: UpdateUserInput!) {\n    updateUser(input: $input) {\n      user {\n        id\n        displayName\n        createdAt\n        pictureUrl\n        authoredPhotos {\n          totalCount\n        }\n        comments {\n          totalCount\n        }\n        photosLikes {\n          totalCount\n        }\n        isArchived\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation DeleteUserMutation($input: DeleteUserInput!) {\n    deleteUser(input: $input) {\n      user {\n        id\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation DeleteUserMutation($input: DeleteUserInput!) {\n    deleteUser(input: $input) {\n      user {\n        id\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  fragment RoutePhoto_EssentialsFragment on Photo {\n    ...PhotoInfo_photo @nonreactive\n    ...PhotoHeader_photo @nonreactive\n    ...PhotoImage_photo @nonreactive\n    id\n    location {\n      id\n      name\n      slug\n    }\n  }\n',
): (typeof documents)['\n  fragment RoutePhoto_EssentialsFragment on Photo {\n    ...PhotoInfo_photo @nonreactive\n    ...PhotoHeader_photo @nonreactive\n    ...PhotoImage_photo @nonreactive\n    id\n    location {\n      id\n      name\n      slug\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query RoutePhotoQuery($id: Int!) {\n    photo(id: $id) {\n      id\n      ...RoutePhoto_EssentialsFragment\n      ...PhotoComments_photo @nonreactive\n      ...PhotoLikes_photo @nonreactive\n    }\n  }\n',
): (typeof documents)['\n  query RoutePhotoQuery($id: Int!) {\n    photo(id: $id) {\n      id\n      ...RoutePhoto_EssentialsFragment\n      ...PhotoComments_photo @nonreactive\n      ...PhotoLikes_photo @nonreactive\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  mutation CreatePhoto($input: CreatePhotoInput!) {\n    createPhoto(input: $input) {\n      photo {\n        id\n        location {\n          slug\n        }\n      }\n    }\n  }\n',
): (typeof documents)['\n  mutation CreatePhoto($input: CreatePhotoInput!) {\n    createPhoto(input: $input) {\n      photo {\n        id\n        location {\n          slug\n        }\n      }\n    }\n  }\n'];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
