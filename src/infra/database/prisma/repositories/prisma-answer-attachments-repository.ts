import { Injectable } from "@nestjs/common";

import { AnswerAttachmentsRepository } from "@/domain/forum/application/repositories/answer-attachments-repository";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerAttachmentMapper } from "../mappers/prisma-answer-attachment-mapper";

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private prismaService: PrismaService) {}

  async findManyByAnswerId(answerId: string) {
    const attachments = await this.prismaService.attachment.findMany({
      where: {
        answerId
      }
    });

    return attachments.map(PrismaAnswerAttachmentMapper.toDomain);
  }

  async deleteManyByAnswerId(answerId: string) {
    await this.prismaService.attachment.deleteMany({
      where: {
        answerId
      }
    });
  }
}
