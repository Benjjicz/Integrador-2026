import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { GestionModule } from './modules/gestion/gestion.module';
import { EstadisticasModule } from './modules/estadisticas/estadisticas.module';
import { AuditoriasModule } from './modules/auditorias/auditorias.module';  //importo mi modulo auditorias

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', 
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USERNAME', 'postgres'),
        password: configService.get<string>('DB_PASSWORD', 'root'),
        database: configService.get<string>('DB_NAME', 'daw_db'),
        autoLoadEntities: true,
        synchronize: false, 
        ssl: configService.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
      }),
    }),

    AuthModule,
    GestionModule,
    EstadisticasModule,
    AuditoriasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}