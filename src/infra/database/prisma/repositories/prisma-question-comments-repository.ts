import { Injectable } from "@nestjs/common";

import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionCommentsRepository } from "@/domain/forum/application/repositories/question-comments-repository";
import { QuestionComment } from "@/domain/forum/enterprise/entities/question-comment";
import { PrismaQuestionCommentMapper } from "../mappers/prisma-question-comment-mapper";
import { PrismaService } from "../prisma.service";

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private prismaService: PrismaService) {}

  async findById(id: string) {
    const questionComment = await this.prismaService.comment.findUnique({
      where: {
        id
      }
    });

    if(!questionComment) {
      return null;
    }

    return PrismaQuestionCommentMapper.toDomain(questionComment);
  }

  async findManyByQuestionId(
    questionId: string,
    params: PaginationParams
  ) {
    const questionComments = await this.prismaService.comment.findMany({
      where: {
        questionId
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 20,
      skip: (params.page - 1) * 20
    });

    return questionComments.map(PrismaQuestionCommentMapper.toDomain);
  }

  async create(questionComment: QuestionComment): Promise<void> {
    const raw = PrismaQuestionCommentMapper.toPrisma(questionComment);

    await this.prismaService.comment.create({
      data: raw
    });
  }
  
  async delete(questionComment: QuestionComment) {
    const raw = PrismaQuestionCommentMapper.toPrisma(questionComment);
    await this.prismaService.comment.delete({
      where: {
        id: raw.id,
        questionId: raw.questionId
      }
    });
  }
}
