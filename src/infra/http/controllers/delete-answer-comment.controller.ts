import {
  Controller,
  BadRequestException,
  Param,
  Delete,
  HttpCode,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteAnswerCommentUseCase } from "@/domain/forum/application/use-cases/delete-answer-comment";

@Controller("/answers/comments/:id")
export class DeleteAnswerCommentController {
  constructor(private deleteAnswerComment: DeleteAnswerCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async execute(
    @Param("id") answerCommentId: string,
    @CurrentUser() user: UserPayload
  ) {
    const authorId = user.sub;

    const result = await this.deleteAnswerComment.execute({
      answerCommentId,
      authorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
