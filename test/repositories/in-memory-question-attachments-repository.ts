import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  async createMany(questionAttachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...questionAttachments);
  }

  async deleteMany(questionAttachments: QuestionAttachment[]): Promise<void> {
    this.items = this.items.filter(
      (item) =>
        !questionAttachments.some((attachment) => attachment.equals(item))
    );
  }

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() === questionId
    );

    return questionAttachments;
  }

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toString() !== questionId
    );

    this.items = questionAttachments;
  }

  public items: QuestionAttachment[] = [];
}
