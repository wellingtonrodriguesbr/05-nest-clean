import {
  Body,
  Controller,
  Post,
  UsePipes,
} from "@nestjs/common";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";
import { RegisterStudentUseCase } from "@/domain/forum/application/use-cases/register-student";
import { z } from "zod";

const createAccountBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;

@Controller("/accounts")
@UsePipes(new ZodValidationPipe(createAccountBodySchema))
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  async execute(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = createAccountBodySchema.parse(body);

    const result = await this.registerStudent.execute({name, email, password})

    if (result.isLeft()) {
      throw new Error()
    }

    const { student } = result.value

    return { studentId: student.id.toString() }
  }
}
