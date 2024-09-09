import { Injectable } from "@nestjs/common";

import { PaginationParams } from "@/core/repositories/pagination-params";
import { AnswerCommentsRepository } from "@/domain/forum/application/repositories/answer-comments-repository";
import { AnswerComment } from "@/domain/forum/enterprise/entities/answer-comment";
import { PrismaService } from "../prisma.service";
import { PrismaAnswerCommentMapper } from "../mappers/prisma-answer-comment-mapper";

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prismaService: PrismaService) {}

  async findById(id: string) {
    const answerComment = await this.prismaService.comment.findUnique({
      where: {
        id
      }
    });

    if(!answerComment) {
      return null;
    }

    return PrismaAnswerCommentMapper.toDomain(answerComment);
  }

  async findManyByAnswerId(
    answerId: string,
    params: PaginationParams
  ) {
    const answerComments = await this.prismaService.comment.findMany({
      where: {
        answerId
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20,
      skip: (params.page - 1) * 20
    });

    return answerComments.map(PrismaAnswerCommentMapper.toDomain);
  }

  async create(answerComment: AnswerComment) {
    const raw = PrismaAnswerCommentMapper.toPrisma(answerComment);

    await this.prismaService.comment.create({
      data: raw
    });
  }

async delete(answerComment: AnswerComment) {
    const raw = PrismaAnswerCommentMapper.toPrisma(answerComment);
    await this.prismaService.comment.delete({
      where: {
        id: raw.id,
        answerId: raw.answerId
      }
    });
  }
}
