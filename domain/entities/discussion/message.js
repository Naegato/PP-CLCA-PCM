export class Message {
    identifier;
    content;
    sendAt;
    sender;
    discussion;
    constructor(identifier = null, content, sendAt, sender, discussion) {
        this.identifier = identifier;
        this.content = content;
        this.sendAt = sendAt;
        this.sender = sender;
        this.discussion = discussion;
    }
    reply(sender, content) {
        return new Message(null, content, new Date(), sender, this.discussion);
    }
}
//# sourceMappingURL=message.js.map