export class InMemoryBanRepository {
    bans = [];
    async save(ban) {
        this.bans.push(ban);
        return ban;
    }
    async findByUser(user) {
        return this.bans.filter((b) => b.user.identifier === user.identifier);
    }
    async findActiveByUser(user) {
        const now = new Date();
        const activeBan = this.bans.find((b) => b.user.identifier === user.identifier &&
            b.start <= now &&
            (!b.end || b.end > now));
        return activeBan || null;
    }
    async findAll() {
        return this.bans;
    }
}
//# sourceMappingURL=ban.js.map