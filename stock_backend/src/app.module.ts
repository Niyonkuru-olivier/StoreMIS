// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AssetModule } from './asset/asset.module';
import { Asset } from './asset/asset.entity';
import { InventoryModule } from './inventory/inventory.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env globally
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
        entities: [Asset], // Add specific entities
        autoLoadEntities: true, // Automatically load all entities
        synchronize: true, // Set to true for initial setup, then false in production
        ssl: {
          rejectUnauthorized: false // Required for Render PostgreSQL
        }
      }),
    }),
    UserModule,
    AssetModule,
    InventoryModule,
    ReportsModule,
    AuthModule,
  ],
})
export class AppModule {}