import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./jwt.strategy";
import { APP_GUARD } from "@nestjs/core";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { EnvService } from '../env/env.service';
import { EnvModule } from "../env/env.module";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      inject: [EnvService],
      imports: [EnvModule],
      global: true,
      useFactory(env: EnvService) {
        const privateKey = env
          .get("JWT_PRIVATE_KEY")
          .trim();
        const publicKey = env.get("JWT_PUBLIC_KEY").trim();

        return {
          signOptions: { algorithm: "RS256" },
          privateKey: Buffer.from(privateKey, "base64"),
          publicKey: Buffer.from(publicKey, "base64"),
        };
      },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
    EnvService
  ],
  controllers: [],
  exports: [],
})
export class AuthModule {}
