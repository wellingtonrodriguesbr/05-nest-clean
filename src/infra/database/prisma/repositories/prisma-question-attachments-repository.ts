import { Injectable } from "@nestjs/common";

import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionAttachmentMapper } from "../mappers/prisma-question-attachment-mapper";
import { QuestionAttachment } from "@/domain/forum/enterprise/entities/question-attachment";

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prismaService: PrismaService) {}

  async createMany(questionAttachments: QuestionAttachment[]): Promise<void> {
    if (questionAttachments.length === 0) {
      return;
    }

    const data =
      PrismaQuestionAttachmentMapper.toPrismaUpdateMany(questionAttachments);

    await this.prismaService.attachment.updateMany(data);
  }

  async deleteMany(questionAttachments: QuestionAttachment[]): Promise<void> {
    if (questionAttachments.length === 0) {
      return;
    }

    const attachmentIds = questionAttachments.map((attachment) =>
      attachment.id.toString()
    );

    await this.prismaService.attachment.deleteMany({
      where: {
        id: {
          in: attachmentIds,
        },
      },
    });
  }

  async findManyByQuestionId(questionId: string) {
    const attachments = await this.prismaService.attachment.findMany({
      where: {
        questionId,
      },
    });

    return attachments.map(PrismaQuestionAttachmentMapper.toDomain);
  }

  async deleteManyByQuestionId(questionId: string) {
    await this.prismaService.attachment.deleteMany({
      where: {
        questionId,
      },
    });
  }
}
