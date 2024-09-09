import { Injectable } from "@nestjs/common";

import { QuestionAttachmentsRepository } from "@/domain/forum/application/repositories/question-attachments-repository";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionAttachmentMapper } from "../mappers/prisma-question-attachment-mapper";

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prismaService: PrismaService) {}

  async findManyByQuestionId(questionId: string) {
    const attachments = await this.prismaService.attachment.findMany({
      where: {
        questionId
      }
    });

    return attachments.map(PrismaQuestionAttachmentMapper.toDomain);
  }

  async deleteManyByQuestionId(questionId: string){
    await this.prismaService.attachment.deleteMany({
      where: {
        questionId
      }
    });
  }
}
