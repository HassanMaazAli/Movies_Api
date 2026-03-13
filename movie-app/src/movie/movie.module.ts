import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovieController } from './movie.controller';
import { MovieService } from './movie.service';
import { Movie } from './movie.entity';
import { MovieRating } from './movie-rating.entity';
import { User } from '../user/user.entity';
import { AuthModule } from '../auth/auth.module';
import { RecommendationModule } from '../recommendation/recommendation.module';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, MovieRating, User]), AuthModule, RecommendationModule],
  controllers: [MovieController],
  providers: [MovieService],
  
})
export class MovieModule {}