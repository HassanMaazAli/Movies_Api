import { Controller, Get, Post, Body, Query, Param, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MovieService } from './movie.service';
import { AddMovieDto } from '../user/dto/add-movie.dto';
import { SearchMovieDto } from '../user/dto/search-movie.dto';
import { RateMovieDto } from '../user/dto/rate-movie.dto';
import { RecommendationService } from '../recommendation/recommendation.service';

interface RequestWithUser extends Request {
  user: { userId: number; email: string };
}

@Controller('movie')
export class MovieController {
  constructor(
    private movieService: MovieService,
    private recommendationService: RecommendationService, // <-- add this
  ) {}
  @Get()
  async search(@Query() searchDto: SearchMovieDto) {
    return this.movieService.searchMovies(searchDto);
  }
  @Get('recommendations')
@UseGuards(AuthGuard('jwt'))
async getRecommendedMovies(@Req() req: any) {
  const userId = req.user.userId;
  const movieIds = await this.recommendationService.getRecommendations(userId);
  return this.movieService.findByIds(movieIds);
}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async addMovie(@Body() addMovieDto: AddMovieDto) {
    return this.movieService.addMovie(addMovieDto);
  }

  @Post(':id/rate')
  @UseGuards(AuthGuard('jwt'))
  async rateMovie(
    @Param('id') id: string,
    @Body() rateDto: RateMovieDto,
    @Req() req: RequestWithUser,
  ) {
    return this.movieService.rateMovie(+id, rateDto, req.user.userId);
  }
}