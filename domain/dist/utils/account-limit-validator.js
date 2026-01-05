export class AccountLimitValidator {
    static canCreateAccount(user, accountType) {
        const existingAccounts = user.clientProps?.accounts ?? [];
        const accountTypeId = accountType.identifier;
        const existingTypeCount = existingAccounts.filter((account) => account.type.identifier === accountTypeId).length;
        if (accountType.limitByClient === undefined || accountType.limitByClient === null) {
            return true;
        }
        return existingTypeCount < accountType.limitByClient;
    }
    static getLimitReachedMessage(accountTypeId, limit) {
        const typeId = accountTypeId ?? 'unknown';
        const limitValue = limit ?? 'unknown';
        return `Client reached account limit of ${limitValue} for type ${typeId}`;
    }
}
//# sourceMappingURL=account-limit-validator.js.map