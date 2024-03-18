import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_PIPE } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
@Module({
  controllers: [AppController],
  providers: [AppService,
  {
    provide:APP_PIPE,
    useClass:ValidationPipe
  }
  ],
  imports: [ConfigModule.forRoot(),AuthModule, UserModule],
})
export class AppModule {}
