/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  /** Binary data encoded using Base64 */
  Base64EncodedBinary: { input: any; output: any };
  /** A location in a connection that can be used for resuming pagination. */
  Cursor: { input: any; output: any };
  /**
   * A point in time as described by the [ISO
   * 8601](https://en.wikipedia.org/wiki/ISO_8601) standard. May or may not include a timezone.
   */
  Datetime: { input: Date; output: Date };
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { input: Record<string, unknown>; output: Record<string, unknown> };
  /**
   * A JSON Web Token defined by [RFC 7519](https://tools.ietf.org/html/rfc7519)
   * which securely represents claims between two parties.
   */
  JwtToken: { input: any; output: any };
};

export type Comment = Node & {
  __typename?: 'Comment';
  archivedAt?: Maybe<Scalars['Datetime']['output']>;
  body: Scalars['String']['output'];
  createdAt: Scalars['Datetime']['output'];
  id: Scalars['Int']['output'];
  isArchived: Scalars['Boolean']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads a single `Photo` that is related to this `Comment`. */
  photo?: Maybe<Photo>;
  photoId: Scalars['Int']['output'];
  updatedAt: Scalars['Datetime']['output'];
  /** Reads a single `User` that is related to this `Comment`. */
  user?: Maybe<User>;
  userId: Scalars['Int']['output'];
};

/** A condition to be used against `Comment` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type CommentCondition = {
  /** Checks for equality with the object’s `archivedAt` field. */
  archivedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `body` field. */
  body?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `isArchived` field. */
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `photoId` field. */
  photoId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['Int']['input']>;
};

/** An input for mutations affecting `Comment` */
export type CommentInput = {
  archivedAt?: InputMaybe<Scalars['Datetime']['input']>;
  body: Scalars['String']['input'];
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  photoId: Scalars['Int']['input'];
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Represents an update to a `Comment`. Fields that are set will be updated. */
export type CommentPatch = {
  archivedAt?: InputMaybe<Scalars['Datetime']['input']>;
  body?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  photoId?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};

/** A connection to a list of `Comment` values. */
export type CommentsConnection = {
  __typename?: 'CommentsConnection';
  /** A list of edges which contains the `Comment` and cursor to aid in pagination. */
  edges: Array<CommentsEdge>;
  /** A list of `Comment` objects. */
  nodes: Array<Comment>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Comment` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Comment` edge in the connection. */
export type CommentsEdge = {
  __typename?: 'CommentsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Comment` at the end of the edge. */
  node: Comment;
};

/** Methods to use when ordering `Comment`. */
export enum CommentsOrderBy {
  ArchivedAtAsc = 'ARCHIVED_AT_ASC',
  ArchivedAtDesc = 'ARCHIVED_AT_DESC',
  BodyAsc = 'BODY_ASC',
  BodyDesc = 'BODY_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IsArchivedAsc = 'IS_ARCHIVED_ASC',
  IsArchivedDesc = 'IS_ARCHIVED_DESC',
  Natural = 'NATURAL',
  PhotoIdAsc = 'PHOTO_ID_ASC',
  PhotoIdDesc = 'PHOTO_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
}

/** All input for the create `Comment` mutation. */
export type CreateCommentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Comment` to be created by this mutation. */
  comment: CommentInput;
};

/** The output of our create `Comment` mutation. */
export type CreateCommentPayload = {
  __typename?: 'CreateCommentPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Comment` that was created by this mutation. */
  comment?: Maybe<Comment>;
  /** An edge for our `Comment`. May be used by Relay 1. */
  commentEdge?: Maybe<CommentsEdge>;
  /** Reads a single `Photo` that is related to this `Comment`. */
  photo?: Maybe<Photo>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Comment`. */
  user?: Maybe<User>;
};

/** The output of our create `Comment` mutation. */
export type CreateCommentPayloadCommentEdgeArgs = {
  orderBy?: InputMaybe<Array<CommentsOrderBy>>;
};

/** All input for the create `Image` mutation. */
export type CreateImageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Image` to be created by this mutation. */
  image: ImageInput;
};

/** The output of our create `Image` mutation. */
export type CreateImagePayload = {
  __typename?: 'CreateImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Image` that was created by this mutation. */
  image?: Maybe<Image>;
  /** An edge for our `Image`. May be used by Relay 1. */
  imageEdge?: Maybe<ImagesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Image`. */
  user?: Maybe<User>;
};

/** The output of our create `Image` mutation. */
export type CreateImagePayloadImageEdgeArgs = {
  orderBy?: InputMaybe<Array<ImagesOrderBy>>;
};

export type CreateImageUploadInput = {
  contentType: Scalars['String']['input'];
};

export type CreateImageUploadPayload = {
  __typename?: 'CreateImageUploadPayload';
  image: Image;
  signedUrl: Scalars['String']['output'];
};

/** All input for the create `Location` mutation. */
export type CreateLocationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Location` to be created by this mutation. */
  location: LocationInput;
};

/** The output of our create `Location` mutation. */
export type CreateLocationPayload = {
  __typename?: 'CreateLocationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Location` that was created by this mutation. */
  location?: Maybe<Location>;
  /** An edge for our `Location`. May be used by Relay 1. */
  locationEdge?: Maybe<LocationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `Location` mutation. */
export type CreateLocationPayloadLocationEdgeArgs = {
  orderBy?: InputMaybe<Array<LocationsOrderBy>>;
};

/** All input for the create `Photo` mutation. */
export type CreatePhotoInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `Photo` to be created by this mutation. */
  photo: PhotoInput;
};

/** The output of our create `Photo` mutation. */
export type CreatePhotoPayload = {
  __typename?: 'CreatePhotoPayload';
  /** Reads a single `User` that is related to this `Photo`. */
  author?: Maybe<User>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Image` that is related to this `Photo`. */
  image?: Maybe<Image>;
  /** Reads a single `Location` that is related to this `Photo`. */
  location?: Maybe<Location>;
  /** The `Photo` that was created by this mutation. */
  photo?: Maybe<Photo>;
  /** An edge for our `Photo`. May be used by Relay 1. */
  photoEdge?: Maybe<PhotosEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our create `Photo` mutation. */
export type CreatePhotoPayloadPhotoEdgeArgs = {
  orderBy?: InputMaybe<Array<PhotosOrderBy>>;
};

/** All input for the create `PhotosLike` mutation. */
export type CreatePhotosLikeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `PhotosLike` to be created by this mutation. */
  photosLike: PhotosLikeInput;
};

/** The output of our create `PhotosLike` mutation. */
export type CreatePhotosLikePayload = {
  __typename?: 'CreatePhotosLikePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Photo` that is related to this `PhotosLike`. */
  photo?: Maybe<Photo>;
  /** The `PhotosLike` that was created by this mutation. */
  photosLike?: Maybe<PhotosLike>;
  /** An edge for our `PhotosLike`. May be used by Relay 1. */
  photosLikeEdge?: Maybe<PhotosLikesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `PhotosLike`. */
  user?: Maybe<User>;
};

/** The output of our create `PhotosLike` mutation. */
export type CreatePhotosLikePayloadPhotosLikeEdgeArgs = {
  orderBy?: InputMaybe<Array<PhotosLikesOrderBy>>;
};

/** All input for the create `User` mutation. */
export type CreateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The `User` to be created by this mutation. */
  user: UserInput;
};

/** The output of our create `User` mutation. */
export type CreateUserPayload = {
  __typename?: 'CreateUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `User` that was created by this mutation. */
  user?: Maybe<User>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>;
};

