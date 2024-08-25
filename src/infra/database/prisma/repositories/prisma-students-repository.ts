import { Injectable } from "@nestjs/common";
import { StudentsRepository } from "@/domain/forum/application/repositories/students-repository";
import { Student } from "@/domain/forum/enterprise/entities/student";
import { PrismaService } from "../prisma.service";
import { PrismaStudentMapper } from "../mappers/prisma-student-mapper";

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private prismaService: PrismaService) {}

  async create(student: Student): Promise<void> {
    const raw = PrismaStudentMapper.toPrisma(student);

    await this.prismaService.user.create({
      data: raw,
    });
  }

  async findByEmail(email: string): Promise<Student | null> {
    const student = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!student) {
      return null;
    }

    return PrismaStudentMapper.toDomain(student);
  }
}
