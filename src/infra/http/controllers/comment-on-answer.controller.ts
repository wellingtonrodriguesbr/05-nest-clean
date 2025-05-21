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
import { CommentOnAnswerUseCase } from "@/domain/forum/application/use-cases/comment-on-answer";

import { z } from "zod";

const commentOnAnswerBodySchema = z.object({
  content: z.string(),
});

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(commentOnAnswerBodySchema);

@Controller("/answers/:answerId/comments")
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async execute(
    @Body(bodyValidationPipe) body: CommentOnAnswerBodySchema,
    @Param("answerId") answerId: string,
    @CurrentUser() user: UserPayload
  ) {
    const { content } = commentOnAnswerBodySchema.parse(body);

    const authorId = user.sub;

    const result = await this.commentOnAnswer.execute({
      content,
      authorId,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
