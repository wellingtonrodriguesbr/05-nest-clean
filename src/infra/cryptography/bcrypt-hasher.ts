import { Injectable } from "@nestjs/common";

import { HashComparer } from "@/domain/forum/application/cryptography/hash-comparer";
import { HashGenerator } from "@/domain/forum/application/cryptography/hash-generator";
import { hash as bcryptHash, compare as bcryptCompare } from "bcryptjs";

@Injectable()
export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8;

  hash(plain: string) {
    return bcryptHash(plain, this.HASH_SALT_LENGTH);
  }

  compare(plain: string, hash: string) {
    return bcryptCompare(plain, hash);
  }
}
