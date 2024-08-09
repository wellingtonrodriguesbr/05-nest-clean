import request from "supertest";

import { AppModule } from "@/infra/app.module";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";

describe("Fetch recent questions (E2E)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    await app.init();
  });

  test("[GET] /questions", async () => {
    const user = await prisma.user.create({
      data: {
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456",
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    await prisma.question.createMany({
      data: [
        {
          title: "New question created",
          content: "The content of question",
          slug: "new-question-created",
          authorId: user.id,
        },
        {
          title: "New question created 2",
          content: "The content of question",
          slug: "new-question-created-2",
          authorId: user.id,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get("/questions")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ title: "New question created" }),
        expect.objectContaining({ title: "New question created 2" }),
      ],
    });

    const questionOnDatabase = await prisma.question.findMany();

    expect(questionOnDatabase).toHaveLength(2);
  });
});
