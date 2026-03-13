import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { MovieModule } from './movie/movie.module';
import { RecommendationModule } from './recommendation/recommendation.module';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true, // makes ConfigService available everywhere without importing
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',          // change to your MySQL username
      password: 'Waleedisweak@123',               // change to your MySQL password
      database: 'movie_app',      // the database you created
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
        
   }),
    AuthModule,
    MovieModule,
    UserModule,
    MovieModule,
    RecommendationModule,
  ],
})
export class AppModule {}
