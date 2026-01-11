import { Message } from "../../../domain/entities/discussion/message.js";

export interface MessageRepository {
  save(message: Message): Promise<Message>;
  get(id: string): Promise<Message | null>;
}
