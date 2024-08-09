import {
  Body,
  Controller,
  Post,
  ConflictException,
  UsePipes,
} from "@nestjs/common";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { ZodValidationPipe } from "@/infra/http/pipes/zod-validation-pipe";

import { hash } from "bcryptjs";
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
  constructor(private prisma: PrismaService) {}

  @Post()
  async execute(@Body() body: CreateAccountBodySchema) {
    const { name, email, password } = createAccountBodySchema.parse(body);

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
