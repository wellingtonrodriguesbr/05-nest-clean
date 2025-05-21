import {
  Controller,
  BadRequestException,
  Param,
  Delete,
  HttpCode,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteQuestionCommentUseCase } from "@/domain/forum/application/use-cases/delete-question-comment";

@Controller("/questions/comments/:id")
export class DeleteQuestionCommentController {
  constructor(private deleteQuestionComment: DeleteQuestionCommentUseCase) {}

  @Delete()
  @HttpCode(204)
  async execute(
    @Param("id") questionCommentId: string,
    @CurrentUser() user: UserPayload
  ) {
    const authorId = user.sub;

    const result = await this.deleteQuestionComment.execute({
      questionCommentId,
      authorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
