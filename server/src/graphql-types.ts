/// <reference types="../types/postgres-bytea.d.ts" />
import pgBytea from 'postgres-bytea';
import type { SchemaBuilder } from 'postgraphile';

export const BinaryTypePlugin = (builder: SchemaBuilder) => {
  builder.hook(
    'build',
    (build) => {
      const {
        graphql: { GraphQLScalarType, Kind },
        pgIntrospectionResultsByKind,
        pgRegisterGqlTypeByTypeId,
        pgRegisterGqlInputTypeByTypeId,
        pg2GqlMapper,
        pgSql: sql,
      } = build;
      const bytea = pgIntrospectionResultsByKind.type.find(
        (t: { name: string; namespaceName: string }) =>
          t.name === 'bytea' && t.namespaceName === 'pg_catalog',
      );
      if (bytea == null) {
        // No bytea type found
        return build;
      }
      const BinaryType = new GraphQLScalarType({
        name: 'Base64EncodedBinary',
        description: 'Binary data encoded using Base64',
        serialize: (value) => String(value),
        parseValue: (value) => String(value),
        parseLiteral: (ast) => {
          if (ast.kind !== Kind.STRING) {
            throw new Error('Can only parse string values');
          }
          return ast.value;
        },
      });

      pgRegisterGqlTypeByTypeId(bytea.id, () => BinaryType);
      pgRegisterGqlInputTypeByTypeId(bytea.id, () => BinaryType);
      pg2GqlMapper[bytea.id] = {
        map: (data: never) => pgBytea(data).toString(),
        unmap: (str: unknown) =>
          str === null ? sql.null : sql.fragment`decode(${sql.value(str)}, 'escape')`,
      };
      return build;
    },
    ['PgBytea'],
    [],
    ['PgTypes'],
  );
};
