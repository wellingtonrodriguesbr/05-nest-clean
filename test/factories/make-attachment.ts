import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import {
  Attachment,
  AttachmentProps,
} from "@/domain/forum/enterprise/entities/attachment";
import { PrismaAttachmentMapper } from "@/infra/database/prisma/mappers/prisma-attachments-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { faker } from "@faker-js/faker";
import { Injectable } from "@nestjs/common";

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityId
) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.sentence(3),
      url: faker.internet.url(),
      ...override,
    },
    id
  );

  return attachment;
}

@Injectable()
export class AttachmentFactory {
  constructor(private prisma: PrismaService) {}
  async makePrismaAttachment(
    data: Partial<AttachmentProps> = {}
  ): Promise<Attachment> {
    const attachment = makeAttachment(data);

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    });

    return attachment;
  }
}
