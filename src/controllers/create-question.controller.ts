import {
  Body,
  Controller,
  Post,
  ConflictException,
  UsePipes,
  UseGuards,
} from "@nestjs/common";
import { PrismaService } from "@prisma/prisma.service";
import { ZodValidationPipe } from "../pipes/zod-validation-pipe";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

import { hash } from "bcryptjs";
import { z } from "zod";

const createQuestionBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
});

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>;

@Controller("/questions")
@UseGuards(JwtAuthGuard)
@UsePipes(new ZodValidationPipe(createQuestionBodySchema))
export class CreateQuestionController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async execute(@Body() body: CreateQuestionBodySchema) {
    const { name, email, password } = createQuestionBodySchema.parse(body);

    const userWithSameEmail = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userWithSameEmail) {
      throw new ConflictException(
        "User with same e-mail address already exists."
      );
    }

    const hashedPassword = await hash(password, 8);

    await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }
}
