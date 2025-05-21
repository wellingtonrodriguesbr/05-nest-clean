import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Param,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { CommentOnQuestionUseCase } from "@/domain/forum/application/use-cases/comment-on-question";

import { z } from "zod";

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
});

type CommentOnQuestionBodySchema = z.infer<typeof commentOnQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema);

@Controller("/questions/:questionId/comments")
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async execute(
    @Body(bodyValidationPipe) body: CommentOnQuestionBodySchema,
    @Param("questionId") questionId: string,
    @CurrentUser() user: UserPayload
  ) {
    const { content } = commentOnQuestionBodySchema.parse(body);

    const authorId = user.sub;

    const result = await this.commentOnQuestion.execute({
      content,
      authorId,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
