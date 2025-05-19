import {
  Controller,
  BadRequestException,
  Param,
  Delete,
  HttpCode,
} from "@nestjs/common";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { DeleteAnswerUseCase } from "@/domain/forum/application/use-cases/delete-answer";

@Controller("/answers/:id")
export class DeleteAnswerController {
  constructor(private deleteAnswer: DeleteAnswerUseCase) {}

  @Delete()
  @HttpCode(204)
  async execute(
    @Param("id") answerId: string,
    @CurrentUser() user: UserPayload
  ) {
    const authorId = user.sub;

    const result = await this.deleteAnswer.execute({
      answerId,
      authorId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
