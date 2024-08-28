import {
  Controller,
  Post,
  UseGuards,
  Body,
  BadRequestException,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { JwtAuthGuard } from "@/infra/auth/jwt-auth.guard";
import { CurrentUser } from "@/infra/auth/current-user-decorator";
import { UserPayload } from "@/infra/auth/jwt.strategy";
import { z } from "zod";
import { CreateQuestionUseCase } from "@/domain/forum/application/use-cases/create-question";

const createQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

@Controller("/questions")
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async execute(
    @Body(bodyValidationPipe) body: CreateQuestionBodySchema,
    @CurrentUser() user: UserPayload
  ) {
    const { title, content } = createQuestionBodySchema.parse(body);

    const authorId = user.sub;

    const result = await this.createQuestion.execute({
      title,
      content,
      authorId,
      attachmentsIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
