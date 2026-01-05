import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
/**
 * Helper for filtering JSON entries that have `null` on the database (empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const DbNull: import("@prisma/client/runtime/client").DbNullClass;
/**
 * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const JsonNull: import("@prisma/client/runtime/client").JsonNullClass;
/**
 * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
 *
 * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
 */
export declare const AnyNull: import("@prisma/client/runtime/client").AnyNullClass;
export declare const ModelName: {
    readonly User: "User";
    readonly ClientProps: "ClientProps";
    readonly AdvisorProps: "AdvisorProps";
    readonly DirectorProps: "DirectorProps";
    readonly AccountType: "AccountType";
    readonly Account: "Account";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const UserScalarFieldEnum: {
    readonly identifier: "identifier";
    readonly firstname: "firstname";
    readonly lastname: "lastname";
    readonly email: "email";
    readonly password: "password";
    readonly advisorId: "advisorId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum];
export declare const ClientPropsScalarFieldEnum: {
    readonly identifier: "identifier";
    readonly userId: "userId";
};
export type ClientPropsScalarFieldEnum = (typeof ClientPropsScalarFieldEnum)[keyof typeof ClientPropsScalarFieldEnum];
export declare const AdvisorPropsScalarFieldEnum: {
    readonly identifier: "identifier";
    readonly userId: "userId";
};
export type AdvisorPropsScalarFieldEnum = (typeof AdvisorPropsScalarFieldEnum)[keyof typeof AdvisorPropsScalarFieldEnum];
export declare const DirectorPropsScalarFieldEnum: {
    readonly identifier: "identifier";
    readonly userId: "userId";
};
export type DirectorPropsScalarFieldEnum = (typeof DirectorPropsScalarFieldEnum)[keyof typeof DirectorPropsScalarFieldEnum];
export declare const AccountTypeScalarFieldEnum: {
    readonly identifier: "identifier";
    readonly name: "name";
    readonly rate: "rate";
    readonly limitByClient: "limitByClient";
    readonly description: "description";
};
export type AccountTypeScalarFieldEnum = (typeof AccountTypeScalarFieldEnum)[keyof typeof AccountTypeScalarFieldEnum];
export declare const AccountScalarFieldEnum: {
    readonly identifier: "identifier";
    readonly name: "name";
    readonly iban: "iban";
    readonly balance: "balance";
    readonly ownerId: "ownerId";
    readonly typeId: "typeId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type AccountScalarFieldEnum = (typeof AccountScalarFieldEnum)[keyof typeof AccountScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
//# sourceMappingURL=prismaNamespaceBrowser.d.ts.map