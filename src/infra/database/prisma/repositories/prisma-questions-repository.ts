import { Injectable } from "@nestjs/common";

import { PaginationParams } from "@/core/repositories/pagination-params";
import { QuestionsRepository } from "@/domain/forum/application/repositories/questions-repository";
import { Question } from "@/domain/forum/enterprise/entities/question";
import { PrismaService } from "../prisma.service";
import { PrismaQuestionMapper } from "../mappers/prisma-question-mapper";

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private prismaService: PrismaService) {}

  async create(question: Question) {
    const raw = PrismaQuestionMapper.toPrisma(question);
    await this.prismaService.question.create({
      data: raw,
    });
  }

  async save(question: Question) {
    const raw = PrismaQuestionMapper.toPrisma(question);
    await this.prismaService.question.update({
      where: {
        id: raw.id,
      },
      data: raw,
    });
  }

  async findBySlug(slug: string) {
    const question = await this.prismaService.question.findUnique({
      where: {
        slug,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async findManyRecent(params: PaginationParams) {
    const questions = await this.prismaService.question.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 20,
      skip: (params.page - 1) * 20,
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }

  async findById(questionId: string) {
    const question = await this.prismaService.question.findUnique({
      where: {
        id: questionId,
      },
    });

    if (!question) {
      return null;
    }

    return PrismaQuestionMapper.toDomain(question);
  }

  async delete(question: Question) {
    const raw = PrismaQuestionMapper.toPrisma(question);
    await this.prismaService.question.delete({
      where: {
        id: raw.id,
      },
    });
  }
}
