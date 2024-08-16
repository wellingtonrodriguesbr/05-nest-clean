import { Either, left, right } from "@/core/either";
import { Injectable } from "@nestjs/common";
import { Student } from "../../enterprise/entities/student";
import { StudentsRepository } from "../repositories/students-repository";
import { HashGenerator } from "../cryptography/hash-generator";
import { StudentAlreadyExistsError } from "./errors/student-already-exists-error";

interface RegisterStudentUseCaseRequest {
  name: string;
  email: string;
  password: string;
}

type RegisterStudentUseCaseResponse = Either<
  StudentAlreadyExistsError,
  {
    student: Student;
  }
>;

@Injectable()
export class RegisterStudentUseCase {
  constructor(
    private studentsRepository: StudentsRepository,
    private hasGenerator: HashGenerator
  ) {}

  async execute({
    email,
    name,
    password,
  }: RegisterStudentUseCaseRequest): Promise<RegisterStudentUseCaseResponse> {
    const studentSameEmail = await this.studentsRepository.findByEmail(email);

    if (studentSameEmail) {
      return left(new StudentAlreadyExistsError(email));
    }

    const passwordHash = await this.hasGenerator.hash(password);
    const student = Student.create({
      name,
      email,
      password: passwordHash,
    });

    this.studentsRepository.create(student);

    return right({ student });
  }
}