/** The output of our create `User` mutation. */
export type CreateUserPayloadUserEdgeArgs = {
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** All input for the `deleteCommentByNodeId` mutation. */
export type DeleteCommentByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Comment` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deleteComment` mutation. */
export type DeleteCommentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

/** The output of our delete `Comment` mutation. */
export type DeleteCommentPayload = {
  __typename?: 'DeleteCommentPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Comment` that was deleted by this mutation. */
  comment?: Maybe<Comment>;
  /** An edge for our `Comment`. May be used by Relay 1. */
  commentEdge?: Maybe<CommentsEdge>;
  deletedCommentNodeId?: Maybe<Scalars['ID']['output']>;
  /** Reads a single `Photo` that is related to this `Comment`. */
  photo?: Maybe<Photo>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Comment`. */
  user?: Maybe<User>;
};

/** The output of our delete `Comment` mutation. */
export type DeleteCommentPayloadCommentEdgeArgs = {
  orderBy?: InputMaybe<Array<CommentsOrderBy>>;
};

/** All input for the `deleteImageByNodeId` mutation. */
export type DeleteImageByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Image` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deleteImage` mutation. */
export type DeleteImageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

/** The output of our delete `Image` mutation. */
export type DeleteImagePayload = {
  __typename?: 'DeleteImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedImageNodeId?: Maybe<Scalars['ID']['output']>;
  /** The `Image` that was deleted by this mutation. */
  image?: Maybe<Image>;
  /** An edge for our `Image`. May be used by Relay 1. */
  imageEdge?: Maybe<ImagesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Image`. */
  user?: Maybe<User>;
};

/** The output of our delete `Image` mutation. */
export type DeleteImagePayloadImageEdgeArgs = {
  orderBy?: InputMaybe<Array<ImagesOrderBy>>;
};

/** All input for the `deleteLocationByNodeId` mutation. */
export type DeleteLocationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Location` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deleteLocation` mutation. */
export type DeleteLocationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

/** The output of our delete `Location` mutation. */
export type DeleteLocationPayload = {
  __typename?: 'DeleteLocationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedLocationNodeId?: Maybe<Scalars['ID']['output']>;
  /** The `Location` that was deleted by this mutation. */
  location?: Maybe<Location>;
  /** An edge for our `Location`. May be used by Relay 1. */
  locationEdge?: Maybe<LocationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `Location` mutation. */
export type DeleteLocationPayloadLocationEdgeArgs = {
  orderBy?: InputMaybe<Array<LocationsOrderBy>>;
};

/** All input for the `deletePhotoByNodeId` mutation. */
export type DeletePhotoByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Photo` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deletePhoto` mutation. */
export type DeletePhotoInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

/** The output of our delete `Photo` mutation. */
export type DeletePhotoPayload = {
  __typename?: 'DeletePhotoPayload';
  /** Reads a single `User` that is related to this `Photo`. */
  author?: Maybe<User>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedPhotoNodeId?: Maybe<Scalars['ID']['output']>;
  /** Reads a single `Image` that is related to this `Photo`. */
  image?: Maybe<Image>;
  /** Reads a single `Location` that is related to this `Photo`. */
  location?: Maybe<Location>;
  /** The `Photo` that was deleted by this mutation. */
  photo?: Maybe<Photo>;
  /** An edge for our `Photo`. May be used by Relay 1. */
  photoEdge?: Maybe<PhotosEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our delete `Photo` mutation. */
export type DeletePhotoPayloadPhotoEdgeArgs = {
  orderBy?: InputMaybe<Array<PhotosOrderBy>>;
};

/** All input for the `deletePhotosLikeByIdAndPhotoId` mutation. */
export type DeletePhotosLikeByIdAndPhotoIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  photoId: Scalars['Int']['input'];
};

/** All input for the `deletePhotosLikeByNodeId` mutation. */
export type DeletePhotosLikeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `PhotosLike` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deletePhotosLikeByUserIdAndPhotoId` mutation. */
export type DeletePhotosLikeByUserIdAndPhotoIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  photoId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

/** All input for the `deletePhotosLike` mutation. */
export type DeletePhotosLikeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

/** The output of our delete `PhotosLike` mutation. */
export type DeletePhotosLikePayload = {
  __typename?: 'DeletePhotosLikePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedPhotosLikeNodeId?: Maybe<Scalars['ID']['output']>;
  /** Reads a single `Photo` that is related to this `PhotosLike`. */
  photo?: Maybe<Photo>;
  /** The `PhotosLike` that was deleted by this mutation. */
  photosLike?: Maybe<PhotosLike>;
  /** An edge for our `PhotosLike`. May be used by Relay 1. */
  photosLikeEdge?: Maybe<PhotosLikesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `PhotosLike`. */
  user?: Maybe<User>;
};

/** The output of our delete `PhotosLike` mutation. */
export type DeletePhotosLikePayloadPhotosLikeEdgeArgs = {
  orderBy?: InputMaybe<Array<PhotosLikesOrderBy>>;
};

/** All input for the `deleteUserByNodeId` mutation. */
export type DeleteUserByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `User` to be deleted. */
  nodeId: Scalars['ID']['input'];
};

/** All input for the `deleteUser` mutation. */
export type DeleteUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
};

/** The output of our delete `User` mutation. */
export type DeleteUserPayload = {
  __typename?: 'DeleteUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  deletedUserNodeId?: Maybe<Scalars['ID']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `User` that was deleted by this mutation. */
  user?: Maybe<User>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>;
};

/** The output of our delete `User` mutation. */
export type DeleteUserPayloadUserEdgeArgs = {
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** All input for the `dropAllPolicies` mutation. */
export type DropAllPoliciesInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  schemaNameIn?: InputMaybe<Scalars['String']['input']>;
  tableNameIn?: InputMaybe<Scalars['String']['input']>;
};

/** The output of our `dropAllPolicies` mutation. */
export type DropAllPoliciesPayload = {
  __typename?: 'DropAllPoliciesPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

export type GetAccessTokenInput = {
  fromCookie?: InputMaybe<Scalars['Boolean']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
};

export type GetAccessTokenPayload = {
  __typename?: 'GetAccessTokenPayload';
  accessToken: Scalars['JwtToken']['output'];
};

export type Image = Node & {
  __typename?: 'Image';
  createdAt: Scalars['Datetime']['output'];
  exifData?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['Int']['output'];
  isHdr: Scalars['Boolean']['output'];
  isUploaded: Scalars['Boolean']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads and enables pagination through a set of `Photo`. */
  photos: PhotosConnection;
  s3Bucket: Scalars['String']['output'];
  s3Key: Scalars['String']['output'];
  sources: Array<Maybe<ImageSource>>;
  updatedAt: Scalars['Datetime']['output'];
  /** Reads a single `User` that is related to this `Image`. */
  user?: Maybe<User>;
  userId: Scalars['Int']['output'];
};

export type ImagePhotosArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PhotoCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeArchived?: InputMaybe<IncludeArchivedOption>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PhotosOrderBy>>;
};

/** A condition to be used against `Image` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type ImageCondition = {
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `exifData` field. */
  exifData?: InputMaybe<Scalars['JSON']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `isHdr` field. */
  isHdr?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `isUploaded` field. */
  isUploaded?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `s3Bucket` field. */
  s3Bucket?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `s3Key` field. */
  s3Key?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `sources` field. */
  sources?: InputMaybe<Array<InputMaybe<ImageSourceInput>>>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['Int']['input']>;
};

/** An input for mutations affecting `Image` */
export type ImageInput = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  exifData?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isHdr?: InputMaybe<Scalars['Boolean']['input']>;
  isUploaded?: InputMaybe<Scalars['Boolean']['input']>;
  s3Bucket: Scalars['String']['input'];
  s3Key: Scalars['String']['input'];
  sources?: InputMaybe<Array<InputMaybe<ImageSourceInput>>>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents an update to a `Image`. Fields that are set will be updated. */
export type ImagePatch = {
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  exifData?: InputMaybe<Scalars['JSON']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isHdr?: InputMaybe<Scalars['Boolean']['input']>;
  isUploaded?: InputMaybe<Scalars['Boolean']['input']>;
  s3Bucket?: InputMaybe<Scalars['String']['input']>;
  s3Key?: InputMaybe<Scalars['String']['input']>;
  sources?: InputMaybe<Array<InputMaybe<ImageSourceInput>>>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};

export type ImageSource = {
  __typename?: 'ImageSource';
  s3Key?: Maybe<Scalars['String']['output']>;
  size?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

/** An input for mutations affecting `ImageSource` */
export type ImageSourceInput = {
  s3Key?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** A connection to a list of `Image` values. */
export type ImagesConnection = {
  __typename?: 'ImagesConnection';
  /** A list of edges which contains the `Image` and cursor to aid in pagination. */
  edges: Array<ImagesEdge>;
  /** A list of `Image` objects. */
  nodes: Array<Image>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Image` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Image` edge in the connection. */
export type ImagesEdge = {
  __typename?: 'ImagesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Image` at the end of the edge. */
  node: Image;
};

/** Methods to use when ordering `Image`. */
export enum ImagesOrderBy {
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  ExifDataAsc = 'EXIF_DATA_ASC',
  ExifDataDesc = 'EXIF_DATA_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IsHdrAsc = 'IS_HDR_ASC',
  IsHdrDesc = 'IS_HDR_DESC',
  IsUploadedAsc = 'IS_UPLOADED_ASC',
  IsUploadedDesc = 'IS_UPLOADED_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  S3BucketAsc = 'S3_BUCKET_ASC',
  S3BucketDesc = 'S3_BUCKET_DESC',
  S3KeyAsc = 'S3_KEY_ASC',
  S3KeyDesc = 'S3_KEY_DESC',
  SourcesAsc = 'SOURCES_ASC',
  SourcesDesc = 'SOURCES_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
}

/** Indicates whether archived items should be included in the results or not. */
export enum IncludeArchivedOption {
  /** Only include archived items (i.e. exclude non-archived items). */
  Exclusively = 'EXCLUSIVELY',
  /** If there is a parent GraphQL record and it is archived then this is equivalent to YES, in all other cases this is equivalent to NO. */
  Inherit = 'INHERIT',
  /** Exclude archived items. */
  No = 'NO',
  /** Include archived items. */
  Yes = 'YES',
}

export type Location = Node & {
  __typename?: 'Location';
  archivedAt?: Maybe<Scalars['Datetime']['output']>;
  createdAt: Scalars['Datetime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  geo: Point;
  id: Scalars['Int']['output'];
  isArchived: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads and enables pagination through a set of `Photo`. */
  photos: PhotosConnection;
  slug: Scalars['String']['output'];
  updatedAt: Scalars['Datetime']['output'];
};

export type LocationPhotosArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PhotoCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeArchived?: InputMaybe<IncludeArchivedOption>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PhotosOrderBy>>;
};

/**
 * A condition to be used against `Location` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type LocationCondition = {
  /** Checks for equality with the object’s `archivedAt` field. */
  archivedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `geo` field. */
  geo?: InputMaybe<PointInput>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `isArchived` field. */
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `name` field. */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `slug` field. */
  slug?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** An input for mutations affecting `Location` */
export type LocationInput = {
  archivedAt?: InputMaybe<Scalars['Datetime']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  geo?: InputMaybe<PointInput>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  slug?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Represents an update to a `Location`. Fields that are set will be updated. */
export type LocationPatch = {
  archivedAt?: InputMaybe<Scalars['Datetime']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  geo?: InputMaybe<PointInput>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `Location` values. */
export type LocationsConnection = {
  __typename?: 'LocationsConnection';
  /** A list of edges which contains the `Location` and cursor to aid in pagination. */
  edges: Array<LocationsEdge>;
  /** A list of `Location` objects. */
  nodes: Array<Location>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Location` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Location` edge in the connection. */
export type LocationsEdge = {
  __typename?: 'LocationsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Location` at the end of the edge. */
  node: Location;
};

/** Methods to use when ordering `Location`. */
export enum LocationsOrderBy {
  ArchivedAtAsc = 'ARCHIVED_AT_ASC',
  ArchivedAtDesc = 'ARCHIVED_AT_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  GeoAsc = 'GEO_ASC',
  GeoDesc = 'GEO_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IsArchivedAsc = 'IS_ARCHIVED_ASC',
  IsArchivedDesc = 'IS_ARCHIVED_DESC',
  NameAsc = 'NAME_ASC',
  NameDesc = 'NAME_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SlugAsc = 'SLUG_ASC',
  SlugDesc = 'SLUG_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
}

export type LoginWithGoogleInput = {
  code: Scalars['String']['input'];
  toCookie?: InputMaybe<Scalars['Boolean']['input']>;
};

export type LoginWithGooglePayload = {
  __typename?: 'LoginWithGooglePayload';
  accessToken: Scalars['JwtToken']['output'];
  refreshToken?: Maybe<Scalars['String']['output']>;
  user: User;
};

export type LogoutInput = {
  fromCookie?: InputMaybe<Scalars['Boolean']['input']>;
  refreshToken?: InputMaybe<Scalars['String']['input']>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Creates a single `Comment`. */
  createComment?: Maybe<CreateCommentPayload>;
  /** Creates a single `Image`. */
  createImage?: Maybe<CreateImagePayload>;
  createImageUpload: CreateImageUploadPayload;
  /** Creates a single `Location`. */
  createLocation?: Maybe<CreateLocationPayload>;
  /** Creates a single `Photo`. */
  createPhoto?: Maybe<CreatePhotoPayload>;
  /** Creates a single `PhotosLike`. */
  createPhotosLike?: Maybe<CreatePhotosLikePayload>;
  /** Creates a single `User`. */
  createUser?: Maybe<CreateUserPayload>;
  /** Deletes a single `Comment` using a unique key. */
  deleteComment?: Maybe<DeleteCommentPayload>;
  /** Deletes a single `Comment` using its globally unique id. */
  deleteCommentByNodeId?: Maybe<DeleteCommentPayload>;
  /** Deletes a single `Image` using a unique key. */
  deleteImage?: Maybe<DeleteImagePayload>;
  /** Deletes a single `Image` using its globally unique id. */
  deleteImageByNodeId?: Maybe<DeleteImagePayload>;
  /** Deletes a single `Location` using a unique key. */
  deleteLocation?: Maybe<DeleteLocationPayload>;
  /** Deletes a single `Location` using its globally unique id. */
  deleteLocationByNodeId?: Maybe<DeleteLocationPayload>;
  /** Deletes a single `Photo` using a unique key. */
  deletePhoto?: Maybe<DeletePhotoPayload>;
  /** Deletes a single `Photo` using its globally unique id. */
  deletePhotoByNodeId?: Maybe<DeletePhotoPayload>;
  /** Deletes a single `PhotosLike` using a unique key. */
  deletePhotosLike?: Maybe<DeletePhotosLikePayload>;
  /** Deletes a single `PhotosLike` using a unique key. */
  deletePhotosLikeByIdAndPhotoId?: Maybe<DeletePhotosLikePayload>;
  /** Deletes a single `PhotosLike` using its globally unique id. */
  deletePhotosLikeByNodeId?: Maybe<DeletePhotosLikePayload>;
  /** Deletes a single `PhotosLike` using a unique key. */
  deletePhotosLikeByUserIdAndPhotoId?: Maybe<DeletePhotosLikePayload>;
  /** Deletes a single `User` using a unique key. */
  deleteUser?: Maybe<DeleteUserPayload>;
  /** Deletes a single `User` using its globally unique id. */
  deleteUserByNodeId?: Maybe<DeleteUserPayload>;
  dropAllPolicies?: Maybe<DropAllPoliciesPayload>;
  getAccessToken: GetAccessTokenPayload;
  loginWithGoogle: LoginWithGooglePayload;
  logout: Scalars['Boolean']['output'];
  /** Updates a single `Comment` using a unique key and a patch. */
  updateComment?: Maybe<UpdateCommentPayload>;
  /** Updates a single `Comment` using its globally unique id and a patch. */
  updateCommentByNodeId?: Maybe<UpdateCommentPayload>;
  /** Updates a single `Image` using a unique key and a patch. */
  updateImage?: Maybe<UpdateImagePayload>;
  /** Updates a single `Image` using its globally unique id and a patch. */
  updateImageByNodeId?: Maybe<UpdateImagePayload>;
  /** Updates a single `Location` using a unique key and a patch. */
  updateLocation?: Maybe<UpdateLocationPayload>;
  /** Updates a single `Location` using its globally unique id and a patch. */
  updateLocationByNodeId?: Maybe<UpdateLocationPayload>;
  /** Updates a single `Photo` using a unique key and a patch. */
  updatePhoto?: Maybe<UpdatePhotoPayload>;
  /** Updates a single `Photo` using its globally unique id and a patch. */
  updatePhotoByNodeId?: Maybe<UpdatePhotoPayload>;
  /** Updates a single `PhotosLike` using a unique key and a patch. */
  updatePhotosLike?: Maybe<UpdatePhotosLikePayload>;
  /** Updates a single `PhotosLike` using a unique key and a patch. */
  updatePhotosLikeByIdAndPhotoId?: Maybe<UpdatePhotosLikePayload>;
  /** Updates a single `PhotosLike` using its globally unique id and a patch. */
  updatePhotosLikeByNodeId?: Maybe<UpdatePhotosLikePayload>;
  /** Updates a single `PhotosLike` using a unique key and a patch. */
  updatePhotosLikeByUserIdAndPhotoId?: Maybe<UpdatePhotosLikePayload>;
  /** Updates a single `User` using a unique key and a patch. */
  updateUser?: Maybe<UpdateUserPayload>;
  /** Updates a single `User` using its globally unique id and a patch. */
  updateUserByNodeId?: Maybe<UpdateUserPayload>;
  upsertPhotoLike?: Maybe<UpsertPhotoLikePayload>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateCommentArgs = {
  input: CreateCommentInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateImageArgs = {
  input: CreateImageInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateImageUploadArgs = {
  input: CreateImageUploadInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateLocationArgs = {
  input: CreateLocationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePhotoArgs = {
  input: CreatePhotoInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreatePhotosLikeArgs = {
  input: CreatePhotosLikeInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationCreateUserArgs = {
  input: CreateUserInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCommentArgs = {
  input: DeleteCommentInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteCommentByNodeIdArgs = {
  input: DeleteCommentByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteImageArgs = {
  input: DeleteImageInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteImageByNodeIdArgs = {
  input: DeleteImageByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteLocationArgs = {
  input: DeleteLocationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteLocationByNodeIdArgs = {
  input: DeleteLocationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePhotoArgs = {
  input: DeletePhotoInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePhotoByNodeIdArgs = {
  input: DeletePhotoByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePhotosLikeArgs = {
  input: DeletePhotosLikeInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePhotosLikeByIdAndPhotoIdArgs = {
  input: DeletePhotosLikeByIdAndPhotoIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePhotosLikeByNodeIdArgs = {
  input: DeletePhotosLikeByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeletePhotosLikeByUserIdAndPhotoIdArgs = {
  input: DeletePhotosLikeByUserIdAndPhotoIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserArgs = {
  input: DeleteUserInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDeleteUserByNodeIdArgs = {
  input: DeleteUserByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationDropAllPoliciesArgs = {
  input: DropAllPoliciesInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationGetAccessTokenArgs = {
  input: GetAccessTokenInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationLoginWithGoogleArgs = {
  input: LoginWithGoogleInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationLogoutArgs = {
  input: LogoutInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCommentArgs = {
  input: UpdateCommentInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateCommentByNodeIdArgs = {
  input: UpdateCommentByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateImageArgs = {
  input: UpdateImageInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateImageByNodeIdArgs = {
  input: UpdateImageByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateLocationArgs = {
  input: UpdateLocationInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateLocationByNodeIdArgs = {
  input: UpdateLocationByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePhotoArgs = {
  input: UpdatePhotoInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePhotoByNodeIdArgs = {
  input: UpdatePhotoByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePhotosLikeArgs = {
  input: UpdatePhotosLikeInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePhotosLikeByIdAndPhotoIdArgs = {
  input: UpdatePhotosLikeByIdAndPhotoIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePhotosLikeByNodeIdArgs = {
  input: UpdatePhotosLikeByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdatePhotosLikeByUserIdAndPhotoIdArgs = {
  input: UpdatePhotosLikeByUserIdAndPhotoIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserArgs = {
  input: UpdateUserInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpdateUserByNodeIdArgs = {
  input: UpdateUserByNodeIdInput;
};

/** The root mutation type which contains root level fields which mutate data. */
export type MutationUpsertPhotoLikeArgs = {
  input: UpsertPhotoLikeInput;
};

/** An object with a globally unique `ID`. */
export type Node = {
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']['output']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean']['output'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean']['output'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']['output']>;
};

export type Photo = Node & {
  __typename?: 'Photo';
  aperture?: Maybe<Scalars['String']['output']>;
  archivedAt?: Maybe<Scalars['Datetime']['output']>;
  /** Reads a single `User` that is related to this `Photo`. */
  author?: Maybe<User>;
  /**  @hasDefault */
  authorId?: Maybe<Scalars['Int']['output']>;
  blurhash?: Maybe<Scalars['String']['output']>;
  camera?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `Comment`. */
  comments: CommentsConnection;
  createdAt: Scalars['Datetime']['output'];
  focalLength?: Maybe<Scalars['String']['output']>;
  height: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  /** Reads a single `Image` that is related to this `Photo`. */
  image?: Maybe<Image>;
  imageId?: Maybe<Scalars['Int']['output']>;
  isArchived: Scalars['Boolean']['output'];
  iso?: Maybe<Scalars['Int']['output']>;
  lat?: Maybe<Scalars['Float']['output']>;
  lens?: Maybe<Scalars['String']['output']>;
  /** Reads and enables pagination through a set of `PhotosLike`. */
  likes: PhotosLikesConnection;
  likesCount: Scalars['Int']['output'];
  lng?: Maybe<Scalars['Float']['output']>;
  /** Reads a single `Location` that is related to this `Photo`. */
  location?: Maybe<Location>;
  locationId: Scalars['Int']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  shotAt?: Maybe<Scalars['Datetime']['output']>;
  shutterSpeed?: Maybe<Scalars['Float']['output']>;
  thumbnail?: Maybe<Scalars['Base64EncodedBinary']['output']>;
  updatedAt: Scalars['Datetime']['output'];
  url: Scalars['String']['output'];
  width: Scalars['Int']['output'];
};

export type PhotoCommentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CommentCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeArchived?: InputMaybe<IncludeArchivedOption>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CommentsOrderBy>>;
};

export type PhotoLikesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PhotosLikeCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PhotosLikesOrderBy>>;
};

/** A condition to be used against `Photo` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type PhotoCondition = {
  /** Checks for equality with the object’s `aperture` field. */
  aperture?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `archivedAt` field. */
  archivedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `authorId` field. */
  authorId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `blurhash` field. */
  blurhash?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `camera` field. */
  camera?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `focalLength` field. */
  focalLength?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `height` field. */
  height?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `imageId` field. */
  imageId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `isArchived` field. */
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `iso` field. */
  iso?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `lat` field. */
  lat?: InputMaybe<Scalars['Float']['input']>;
  /** Checks for equality with the object’s `lens` field. */
  lens?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `likesCount` field. */
  likesCount?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `lng` field. */
  lng?: InputMaybe<Scalars['Float']['input']>;
  /** Checks for equality with the object’s `locationId` field. */
  locationId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `shotAt` field. */
  shotAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `shutterSpeed` field. */
  shutterSpeed?: InputMaybe<Scalars['Float']['input']>;
  /** Checks for equality with the object’s `thumbnail` field. */
  thumbnail?: InputMaybe<Scalars['Base64EncodedBinary']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `url` field. */
  url?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `width` field. */
  width?: InputMaybe<Scalars['Int']['input']>;
};

/** An input for mutations affecting `Photo` */
export type PhotoInput = {
  aperture?: InputMaybe<Scalars['String']['input']>;
  archivedAt?: InputMaybe<Scalars['Datetime']['input']>;
  blurhash?: InputMaybe<Scalars['String']['input']>;
  camera?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  focalLength?: InputMaybe<Scalars['String']['input']>;
  height: Scalars['Int']['input'];
  id?: InputMaybe<Scalars['Int']['input']>;
  imageId?: InputMaybe<Scalars['Int']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  iso?: InputMaybe<Scalars['Int']['input']>;
  lat?: InputMaybe<Scalars['Float']['input']>;
  lens?: InputMaybe<Scalars['String']['input']>;
  likesCount?: InputMaybe<Scalars['Int']['input']>;
  lng?: InputMaybe<Scalars['Float']['input']>;
  locationId: Scalars['Int']['input'];
  shotAt?: InputMaybe<Scalars['Datetime']['input']>;
  shutterSpeed?: InputMaybe<Scalars['Float']['input']>;
  thumbnail?: InputMaybe<Scalars['Base64EncodedBinary']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  url: Scalars['String']['input'];
  width: Scalars['Int']['input'];
};

/** Represents an update to a `Photo`. Fields that are set will be updated. */
export type PhotoPatch = {
  aperture?: InputMaybe<Scalars['String']['input']>;
  archivedAt?: InputMaybe<Scalars['Datetime']['input']>;
  blurhash?: InputMaybe<Scalars['String']['input']>;
  camera?: InputMaybe<Scalars['String']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  focalLength?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  imageId?: InputMaybe<Scalars['Int']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  iso?: InputMaybe<Scalars['Int']['input']>;
  lat?: InputMaybe<Scalars['Float']['input']>;
  lens?: InputMaybe<Scalars['String']['input']>;
  likesCount?: InputMaybe<Scalars['Int']['input']>;
  lng?: InputMaybe<Scalars['Float']['input']>;
  locationId?: InputMaybe<Scalars['Int']['input']>;
  shotAt?: InputMaybe<Scalars['Datetime']['input']>;
  shutterSpeed?: InputMaybe<Scalars['Float']['input']>;
  thumbnail?: InputMaybe<Scalars['Base64EncodedBinary']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  url?: InputMaybe<Scalars['String']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

/** A connection to a list of `Photo` values. */
export type PhotosConnection = {
  __typename?: 'PhotosConnection';
  /** A list of edges which contains the `Photo` and cursor to aid in pagination. */
  edges: Array<PhotosEdge>;
  /** A list of `Photo` objects. */
  nodes: Array<Photo>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `Photo` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `Photo` edge in the connection. */
export type PhotosEdge = {
  __typename?: 'PhotosEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `Photo` at the end of the edge. */
  node: Photo;
};

export type PhotosLike = Node & {
  __typename?: 'PhotosLike';
  count: Scalars['Int']['output'];
  createdAt: Scalars['Datetime']['output'];
  id: Scalars['Int']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads a single `Photo` that is related to this `PhotosLike`. */
  photo?: Maybe<Photo>;
  photoId: Scalars['Int']['output'];
  updatedAt: Scalars['Datetime']['output'];
  /** Reads a single `User` that is related to this `PhotosLike`. */
  user?: Maybe<User>;
  userId: Scalars['Int']['output'];
};

/**
 * A condition to be used against `PhotosLike` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type PhotosLikeCondition = {
  /** Checks for equality with the object’s `count` field. */
  count?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `photoId` field. */
  photoId?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['Int']['input']>;
};

/** An input for mutations affecting `PhotosLike` */
export type PhotosLikeInput = {
  count?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  photoId: Scalars['Int']['input'];
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};

/** Represents an update to a `PhotosLike`. Fields that are set will be updated. */
export type PhotosLikePatch = {
  count?: InputMaybe<Scalars['Int']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  photoId?: InputMaybe<Scalars['Int']['input']>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};

/** A connection to a list of `PhotosLike` values. */
export type PhotosLikesConnection = {
  __typename?: 'PhotosLikesConnection';
  /** A list of edges which contains the `PhotosLike` and cursor to aid in pagination. */
  edges: Array<PhotosLikesEdge>;
  /** A list of `PhotosLike` objects. */
  nodes: Array<PhotosLike>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PhotosLike` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `PhotosLike` edge in the connection. */
export type PhotosLikesEdge = {
  __typename?: 'PhotosLikesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `PhotosLike` at the end of the edge. */
  node: PhotosLike;
};

/** Methods to use when ordering `PhotosLike`. */
export enum PhotosLikesOrderBy {
  CountAsc = 'COUNT_ASC',
  CountDesc = 'COUNT_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PhotoIdAsc = 'PHOTO_ID_ASC',
  PhotoIdDesc = 'PHOTO_ID_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC',
}

/** Methods to use when ordering `Photo`. */
export enum PhotosOrderBy {
  ApertureAsc = 'APERTURE_ASC',
  ApertureDesc = 'APERTURE_DESC',
  ArchivedAtAsc = 'ARCHIVED_AT_ASC',
  ArchivedAtDesc = 'ARCHIVED_AT_DESC',
  AuthorIdAsc = 'AUTHOR_ID_ASC',
  AuthorIdDesc = 'AUTHOR_ID_DESC',
  BlurhashAsc = 'BLURHASH_ASC',
  BlurhashDesc = 'BLURHASH_DESC',
  CameraAsc = 'CAMERA_ASC',
  CameraDesc = 'CAMERA_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  FocalLengthAsc = 'FOCAL_LENGTH_ASC',
  FocalLengthDesc = 'FOCAL_LENGTH_DESC',
  HeightAsc = 'HEIGHT_ASC',
  HeightDesc = 'HEIGHT_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  ImageIdAsc = 'IMAGE_ID_ASC',
  ImageIdDesc = 'IMAGE_ID_DESC',
  IsoAsc = 'ISO_ASC',
  IsoDesc = 'ISO_DESC',
  IsArchivedAsc = 'IS_ARCHIVED_ASC',
  IsArchivedDesc = 'IS_ARCHIVED_DESC',
  LatAsc = 'LAT_ASC',
  LatDesc = 'LAT_DESC',
  LensAsc = 'LENS_ASC',
  LensDesc = 'LENS_DESC',
  LikesCountAsc = 'LIKES_COUNT_ASC',
  LikesCountDesc = 'LIKES_COUNT_DESC',
  LngAsc = 'LNG_ASC',
  LngDesc = 'LNG_DESC',
  LocationIdAsc = 'LOCATION_ID_ASC',
  LocationIdDesc = 'LOCATION_ID_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  ShotAtAsc = 'SHOT_AT_ASC',
  ShotAtDesc = 'SHOT_AT_DESC',
  ShutterSpeedAsc = 'SHUTTER_SPEED_ASC',
  ShutterSpeedDesc = 'SHUTTER_SPEED_DESC',
  ThumbnailAsc = 'THUMBNAIL_ASC',
  ThumbnailDesc = 'THUMBNAIL_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
  UrlAsc = 'URL_ASC',
  UrlDesc = 'URL_DESC',
  WidthAsc = 'WIDTH_ASC',
  WidthDesc = 'WIDTH_DESC',
}

export type Point = {
  __typename?: 'Point';
  x: Scalars['Float']['output'];
  y: Scalars['Float']['output'];
};

export type PointInput = {
  x: Scalars['Float']['input'];
  y: Scalars['Float']['input'];
};

/** The root query type which gives access points into the data universe. */
export type Query = Node & {
  __typename?: 'Query';
  comment?: Maybe<Comment>;
  /** Reads a single `Comment` using its globally unique `ID`. */
  commentByNodeId?: Maybe<Comment>;
  /** Reads and enables pagination through a set of `Comment`. */
  comments?: Maybe<CommentsConnection>;
  currentUser?: Maybe<User>;
  currentUserId?: Maybe<Scalars['Int']['output']>;
  image?: Maybe<Image>;
  /** Reads a single `Image` using its globally unique `ID`. */
  imageByNodeId?: Maybe<Image>;
  /** Reads and enables pagination through a set of `Image`. */
  images?: Maybe<ImagesConnection>;
  location?: Maybe<Location>;
  /** Reads a single `Location` using its globally unique `ID`. */
  locationByNodeId?: Maybe<Location>;
  locationBySlug?: Maybe<Location>;
  /** Reads and enables pagination through a set of `Location`. */
  locations?: Maybe<LocationsConnection>;
  /** Reads and enables pagination through a set of `Location`. */
  locationsByDistance?: Maybe<LocationsConnection>;
  /** Fetches an object given its globally unique `ID`. */
  node?: Maybe<Node>;
  /** The root query type must be a `Node` to work well with Relay 1 mutations. This just resolves to `query`. */
  nodeId: Scalars['ID']['output'];
  photo?: Maybe<Photo>;
  /** Reads a single `Photo` using its globally unique `ID`. */
  photoByNodeId?: Maybe<Photo>;
  /** Reads and enables pagination through a set of `Photo`. */
  photos?: Maybe<PhotosConnection>;
  photosLike?: Maybe<PhotosLike>;
  photosLikeByIdAndPhotoId?: Maybe<PhotosLike>;
  /** Reads a single `PhotosLike` using its globally unique `ID`. */
  photosLikeByNodeId?: Maybe<PhotosLike>;
  photosLikeByUserIdAndPhotoId?: Maybe<PhotosLike>;
  /** Reads and enables pagination through a set of `PhotosLike`. */
  photosLikes?: Maybe<PhotosLikesConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  user?: Maybe<User>;
  /** Reads a single `User` using its globally unique `ID`. */
  userByNodeId?: Maybe<User>;
  /** Reads and enables pagination through a set of `User`. */
  users?: Maybe<UsersConnection>;
};

/** The root query type which gives access points into the data universe. */
export type QueryCommentArgs = {
  id: Scalars['Int']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryCommentByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryCommentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CommentCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeArchived?: InputMaybe<IncludeArchivedOption>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CommentsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryImageArgs = {
  id: Scalars['Int']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryImageByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ImageCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ImagesOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryLocationArgs = {
  id: Scalars['Int']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryLocationByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryLocationBySlugArgs = {
  slug: Scalars['String']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryLocationsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<LocationCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeArchived?: InputMaybe<IncludeArchivedOption>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<LocationsOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryLocationsByDistanceArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  lat?: InputMaybe<Scalars['Float']['input']>;
  lng?: InputMaybe<Scalars['Float']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};

/** The root query type which gives access points into the data universe. */
export type QueryNodeArgs = {
  nodeId: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryPhotoArgs = {
  id: Scalars['Int']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryPhotoByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryPhotosArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PhotoCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeArchived?: InputMaybe<IncludeArchivedOption>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PhotosOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryPhotosLikeArgs = {
  id: Scalars['Int']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryPhotosLikeByIdAndPhotoIdArgs = {
  id: Scalars['Int']['input'];
  photoId: Scalars['Int']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryPhotosLikeByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryPhotosLikeByUserIdAndPhotoIdArgs = {
  photoId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryPhotosLikesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PhotosLikeCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PhotosLikesOrderBy>>;
};

/** The root query type which gives access points into the data universe. */
export type QueryUserArgs = {
  id: Scalars['Int']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryUserByNodeIdArgs = {
  nodeId: Scalars['ID']['input'];
};

/** The root query type which gives access points into the data universe. */
export type QueryUsersArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<UserCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeArchived?: InputMaybe<IncludeArchivedOption>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

export enum Role {
  AppAdmin = 'APP_ADMIN',
  AppUser = 'APP_USER',
}

/** All input for the `updateCommentByNodeId` mutation. */
export type UpdateCommentByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Comment` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Comment` being updated. */
  patch: CommentPatch;
};

/** All input for the `updateComment` mutation. */
export type UpdateCommentInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  /** An object where the defined keys will be set on the `Comment` being updated. */
  patch: CommentPatch;
};

/** The output of our update `Comment` mutation. */
export type UpdateCommentPayload = {
  __typename?: 'UpdateCommentPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Comment` that was updated by this mutation. */
  comment?: Maybe<Comment>;
  /** An edge for our `Comment`. May be used by Relay 1. */
  commentEdge?: Maybe<CommentsEdge>;
  /** Reads a single `Photo` that is related to this `Comment`. */
  photo?: Maybe<Photo>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Comment`. */
  user?: Maybe<User>;
};

/** The output of our update `Comment` mutation. */
export type UpdateCommentPayloadCommentEdgeArgs = {
  orderBy?: InputMaybe<Array<CommentsOrderBy>>;
};

/** All input for the `updateImageByNodeId` mutation. */
export type UpdateImageByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Image` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Image` being updated. */
  patch: ImagePatch;
};

/** All input for the `updateImage` mutation. */
export type UpdateImageInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  /** An object where the defined keys will be set on the `Image` being updated. */
  patch: ImagePatch;
};

/** The output of our update `Image` mutation. */
export type UpdateImagePayload = {
  __typename?: 'UpdateImagePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Image` that was updated by this mutation. */
  image?: Maybe<Image>;
  /** An edge for our `Image`. May be used by Relay 1. */
  imageEdge?: Maybe<ImagesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `Image`. */
  user?: Maybe<User>;
};

/** The output of our update `Image` mutation. */
export type UpdateImagePayloadImageEdgeArgs = {
  orderBy?: InputMaybe<Array<ImagesOrderBy>>;
};

/** All input for the `updateLocationByNodeId` mutation. */
export type UpdateLocationByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Location` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Location` being updated. */
  patch: LocationPatch;
};

/** All input for the `updateLocation` mutation. */
export type UpdateLocationInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  /** An object where the defined keys will be set on the `Location` being updated. */
  patch: LocationPatch;
};

/** The output of our update `Location` mutation. */
export type UpdateLocationPayload = {
  __typename?: 'UpdateLocationPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** The `Location` that was updated by this mutation. */
  location?: Maybe<Location>;
  /** An edge for our `Location`. May be used by Relay 1. */
  locationEdge?: Maybe<LocationsEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `Location` mutation. */
export type UpdateLocationPayloadLocationEdgeArgs = {
  orderBy?: InputMaybe<Array<LocationsOrderBy>>;
};

/** All input for the `updatePhotoByNodeId` mutation. */
export type UpdatePhotoByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `Photo` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `Photo` being updated. */
  patch: PhotoPatch;
};

/** All input for the `updatePhoto` mutation. */
export type UpdatePhotoInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  /** An object where the defined keys will be set on the `Photo` being updated. */
  patch: PhotoPatch;
};

/** The output of our update `Photo` mutation. */
export type UpdatePhotoPayload = {
  __typename?: 'UpdatePhotoPayload';
  /** Reads a single `User` that is related to this `Photo`. */
  author?: Maybe<User>;
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Image` that is related to this `Photo`. */
  image?: Maybe<Image>;
  /** Reads a single `Location` that is related to this `Photo`. */
  location?: Maybe<Location>;
  /** The `Photo` that was updated by this mutation. */
  photo?: Maybe<Photo>;
  /** An edge for our `Photo`. May be used by Relay 1. */
  photoEdge?: Maybe<PhotosEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
};

/** The output of our update `Photo` mutation. */
export type UpdatePhotoPayloadPhotoEdgeArgs = {
  orderBy?: InputMaybe<Array<PhotosOrderBy>>;
};

/** All input for the `updatePhotosLikeByIdAndPhotoId` mutation. */
export type UpdatePhotosLikeByIdAndPhotoIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  /** An object where the defined keys will be set on the `PhotosLike` being updated. */
  patch: PhotosLikePatch;
  photoId: Scalars['Int']['input'];
};

/** All input for the `updatePhotosLikeByNodeId` mutation. */
export type UpdatePhotosLikeByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `PhotosLike` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `PhotosLike` being updated. */
  patch: PhotosLikePatch;
};

/** All input for the `updatePhotosLikeByUserIdAndPhotoId` mutation. */
export type UpdatePhotosLikeByUserIdAndPhotoIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** An object where the defined keys will be set on the `PhotosLike` being updated. */
  patch: PhotosLikePatch;
  photoId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};

/** All input for the `updatePhotosLike` mutation. */
export type UpdatePhotosLikeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  /** An object where the defined keys will be set on the `PhotosLike` being updated. */
  patch: PhotosLikePatch;
};

/** The output of our update `PhotosLike` mutation. */
export type UpdatePhotosLikePayload = {
  __typename?: 'UpdatePhotosLikePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Photo` that is related to this `PhotosLike`. */
  photo?: Maybe<Photo>;
  /** The `PhotosLike` that was updated by this mutation. */
  photosLike?: Maybe<PhotosLike>;
  /** An edge for our `PhotosLike`. May be used by Relay 1. */
  photosLikeEdge?: Maybe<PhotosLikesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `PhotosLike`. */
  user?: Maybe<User>;
};

/** The output of our update `PhotosLike` mutation. */
export type UpdatePhotosLikePayloadPhotosLikeEdgeArgs = {
  orderBy?: InputMaybe<Array<PhotosLikesOrderBy>>;
};

/** All input for the `updateUserByNodeId` mutation. */
export type UpdateUserByNodeIdInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  /** The globally unique `ID` which will identify a single `User` to be updated. */
  nodeId: Scalars['ID']['input'];
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch;
};

/** All input for the `updateUser` mutation. */
export type UpdateUserInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  /** An object where the defined keys will be set on the `User` being updated. */
  patch: UserPatch;
};

/** The output of our update `User` mutation. */
export type UpdateUserPayload = {
  __typename?: 'UpdateUserPayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** The `User` that was updated by this mutation. */
  user?: Maybe<User>;
  /** An edge for our `User`. May be used by Relay 1. */
  userEdge?: Maybe<UsersEdge>;
};

/** The output of our update `User` mutation. */
export type UpdateUserPayloadUserEdgeArgs = {
  orderBy?: InputMaybe<Array<UsersOrderBy>>;
};

/** All input for the `upsertPhotoLike` mutation. */
export type UpsertPhotoLikeInput = {
  /**
   * An arbitrary string value with no semantic meaning. Will be included in the
   * payload verbatim. May be used to track mutations by the client.
   */
  clientMutationId?: InputMaybe<Scalars['String']['input']>;
  count?: InputMaybe<Scalars['Int']['input']>;
  photoid?: InputMaybe<Scalars['Int']['input']>;
};

/** The output of our `upsertPhotoLike` mutation. */
export type UpsertPhotoLikePayload = {
  __typename?: 'UpsertPhotoLikePayload';
  /**
   * The exact same `clientMutationId` that was provided in the mutation input,
   * unchanged and unused. May be used by a client to track mutations.
   */
  clientMutationId?: Maybe<Scalars['String']['output']>;
  /** Reads a single `Photo` that is related to this `PhotosLike`. */
  photo?: Maybe<Photo>;
  photosLike?: Maybe<PhotosLike>;
  /** An edge for our `PhotosLike`. May be used by Relay 1. */
  photosLikeEdge?: Maybe<PhotosLikesEdge>;
  /** Our root query field type. Allows us to run any query from our mutation payload. */
  query?: Maybe<Query>;
  /** Reads a single `User` that is related to this `PhotosLike`. */
  user?: Maybe<User>;
};

/** The output of our `upsertPhotoLike` mutation. */
export type UpsertPhotoLikePayloadPhotosLikeEdgeArgs = {
  orderBy?: InputMaybe<Array<PhotosLikesOrderBy>>;
};

export type User = Node & {
  __typename?: 'User';
  archivedAt?: Maybe<Scalars['Datetime']['output']>;
  /** Reads and enables pagination through a set of `Photo`. */
  authoredPhotos: PhotosConnection;
  /** Reads and enables pagination through a set of `Comment`. */
  comments: CommentsConnection;
  createdAt: Scalars['Datetime']['output'];
  displayName: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  /** Reads and enables pagination through a set of `Image`. */
  images: ImagesConnection;
  isArchived: Scalars['Boolean']['output'];
  /** A globally unique identifier. Can be used in various places throughout the system to identify this single value. */
  nodeId: Scalars['ID']['output'];
  /** Reads and enables pagination through a set of `PhotosLike`. */
  photosLikes: PhotosLikesConnection;
  pictureUrl?: Maybe<Scalars['String']['output']>;
  role: Role;
  updatedAt: Scalars['Datetime']['output'];
};

export type UserAuthoredPhotosArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PhotoCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeArchived?: InputMaybe<IncludeArchivedOption>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PhotosOrderBy>>;
};

export type UserCommentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<CommentCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  includeArchived?: InputMaybe<IncludeArchivedOption>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<CommentsOrderBy>>;
};

export type UserImagesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<ImageCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<ImagesOrderBy>>;
};

export type UserPhotosLikesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  condition?: InputMaybe<PhotosLikeCondition>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Array<PhotosLikesOrderBy>>;
};

/** A condition to be used against `User` object types. All fields are tested for equality and combined with a logical ‘and.’ */
export type UserCondition = {
  /** Checks for equality with the object’s `archivedAt` field. */
  archivedAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `createdAt` field. */
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  /** Checks for equality with the object’s `displayName` field. */
  displayName?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['Int']['input']>;
  /** Checks for equality with the object’s `isArchived` field. */
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  /** Checks for equality with the object’s `pictureUrl` field. */
  pictureUrl?: InputMaybe<Scalars['String']['input']>;
  /** Checks for equality with the object’s `role` field. */
  role?: InputMaybe<Role>;
  /** Checks for equality with the object’s `updatedAt` field. */
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** An input for mutations affecting `User` */
export type UserInput = {
  archivedAt?: InputMaybe<Scalars['Datetime']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  displayName: Scalars['String']['input'];
  id?: InputMaybe<Scalars['Int']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  pictureUrl?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Role>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** Represents an update to a `User`. Fields that are set will be updated. */
export type UserPatch = {
  archivedAt?: InputMaybe<Scalars['Datetime']['input']>;
  createdAt?: InputMaybe<Scalars['Datetime']['input']>;
  displayName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  isArchived?: InputMaybe<Scalars['Boolean']['input']>;
  pictureUrl?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Role>;
  updatedAt?: InputMaybe<Scalars['Datetime']['input']>;
};

/** A connection to a list of `User` values. */
export type UsersConnection = {
  __typename?: 'UsersConnection';
  /** A list of edges which contains the `User` and cursor to aid in pagination. */
  edges: Array<UsersEdge>;
  /** A list of `User` objects. */
  nodes: Array<User>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `User` you could get from the connection. */
  totalCount: Scalars['Int']['output'];
};

/** A `User` edge in the connection. */
export type UsersEdge = {
  __typename?: 'UsersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']['output']>;
  /** The `User` at the end of the edge. */
  node: User;
};

/** Methods to use when ordering `User`. */
export enum UsersOrderBy {
  ArchivedAtAsc = 'ARCHIVED_AT_ASC',
  ArchivedAtDesc = 'ARCHIVED_AT_DESC',
  CreatedAtAsc = 'CREATED_AT_ASC',
  CreatedAtDesc = 'CREATED_AT_DESC',
  DisplayNameAsc = 'DISPLAY_NAME_ASC',
  DisplayNameDesc = 'DISPLAY_NAME_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IsArchivedAsc = 'IS_ARCHIVED_ASC',
  IsArchivedDesc = 'IS_ARCHIVED_DESC',
  Natural = 'NATURAL',
  PictureUrlAsc = 'PICTURE_URL_ASC',
  PictureUrlDesc = 'PICTURE_URL_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  RoleAsc = 'ROLE_ASC',
  RoleDesc = 'ROLE_DESC',
  UpdatedAtAsc = 'UPDATED_AT_ASC',
  UpdatedAtDesc = 'UPDATED_AT_DESC',
}

export type GetAccessTokenMutationVariables = Exact<{ [key: string]: never }>;

export type GetAccessTokenMutation = {
  __typename?: 'Mutation';
  getAccessToken: { __typename: 'GetAccessTokenPayload'; accessToken: any };
};

export type PhotoCard_PhotoFragment = {
  __typename?: 'Photo';
  id: number;
  width: number;
  height: number;
  blurhash?: string | null;
  thumbnail?: any | null;
  likesCount: number;
  image?: {
    __typename: 'Image';
    s3Bucket: string;
    sources: Array<{
      __typename: 'ImageSource';
      type?: string | null;
      s3Key?: string | null;
      size?: number | null;
    } | null>;
  } | null;
  comments: { __typename: 'CommentsConnection'; totalCount: number };
  location?: { __typename: 'Location'; id: number; slug: string } | null;
} & { ' $fragmentName'?: 'PhotoCard_PhotoFragment' };

export type PhotoCommentsQueryVariables = Exact<{
  id: Scalars['Int']['input'];
  after?: InputMaybe<Scalars['Cursor']['input']>;
  first: Scalars['Int']['input'];
}>;

export type PhotoCommentsQuery = {
  __typename?: 'Query';
  comments?: {
    __typename: 'CommentsConnection';
    totalCount: number;
    pageInfo: {
      __typename: 'PageInfo';
      hasNextPage: boolean;
      startCursor?: any | null;
      endCursor?: any | null;
    };
    edges: Array<{
      __typename: 'CommentsEdge';
      cursor?: any | null;
      node: {
        __typename: 'Comment';
        id: number;
        body: string;
        createdAt: Date;
        isArchived: boolean;
        user?: {
          __typename: 'User';
          id: number;
          displayName: string;
          pictureUrl?: string | null;
        } | null;
      };
    }>;
  } | null;
};

export type CreateCommentMutationVariables = Exact<{
  comment: CommentInput;
}>;

export type CreateCommentMutation = {
  __typename?: 'Mutation';
  createComment?: {
    __typename: 'CreateCommentPayload';
    comment?: {
      __typename: 'Comment';
      id: number;
      body: string;
      createdAt: Date;
      isArchived: boolean;
      user?: {
        __typename: 'User';
        id: number;
        displayName: string;
        pictureUrl?: string | null;
      } | null;
    } | null;
  } | null;
};

export type UpdateCommentMutationVariables = Exact<{
  input: UpdateCommentInput;
}>;

export type UpdateCommentMutation = {
  __typename?: 'Mutation';
  updateComment?: {
    __typename: 'UpdateCommentPayload';
    comment?: { __typename: 'Comment'; id: number; isArchived: boolean } | null;
  } | null;
};

export type PhotoComments_PhotoFragment = { __typename: 'Photo'; id: number } & {
  ' $fragmentName'?: 'PhotoComments_PhotoFragment';
};

export type PhotoHeader_PhotoFragment = {
  __typename?: 'Photo';
  id: number;
  location?: { __typename: 'Location'; id: number; slug: string; name: string } | null;
} & { ' $fragmentName'?: 'PhotoHeader_PhotoFragment' };

export type PhotoImage_PhotoFragment = {
  __typename?: 'Photo';
  id: number;
  width: number;
  height: number;
  blurhash?: string | null;
  location?: { __typename: 'Location'; id: number; name: string } | null;
  image?: {
    __typename: 'Image';
    s3Bucket: string;
    sources: Array<{
      __typename: 'ImageSource';
      type?: string | null;
      s3Key?: string | null;
      size?: number | null;
    } | null>;
  } | null;
} & { ' $fragmentName'?: 'PhotoImage_PhotoFragment' };

export type PhotoInfo_PhotoFragment = ({
  __typename: 'Photo';
  id: number;
  shotAt?: Date | null;
  shutterSpeed?: number | null;
  aperture?: string | null;
  focalLength?: string | null;
  camera?: string | null;
  lens?: string | null;
  iso?: number | null;
  lat?: number | null;
  lng?: number | null;
} & { ' $fragmentRefs'?: { PhotoLikes_PhotoFragment: PhotoLikes_PhotoFragment } }) & {
  ' $fragmentName'?: 'PhotoInfo_PhotoFragment';
};

export type PhotoLikes_PhotoFragment = { __typename?: 'Photo'; id: number; likesCount: number } & {
  ' $fragmentName'?: 'PhotoLikes_PhotoFragment';
};

export type PhotoLikesUserLikesQueryQueryVariables = Exact<{
  photoId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
}>;

export type PhotoLikesUserLikesQueryQuery = {
  __typename?: 'Query';
  photosLikeByUserIdAndPhotoId?: { __typename: 'PhotosLike'; id: number; count: number } | null;
};

export type PhotoLikesUpsertLikeMutationMutationVariables = Exact<{
  input: UpsertPhotoLikeInput;
}>;

export type PhotoLikesUpsertLikeMutationMutation = {
  __typename?: 'Mutation';
  upsertPhotoLike?: {
    __typename: 'UpsertPhotoLikePayload';
    photosLike?: {
      __typename: 'PhotosLike';
      id: number;
      count: number;
      photo?: { __typename: 'Photo'; id: number; likesCount: number } | null;
    } | null;
  } | null;
};

export type CreateImageUploadMutationVariables = Exact<{
  input: CreateImageUploadInput;
}>;

export type CreateImageUploadMutation = {
  __typename?: 'Mutation';
  createImageUpload: {
    __typename: 'CreateImageUploadPayload';
    signedUrl: string;
    image: { __typename: 'Image'; id: number };
  };
};

export type UpdateImageMutationVariables = Exact<{
  input: UpdateImageInput;
}>;

export type UpdateImageMutation = {
  __typename?: 'Mutation';
  updateImage?: {
    __typename: 'UpdateImagePayload';
    image?: { __typename: 'Image'; id: number; isUploaded: boolean } | null;
  } | null;
};

export type LocationsByDistanceQueryVariables = Exact<{
  lat: Scalars['Float']['input'];
  lng: Scalars['Float']['input'];
}>;

export type LocationsByDistanceQuery = {
  __typename?: 'Query';
  locationsByDistance?: {
    __typename: 'LocationsConnection';
    nodes: Array<{ __typename: 'Location'; id: number; name: string }>;
  } | null;
};

export type LoginWithGoogleMutationVariables = Exact<{
  code: Scalars['String']['input'];
}>;

export type LoginWithGoogleMutation = {
  __typename?: 'Mutation';
  loginWithGoogle: {
    __typename: 'LoginWithGooglePayload';
    accessToken: any;
    refreshToken?: string | null;
  };
};

export type CurrentUserQueryQueryVariables = Exact<{ [key: string]: never }>;

export type CurrentUserQueryQuery = {
  __typename?: 'Query';
  currentUser?: {
    __typename: 'User';
    id: number;
    displayName: string;
    pictureUrl?: string | null;
    role: Role;
  } | null;
};

export type LogoutMutationMutationVariables = Exact<{ [key: string]: never }>;

export type LogoutMutationMutation = { __typename?: 'Mutation'; logout: boolean };

export type LocationQueryQueryVariables = Exact<{
  slug: Scalars['String']['input'];
  after?: InputMaybe<Scalars['Cursor']['input']>;
  first: Scalars['Int']['input'];
}>;

export type LocationQueryQuery = {
  __typename?: 'Query';
  location?: {
    __typename: 'Location';
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    photos: {
      __typename: 'PhotosConnection';
      totalCount: number;
      pageInfo: {
        __typename: 'PageInfo';
        hasNextPage: boolean;
        startCursor?: any | null;
        endCursor?: any | null;
      };
      edges: Array<{
        __typename: 'PhotosEdge';
        cursor?: any | null;
        node: {
          __typename: 'Photo';
          id: number;
          width: number;
          height: number;
          blurhash?: string | null;
          thumbnail?: any | null;
          image?: {
            __typename: 'Image';
            s3Bucket: string;
            sources: Array<{
              __typename: 'ImageSource';
              type?: string | null;
              s3Key?: string | null;
              size?: number | null;
            } | null>;
          } | null;
        } & {
          ' $fragmentRefs'?: {
            RoutePhoto_EssentialsFragmentFragment: RoutePhoto_EssentialsFragmentFragment;
            PhotoCard_PhotoFragment: PhotoCard_PhotoFragment;
          };
        };
      }>;
    };
  } | null;
};

export type RouteMainQueryQueryVariables = Exact<{ [key: string]: never }>;

export type RouteMainQueryQuery = {
  __typename?: 'Query';
  locations?: {
    __typename: 'LocationsConnection';
    nodes: Array<{
      __typename: 'Location';
      id: number;
      name: string;
      slug: string;
      description?: string | null;
      geo: { __typename: 'Point'; x: number; y: number };
    }>;
  } | null;
};

export type CommentsQueryQueryVariables = Exact<{ [key: string]: never }>;

export type CommentsQueryQuery = {
  __typename?: 'Query';
  comments?: {
    __typename: 'CommentsConnection';
    totalCount: number;
    edges: Array<{
      __typename: 'CommentsEdge';
      node: {
        __typename: 'Comment';
        id: number;
        body: string;
        isArchived: boolean;
        createdAt: Date;
        user?: {
          __typename: 'User';
          id: number;
          displayName: string;
          pictureUrl?: string | null;
        } | null;
        photo?: {
          __typename: 'Photo';
          id: number;
          location?: { __typename: 'Location'; id: number; slug: string } | null;
          image?: {
            __typename: 'Image';
            id: number;
            s3Key: string;
            s3Bucket: string;
            sources: Array<{
              __typename: 'ImageSource';
              s3Key?: string | null;
              size?: number | null;
              type?: string | null;
            } | null>;
          } | null;
        } | null;
      };
    }>;
  } | null;
};

export type UpdateCommentMutationMutationVariables = Exact<{
  input: UpdateCommentInput;
}>;

export type UpdateCommentMutationMutation = {
  __typename?: 'Mutation';
  updateComment?: {
    __typename: 'UpdateCommentPayload';
    comment?: {
      __typename: 'Comment';
      id: number;
      body: string;
      isArchived: boolean;
      createdAt: Date;
      user?: {
        __typename: 'User';
        id: number;
        displayName: string;
        pictureUrl?: string | null;
      } | null;
      photo?: {
        __typename: 'Photo';
        id: number;
        location?: { __typename: 'Location'; id: number; slug: string } | null;
        image?: {
          __typename: 'Image';
          id: number;
          s3Key: string;
          s3Bucket: string;
          sources: Array<{
            __typename: 'ImageSource';
            s3Key?: string | null;
            size?: number | null;
            type?: string | null;
          } | null>;
        } | null;
      } | null;
    } | null;
  } | null;
};

export type DeleteCommentMutationMutationVariables = Exact<{
  input: DeleteCommentInput;
}>;

export type DeleteCommentMutationMutation = {
  __typename?: 'Mutation';
  deleteComment?: {
    __typename: 'DeleteCommentPayload';
    comment?: { __typename: 'Comment'; id: number } | null;
  } | null;
};

export type RouteAdminLocationsQueryQueryVariables = Exact<{ [key: string]: never }>;

export type RouteAdminLocationsQueryQuery = {
  __typename?: 'Query';
  locations?: {
    __typename: 'LocationsConnection';
    totalCount: number;
    edges: Array<{
      __typename: 'LocationsEdge';
      node: {
        __typename: 'Location';
        id: number;
        name: string;
        slug: string;
        description?: string | null;
        isArchived: boolean;
        photos: { __typename: 'PhotosConnection'; totalCount: number };
      };
    }>;
    pageInfo: {
      __typename: 'PageInfo';
      hasNextPage: boolean;
      endCursor?: any | null;
      startCursor?: any | null;
    };
  } | null;
};

export type CreateLocationMutationVariables = Exact<{
  input: CreateLocationInput;
}>;

export type CreateLocationMutation = {
  __typename?: 'Mutation';
  createLocation?: {
    __typename: 'CreateLocationPayload';
    location?: {
      __typename: 'Location';
      id: number;
      name: string;
      slug: string;
      description?: string | null;
      isArchived: boolean;
      photos: { __typename: 'PhotosConnection'; totalCount: number };
    } | null;
  } | null;
};

export type UpdateLocationMutationVariables = Exact<{
  input: UpdateLocationInput;
}>;

export type UpdateLocationMutation = {
  __typename?: 'Mutation';
  updateLocation?: {
    __typename: 'UpdateLocationPayload';
    location?: {
      __typename: 'Location';
      id: number;
      name: string;
      slug: string;
      description?: string | null;
      isArchived: boolean;
      photos: { __typename: 'PhotosConnection'; totalCount: number };
    } | null;
  } | null;
};

export type DeleteLocationMutationVariables = Exact<{
  input: DeleteLocationInput;
}>;

export type DeleteLocationMutation = {
  __typename?: 'Mutation';
  deleteLocation?: {
    __typename: 'DeleteLocationPayload';
    location?: {
      __typename: 'Location';
      id: number;
      name: string;
      slug: string;
      description?: string | null;
      isArchived: boolean;
      photos: { __typename: 'PhotosConnection'; totalCount: number };
    } | null;
  } | null;
};

export type NewLocationFragment = {
  __typename?: 'Location';
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  isArchived: boolean;
  photos: { __typename: 'PhotosConnection'; totalCount: number };
} & { ' $fragmentName'?: 'NewLocationFragment' };

export type RouteAdminPhotosQueryQueryVariables = Exact<{ [key: string]: never }>;

export type RouteAdminPhotosQueryQuery = {
  __typename?: 'Query';
  photos?: {
    __typename: 'PhotosConnection';
    edges: Array<{
      __typename: 'PhotosEdge';
      node: {
        __typename: 'Photo';
        id: number;
        isArchived: boolean;
        iso?: number | null;
        shutterSpeed?: number | null;
        aperture?: string | null;
        focalLength?: string | null;
        shotAt?: Date | null;
        createdAt: Date;
        likesCount: number;
        lat?: number | null;
        lng?: number | null;
        location?: { __typename: 'Location'; id: number; name: string; slug: string } | null;
        comments: { __typename: 'CommentsConnection'; totalCount: number };
        image?: {
          __typename: 'Image';
          id: number;
          s3Key: string;
          s3Bucket: string;
          sources: Array<{
            __typename: 'ImageSource';
            s3Key?: string | null;
            size?: number | null;
            type?: string | null;
          } | null>;
        } | null;
        author?: {
          __typename: 'User';
          id: number;
          displayName: string;
          pictureUrl?: string | null;
        } | null;
      };
    }>;
  } | null;
};

export type RouteAdminPhotosUpdatePhotoMutationMutationVariables = Exact<{
  input: UpdatePhotoInput;
}>;

export type RouteAdminPhotosUpdatePhotoMutationMutation = {
  __typename?: 'Mutation';
  updatePhoto?: {
    __typename: 'UpdatePhotoPayload';
    photo?: {
      __typename: 'Photo';
      id: number;
      isArchived: boolean;
      iso?: number | null;
      shutterSpeed?: number | null;
      aperture?: string | null;
      focalLength?: string | null;
      shotAt?: Date | null;
      createdAt: Date;
      likesCount: number;
      lat?: number | null;
      lng?: number | null;
      location?: { __typename: 'Location'; id: number; name: string; slug: string } | null;
      comments: { __typename: 'CommentsConnection'; totalCount: number };
      image?: {
        __typename: 'Image';
        id: number;
        s3Key: string;
        s3Bucket: string;
        sources: Array<{
          __typename: 'ImageSource';
          s3Key?: string | null;
          size?: number | null;
          type?: string | null;
        } | null>;
      } | null;
      author?: {
        __typename: 'User';
        id: number;
        displayName: string;
        pictureUrl?: string | null;
      } | null;
    } | null;
  } | null;
};

export type RouteAdminPhotosDeletePhotoMutationMutationVariables = Exact<{
  input: DeletePhotoInput;
}>;

export type RouteAdminPhotosDeletePhotoMutationMutation = {
  __typename?: 'Mutation';
  deletePhoto?: {
    __typename: 'DeletePhotoPayload';
    photo?: { __typename: 'Photo'; id: number } | null;
  } | null;
};

export type UsersQueryQueryVariables = Exact<{ [key: string]: never }>;

export type UsersQueryQuery = {
  __typename?: 'Query';
  users?: {
    __typename: 'UsersConnection';
    totalCount: number;
    edges: Array<{
      __typename: 'UsersEdge';
      node: {
        __typename: 'User';
        id: number;
        displayName: string;
        createdAt: Date;
        pictureUrl?: string | null;
        isArchived: boolean;
        authoredPhotos: { __typename: 'PhotosConnection'; totalCount: number };
        comments: { __typename: 'CommentsConnection'; totalCount: number };
        photosLikes: { __typename: 'PhotosLikesConnection'; totalCount: number };
      };
    }>;
  } | null;
};

export type UpdateUserMutationMutationVariables = Exact<{
  input: UpdateUserInput;
}>;

export type UpdateUserMutationMutation = {
  __typename?: 'Mutation';
  updateUser?: {
    __typename: 'UpdateUserPayload';
    user?: {
      __typename: 'User';
      id: number;
      displayName: string;
      createdAt: Date;
      pictureUrl?: string | null;
      isArchived: boolean;
      authoredPhotos: { __typename: 'PhotosConnection'; totalCount: number };
      comments: { __typename: 'CommentsConnection'; totalCount: number };
      photosLikes: { __typename: 'PhotosLikesConnection'; totalCount: number };
    } | null;
  } | null;
};

export type DeleteUserMutationMutationVariables = Exact<{
  input: DeleteUserInput;
}>;

export type DeleteUserMutationMutation = {
  __typename?: 'Mutation';
  deleteUser?: {
    __typename: 'DeleteUserPayload';
    user?: { __typename: 'User'; id: number } | null;
  } | null;
};

export type RoutePhoto_EssentialsFragmentFragment = ({
  __typename?: 'Photo';
  id: number;
  location?: { __typename: 'Location'; id: number; name: string; slug: string } | null;
} & {
  ' $fragmentRefs'?: {
    PhotoInfo_PhotoFragment: PhotoInfo_PhotoFragment;
    PhotoHeader_PhotoFragment: PhotoHeader_PhotoFragment;
    PhotoImage_PhotoFragment: PhotoImage_PhotoFragment;
  };
}) & { ' $fragmentName'?: 'RoutePhoto_EssentialsFragmentFragment' };

export type RoutePhotoQueryQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;

export type RoutePhotoQueryQuery = {
  __typename?: 'Query';
  photo?:
    | ({ __typename: 'Photo'; id: number } & {
        ' $fragmentRefs'?: {
          RoutePhoto_EssentialsFragmentFragment: RoutePhoto_EssentialsFragmentFragment;
          PhotoComments_PhotoFragment: PhotoComments_PhotoFragment;
          PhotoLikes_PhotoFragment: PhotoLikes_PhotoFragment;
        };
      })
    | null;
};

export type CreatePhotoMutationVariables = Exact<{
  input: CreatePhotoInput;
}>;

export type CreatePhotoMutation = {
  __typename?: 'Mutation';
  createPhoto?: {
    __typename: 'CreatePhotoPayload';
    photo?: {
      __typename: 'Photo';
      id: number;
      location?: { __typename: 'Location'; slug: string } | null;
    } | null;
  } | null;
};

export const PhotoCard_PhotoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoCard_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blurhash' } },
          { kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'likesCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 's3Bucket' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'sources' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 's3Key' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'size' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'comments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PhotoCard_PhotoFragment, unknown>;
export const PhotoComments_PhotoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoComments_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PhotoComments_PhotoFragment, unknown>;
export const NewLocationFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'NewLocation' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Location' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'name' } },
          { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
          { kind: 'Field', name: { kind: 'Name', value: 'description' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'photos' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'isArchived' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<NewLocationFragment, unknown>;
export const PhotoLikes_PhotoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoLikes_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'likesCount' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PhotoLikes_PhotoFragment, unknown>;
export const PhotoInfo_PhotoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoInfo_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'PhotoLikes_photo' },
            directives: [{ kind: 'Directive', name: { kind: 'Name', value: 'nonreactive' } }],
          },
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shotAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shutterSpeed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'aperture' } },
          { kind: 'Field', name: { kind: 'Name', value: 'focalLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'camera' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lens' } },
          { kind: 'Field', name: { kind: 'Name', value: 'iso' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lat' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lng' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoLikes_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'likesCount' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PhotoInfo_PhotoFragment, unknown>;
export const PhotoHeader_PhotoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoHeader_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PhotoHeader_PhotoFragment, unknown>;
export const PhotoImage_PhotoFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoImage_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 's3Bucket' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'sources' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 's3Key' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'size' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blurhash' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PhotoImage_PhotoFragment, unknown>;
export const RoutePhoto_EssentialsFragmentFragmentDoc = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'RoutePhoto_EssentialsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'PhotoInfo_photo' },
            directives: [{ kind: 'Directive', name: { kind: 'Name', value: 'nonreactive' } }],
          },
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'PhotoHeader_photo' },
            directives: [{ kind: 'Directive', name: { kind: 'Name', value: 'nonreactive' } }],
          },
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'PhotoImage_photo' },
            directives: [{ kind: 'Directive', name: { kind: 'Name', value: 'nonreactive' } }],
          },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoLikes_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'likesCount' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoInfo_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'PhotoLikes_photo' },
            directives: [{ kind: 'Directive', name: { kind: 'Name', value: 'nonreactive' } }],
          },
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shotAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shutterSpeed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'aperture' } },
          { kind: 'Field', name: { kind: 'Name', value: 'focalLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'camera' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lens' } },
          { kind: 'Field', name: { kind: 'Name', value: 'iso' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lat' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lng' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoHeader_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoImage_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 's3Bucket' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'sources' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 's3Key' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'size' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blurhash' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RoutePhoto_EssentialsFragmentFragment, unknown>;
export const GetAccessTokenDocument = {
  __meta__: { hash: 'b4274cb40647d550f37cc3cbc14b2fcfe3fedf7c9bde8eee1424d56781472d89' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'GetAccessToken' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'getAccessToken' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'fromCookie' },
                      value: { kind: 'BooleanValue', value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'accessToken' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<GetAccessTokenMutation, GetAccessTokenMutationVariables>;
export const PhotoCommentsDocument = {
  __meta__: { hash: '7cc993bf939595ed6dff9dfdbb09d43f34fc83ed43b9e44b1c59a54d5245d7e8' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'PhotoComments' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Cursor' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'comments' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'condition' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'photoId' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
                    },
                  ],
                },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'orderBy' },
                value: { kind: 'EnumValue', value: 'CREATED_AT_DESC' },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'after' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'first' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
              },
            ],
            directives: [
              {
                kind: 'Directive',
                name: { kind: 'Name', value: 'connection' },
                arguments: [
                  {
                    kind: 'Argument',
                    name: { kind: 'Name', value: 'key' },
                    value: { kind: 'StringValue', value: 'PhotoComments_comments', block: false },
                  },
                  {
                    kind: 'Argument',
                    name: { kind: 'Name', value: 'filter' },
                    value: {
                      kind: 'ListValue',
                      values: [{ kind: 'Variable', name: { kind: 'Name', value: 'id' } }],
                    },
                  },
                ],
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'hasNextPage' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'startCursor' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'endCursor' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'cursor' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'body' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'user' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'pictureUrl' } },
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'isArchived' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PhotoCommentsQuery, PhotoCommentsQueryVariables>;
export const CreateCommentDocument = {
  __meta__: { hash: '15419d3df9f9a0009f06904073fddbeaaf5b02e20ef22dc19f02ec5e551123e9' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreateComment' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'comment' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CommentInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createComment' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'comment' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'comment' } },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'comment' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'body' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'pictureUrl' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'isArchived' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateCommentMutation, CreateCommentMutationVariables>;
export const UpdateCommentDocument = {
  __meta__: { hash: '0feedd2616ed7d40cdcfb1f1ee656f1fd267557d30c4df371fcc52111d1fc428' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateComment' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateCommentInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateComment' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'comment' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'isArchived' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateCommentMutation, UpdateCommentMutationVariables>;
export const PhotoLikesUserLikesQueryDocument = {
  __meta__: { hash: 'bdc989d446dd0c154d7f4a93d42c24ca0166fec0266dcbd49916311d3e198633' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'PhotoLikesUserLikesQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'photoId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'photosLikeByUserIdAndPhotoId' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'photoId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'photoId' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'userId' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'userId' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<PhotoLikesUserLikesQueryQuery, PhotoLikesUserLikesQueryQueryVariables>;
export const PhotoLikesUpsertLikeMutationDocument = {
  __meta__: { hash: 'cc17dfd07b8e9a0e2900bcaa8ff7a7fa0839ba7be4ba616299233e23a3a27056' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'PhotoLikesUpsertLikeMutation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpsertPhotoLikeInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'upsertPhotoLike' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'photosLike' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'count' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'photo' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'likesCount' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  PhotoLikesUpsertLikeMutationMutation,
  PhotoLikesUpsertLikeMutationMutationVariables
>;
export const CreateImageUploadDocument = {
  __meta__: { hash: '2e2fd30bf11967df84d58d1fbca4210f31d9dcf63ad1f4a8b0e19f8345338539' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createImageUpload' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateImageUploadInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createImageUpload' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'signedUrl' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'image' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateImageUploadMutation, CreateImageUploadMutationVariables>;
export const UpdateImageDocument = {
  __meta__: { hash: '854706124543341d846d95cfa504d662a52d136fd4b90b8c7b525354bba639d9' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateImage' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateImageInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateImage' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'image' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'isUploaded' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateImageMutation, UpdateImageMutationVariables>;
export const LocationsByDistanceDocument = {
  __meta__: { hash: '6e6cf55dbb1b8662d2d106d5cc4973170e4a7d266f68705dd30285626b0c8f45' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'LocationsByDistance' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'lat' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'lng' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Float' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'locationsByDistance' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'lat' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'lat' } },
              },
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'lng' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'lng' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LocationsByDistanceQuery, LocationsByDistanceQueryVariables>;
export const LoginWithGoogleDocument = {
  __meta__: { hash: 'ff6b42d28343d5d03dbfe01cf9a29749cba8d44febbee772e56414b924f7a728' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'LoginWithGoogle' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'code' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'loginWithGoogle' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'code' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'code' } },
                    },
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'toCookie' },
                      value: { kind: 'BooleanValue', value: true },
                    },
                  ],
                },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'accessToken' } },
                { kind: 'Field', name: { kind: 'Name', value: 'refreshToken' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LoginWithGoogleMutation, LoginWithGoogleMutationVariables>;
export const CurrentUserQueryDocument = {
  __meta__: { hash: 'bf3b3b5387cf6d3d1a8a8350a2a1ee8a4eebfc2e93a541603daf7e2d59985010' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'CurrentUserQuery' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'currentUser' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
                { kind: 'Field', name: { kind: 'Name', value: 'pictureUrl' } },
                { kind: 'Field', name: { kind: 'Name', value: 'role' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CurrentUserQueryQuery, CurrentUserQueryQueryVariables>;
export const LogoutMutationDocument = {
  __meta__: { hash: '0c7bec12ccf4ce632876cdc80d5862083aa32dd9f21dac78ca1e1f1f03e9f073' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'LogoutMutation' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'logout' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: {
                  kind: 'ObjectValue',
                  fields: [
                    {
                      kind: 'ObjectField',
                      name: { kind: 'Name', value: 'fromCookie' },
                      value: { kind: 'BooleanValue', value: true },
                    },
                  ],
                },
              },
            ],
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LogoutMutationMutation, LogoutMutationMutationVariables>;
export const LocationQueryDocument = {
  __meta__: { hash: 'bfcba9e48b6ae476b6dc4d9a57fa310d14e8a2867f210ee03212558015497c0d' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'LocationQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'String' } },
          },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
          type: { kind: 'NamedType', name: { kind: 'Name', value: 'Cursor' } },
        },
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            alias: { kind: 'Name', value: 'location' },
            name: { kind: 'Name', value: 'locationBySlug' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'slug' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'slug' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'photos' },
                  arguments: [
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'orderBy' },
                      value: {
                        kind: 'ListValue',
                        values: [{ kind: 'EnumValue', value: 'CREATED_AT_DESC' }],
                      },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'after' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'after' } },
                    },
                    {
                      kind: 'Argument',
                      name: { kind: 'Name', value: 'first' },
                      value: { kind: 'Variable', name: { kind: 'Name', value: 'first' } },
                    },
                  ],
                  directives: [
                    {
                      kind: 'Directive',
                      name: { kind: 'Name', value: 'connection' },
                      arguments: [
                        {
                          kind: 'Argument',
                          name: { kind: 'Name', value: 'key' },
                          value: {
                            kind: 'StringValue',
                            value: 'RouteLocation_photos',
                            block: false,
                          },
                        },
                        {
                          kind: 'Argument',
                          name: { kind: 'Name', value: 'filter' },
                          value: {
                            kind: 'ListValue',
                            values: [{ kind: 'Variable', name: { kind: 'Name', value: 'slug' } }],
                          },
                        },
                      ],
                    },
                  ],
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'pageInfo' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'hasNextPage' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'startCursor' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'endCursor' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'edges' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'cursor' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'node' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  {
                                    kind: 'FragmentSpread',
                                    name: { kind: 'Name', value: 'RoutePhoto_EssentialsFragment' },
                                  },
                                  {
                                    kind: 'FragmentSpread',
                                    name: { kind: 'Name', value: 'PhotoCard_photo' },
                                    directives: [
                                      {
                                        kind: 'Directive',
                                        name: { kind: 'Name', value: 'nonreactive' },
                                      },
                                    ],
                                  },
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'width' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'height' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'blurhash' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'image' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 's3Bucket' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'sources' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'type' },
                                              },
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 's3Key' },
                                              },
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'size' },
                                              },
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: '__typename' },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: '__typename' },
                                        },
                                      ],
                                    },
                                  },
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoLikes_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'likesCount' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoInfo_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'PhotoLikes_photo' },
            directives: [{ kind: 'Directive', name: { kind: 'Name', value: 'nonreactive' } }],
          },
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shotAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shutterSpeed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'aperture' } },
          { kind: 'Field', name: { kind: 'Name', value: 'focalLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'camera' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lens' } },
          { kind: 'Field', name: { kind: 'Name', value: 'iso' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lat' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lng' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoHeader_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoImage_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 's3Bucket' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'sources' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 's3Key' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'size' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blurhash' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'RoutePhoto_EssentialsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'PhotoInfo_photo' },
            directives: [{ kind: 'Directive', name: { kind: 'Name', value: 'nonreactive' } }],
          },
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'PhotoHeader_photo' },
            directives: [{ kind: 'Directive', name: { kind: 'Name', value: 'nonreactive' } }],
          },
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'PhotoImage_photo' },
            directives: [{ kind: 'Directive', name: { kind: 'Name', value: 'nonreactive' } }],
          },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoCard_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blurhash' } },
          { kind: 'Field', name: { kind: 'Name', value: 'thumbnail' } },
          { kind: 'Field', name: { kind: 'Name', value: 'likesCount' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 's3Bucket' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'sources' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 's3Key' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'size' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'comments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<LocationQueryQuery, LocationQueryQueryVariables>;
export const RouteMainQueryDocument = {
  __meta__: { hash: '9da07a15a99f8b173f654d02f49115d4f757dfa1e29d221c9a10e3620ce3c532' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'RouteMainQuery' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'locations' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'nodes' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'geo' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'x' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'y' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RouteMainQueryQuery, RouteMainQueryQueryVariables>;
export const CommentsQueryDocument = {
  __meta__: { hash: '8dc4034075778d173fe97646f5b77dad6e2df1deeb677dae9ab0b7291e948007' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'CommentsQuery' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'comments' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'body' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'isArchived' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'user' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'pictureUrl' } },
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'photo' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'location' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: '__typename' },
                                        },
                                      ],
                                    },
                                  },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'image' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 's3Key' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 's3Bucket' },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: 'sources' },
                                          selectionSet: {
                                            kind: 'SelectionSet',
                                            selections: [
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 's3Key' },
                                              },
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'size' },
                                              },
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: 'type' },
                                              },
                                              {
                                                kind: 'Field',
                                                name: { kind: 'Name', value: '__typename' },
                                              },
                                            ],
                                          },
                                        },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: '__typename' },
                                        },
                                      ],
                                    },
                                  },
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CommentsQueryQuery, CommentsQueryQueryVariables>;
export const UpdateCommentMutationDocument = {
  __meta__: { hash: '21af94c8efc4c695cd9feef7a64cdd8939e2780f5a402823cea0755f55418563' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateCommentMutation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateCommentInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateComment' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'comment' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'body' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'isArchived' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'user' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'pictureUrl' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'photo' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'location' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'image' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 's3Key' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 's3Bucket' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sources' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 's3Key' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'size' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: '__typename' },
                                        },
                                      ],
                                    },
                                  },
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateCommentMutationMutation, UpdateCommentMutationMutationVariables>;
export const DeleteCommentMutationDocument = {
  __meta__: { hash: '2d173e5372cad1ef2230649c17724b133d144d0e1007bb7cd70b2b8cca1c0ce3' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteCommentMutation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'DeleteCommentInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteComment' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'comment' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteCommentMutationMutation, DeleteCommentMutationMutationVariables>;
export const RouteAdminLocationsQueryDocument = {
  __meta__: { hash: 'dfbe15c25804e4bfe3fa90f670a229e61c578a8902a7690e3e895b31f515157a' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'RouteAdminLocationsQuery' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'locations' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'includeArchived' },
                value: { kind: 'EnumValue', value: 'YES' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'photos' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'isArchived' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'pageInfo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'hasNextPage' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'endCursor' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'startCursor' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RouteAdminLocationsQueryQuery, RouteAdminLocationsQueryQueryVariables>;
export const CreateLocationDocument = {
  __meta__: { hash: 'c48c5d7c3750808e8dde498f94a53615c4f198c5805b605c6eec21609ad2fda4' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'createLocation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreateLocationInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createLocation' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'location' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'photos' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'isArchived' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreateLocationMutation, CreateLocationMutationVariables>;
export const UpdateLocationDocument = {
  __meta__: { hash: '8b99f05110b7e25e82d38e70306b36dcd3c4bec5e59bdf10188a44aeca4e82d0' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'updateLocation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateLocationInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateLocation' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'location' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'photos' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'isArchived' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateLocationMutation, UpdateLocationMutationVariables>;
export const DeleteLocationDocument = {
  __meta__: { hash: '79158279db9b196b727fa85e5d53328c07bff89fd9e95370b6a878c066006303' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'deleteLocation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'DeleteLocationInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteLocation' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'location' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'description' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'photos' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'isArchived' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteLocationMutation, DeleteLocationMutationVariables>;
export const RouteAdminPhotosQueryDocument = {
  __meta__: { hash: 'c5ba69f10bef2dc51231085804612a0fb235fe4fba15b3b7384e6595f9f18ab1' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'RouteAdminPhotosQuery' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'photos' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'includeArchived' },
                value: { kind: 'EnumValue', value: 'YES' },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'isArchived' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'iso' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'shutterSpeed' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'aperture' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'focalLength' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'shotAt' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'location' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'likesCount' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'lat' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'lng' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'comments' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'image' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 's3Key' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 's3Bucket' } },
                                  {
                                    kind: 'Field',
                                    name: { kind: 'Name', value: 'sources' },
                                    selectionSet: {
                                      kind: 'SelectionSet',
                                      selections: [
                                        { kind: 'Field', name: { kind: 'Name', value: 's3Key' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'size' } },
                                        { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                        {
                                          kind: 'Field',
                                          name: { kind: 'Name', value: '__typename' },
                                        },
                                      ],
                                    },
                                  },
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'author' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'pictureUrl' } },
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RouteAdminPhotosQueryQuery, RouteAdminPhotosQueryQueryVariables>;
export const RouteAdminPhotosUpdatePhotoMutationDocument = {
  __meta__: { hash: '41a4006b16d8ddcd9b6c01d11ca1cd236750562b4d2c8430ea3d82603d5994bc' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RouteAdminPhotosUpdatePhotoMutation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdatePhotoInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updatePhoto' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'photo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'isArchived' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'iso' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'shutterSpeed' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'aperture' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'focalLength' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'shotAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'location' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'likesCount' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'lat' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'lng' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'comments' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'image' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 's3Key' } },
                            { kind: 'Field', name: { kind: 'Name', value: 's3Bucket' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'sources' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 's3Key' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'size' } },
                                  { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'author' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'pictureUrl' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RouteAdminPhotosUpdatePhotoMutationMutation,
  RouteAdminPhotosUpdatePhotoMutationMutationVariables
>;
export const RouteAdminPhotosDeletePhotoMutationDocument = {
  __meta__: { hash: '75d972910e6453e449ef4d59f788cb68dcae86874bb7c32e5f5f34c7b31ad292' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'RouteAdminPhotosDeletePhotoMutation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'DeletePhotoInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deletePhoto' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'photo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<
  RouteAdminPhotosDeletePhotoMutationMutation,
  RouteAdminPhotosDeletePhotoMutationMutationVariables
>;
export const UsersQueryDocument = {
  __meta__: { hash: 'bfc44540e9303db7cf990fc9aaee6d484b1d1470b75ba6987b981ca190eee7d5' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'UsersQuery' },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'users' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'edges' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'node' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                            { kind: 'Field', name: { kind: 'Name', value: 'pictureUrl' } },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'authoredPhotos' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'comments' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                ],
                              },
                            },
                            {
                              kind: 'Field',
                              name: { kind: 'Name', value: 'photosLikes' },
                              selectionSet: {
                                kind: 'SelectionSet',
                                selections: [
                                  { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                                  { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                                ],
                              },
                            },
                            { kind: 'Field', name: { kind: 'Name', value: 'isArchived' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UsersQueryQuery, UsersQueryQueryVariables>;
export const UpdateUserMutationDocument = {
  __meta__: { hash: '5348c761b75bea062104132c12caea66bcb34e8d52a46a8dbd35a288581cf277' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'UpdateUserMutation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'UpdateUserInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'updateUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'displayName' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'createdAt' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'pictureUrl' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'authoredPhotos' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'comments' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'photosLikes' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'totalCount' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: 'isArchived' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<UpdateUserMutationMutation, UpdateUserMutationMutationVariables>;
export const DeleteUserMutationDocument = {
  __meta__: { hash: 'a7f057632e8e7739187f89bcbcf008b1f18a9dd20d05e12e6d2ee86c9fd8d745' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'DeleteUserMutation' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'DeleteUserInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'deleteUser' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'user' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<DeleteUserMutationMutation, DeleteUserMutationMutationVariables>;
export const RoutePhotoQueryDocument = {
  __meta__: { hash: 'e0a13921e5aa7360b27e13c40c60e61e1a896d38c96db45e8b73212b747a70bf' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'query',
      name: { kind: 'Name', value: 'RoutePhotoQuery' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'Int' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'photo' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'id' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'id' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'RoutePhoto_EssentialsFragment' },
                },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'PhotoComments_photo' },
                  directives: [{ kind: 'Directive', name: { kind: 'Name', value: 'nonreactive' } }],
                },
                {
                  kind: 'FragmentSpread',
                  name: { kind: 'Name', value: 'PhotoLikes_photo' },
                  directives: [{ kind: 'Directive', name: { kind: 'Name', value: 'nonreactive' } }],
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoLikes_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'likesCount' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoInfo_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'PhotoLikes_photo' },
            directives: [{ kind: 'Directive', name: { kind: 'Name', value: 'nonreactive' } }],
          },
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shotAt' } },
          { kind: 'Field', name: { kind: 'Name', value: 'shutterSpeed' } },
          { kind: 'Field', name: { kind: 'Name', value: 'aperture' } },
          { kind: 'Field', name: { kind: 'Name', value: 'focalLength' } },
          { kind: 'Field', name: { kind: 'Name', value: 'camera' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lens' } },
          { kind: 'Field', name: { kind: 'Name', value: 'iso' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lat' } },
          { kind: 'Field', name: { kind: 'Name', value: 'lng' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoHeader_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoImage_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'image' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 's3Bucket' } },
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'sources' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'type' } },
                      { kind: 'Field', name: { kind: 'Name', value: 's3Key' } },
                      { kind: 'Field', name: { kind: 'Name', value: 'size' } },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
          { kind: 'Field', name: { kind: 'Name', value: 'width' } },
          { kind: 'Field', name: { kind: 'Name', value: 'height' } },
          { kind: 'Field', name: { kind: 'Name', value: 'blurhash' } },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'RoutePhoto_EssentialsFragment' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'PhotoInfo_photo' },
            directives: [{ kind: 'Directive', name: { kind: 'Name', value: 'nonreactive' } }],
          },
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'PhotoHeader_photo' },
            directives: [{ kind: 'Directive', name: { kind: 'Name', value: 'nonreactive' } }],
          },
          {
            kind: 'FragmentSpread',
            name: { kind: 'Name', value: 'PhotoImage_photo' },
            directives: [{ kind: 'Directive', name: { kind: 'Name', value: 'nonreactive' } }],
          },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'location' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                { kind: 'Field', name: { kind: 'Name', value: 'name' } },
                { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'PhotoComments_photo' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Photo' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
          { kind: 'Field', name: { kind: 'Name', value: 'id' } },
        ],
      },
    },
  ],
} as unknown as DocumentNode<RoutePhotoQueryQuery, RoutePhotoQueryQueryVariables>;
export const CreatePhotoDocument = {
  __meta__: { hash: '683afe7271891c6a99f61600145bbf3bb646e9f15ea98766c319934064cb2f1e' },
  kind: 'Document',
  definitions: [
    {
      kind: 'OperationDefinition',
      operation: 'mutation',
      name: { kind: 'Name', value: 'CreatePhoto' },
      variableDefinitions: [
        {
          kind: 'VariableDefinition',
          variable: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
          type: {
            kind: 'NonNullType',
            type: { kind: 'NamedType', name: { kind: 'Name', value: 'CreatePhotoInput' } },
          },
        },
      ],
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'createPhoto' },
            arguments: [
              {
                kind: 'Argument',
                name: { kind: 'Name', value: 'input' },
                value: { kind: 'Variable', name: { kind: 'Name', value: 'input' } },
              },
            ],
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'photo' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'Field', name: { kind: 'Name', value: 'id' } },
                      {
                        kind: 'Field',
                        name: { kind: 'Name', value: 'location' },
                        selectionSet: {
                          kind: 'SelectionSet',
                          selections: [
                            { kind: 'Field', name: { kind: 'Name', value: 'slug' } },
                            { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                          ],
                        },
                      },
                      { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
                    ],
                  },
                },
                { kind: 'Field', name: { kind: 'Name', value: '__typename' } },
              ],
            },
          },
        ],
      },
    },
  ],
} as unknown as DocumentNode<CreatePhotoMutation, CreatePhotoMutationVariables>;
