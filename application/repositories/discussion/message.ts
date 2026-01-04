import { Message } from "@pp-clca-pcm/domain/entities/discussion/message";

export interface MessageRepository {
  save(message: Message): Promise<Message>;
}
