import { Message } from "../../../domain/entities/discussion/message";

export interface MessageRepository {
  save(message: Message): Promise<Message>;
  get(messageId: string): Promise<Message | null>;
}
