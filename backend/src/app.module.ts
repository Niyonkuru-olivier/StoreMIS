import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: 'dpg-d18k3semcj7s73a2sbi0-a',
        port: 5432,
        username: 'storemis_user',
        password: 'Zo38OXrwgqJWDqhfJT6xDOH9VKsFBIPP',
        database: 'mininfra',
        entities: [User],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false
        }
      }),
    }),
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}