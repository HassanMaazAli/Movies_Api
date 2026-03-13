import { Injectable, NotFoundException, BadRequestException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from './movie.entity';
import { MovieRating } from './movie-rating.entity';
import { User } from '../user/user.entity';
import { AddMovieDto } from '../user/dto/add-movie.dto';
import { SearchMovieDto } from '../user/dto/search-movie.dto';
import { RateMovieDto } from '../user/dto/rate-movie.dto';

@Injectable()
export class MovieService implements OnModuleInit {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(MovieRating)
    private ratingRepository: Repository<MovieRating>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Seed predefined movies if table is empty
  async onModuleInit() {
    const count = await this.movieRepository.count();
    if (count === 0) {
      const movies = [
        { title: 'Inception', description: 'A thief who steals corporate secrets', releaseYear: 2010 },
        { title: 'The Matrix', description: 'A computer hacker learns about the true nature of reality', releaseYear: 1999 },
        { title: 'Interstellar', description: 'A team of explorers travel through a wormhole', releaseYear: 2014 },
        { title: 'The Godfather', description: 'The aging patriarch of an organized crime dynasty', releaseYear: 1972 },
        { title: 'Pulp Fiction', description: 'The lives of two mob hitmen, a boxer, and more', releaseYear: 1994 },
      ];
      await this.movieRepository.save(movies);
      console.log('Database seeded with predefined movies.');
    }
  }

  async addMovie(addMovieDto: AddMovieDto): Promise<Movie> {
    const { title } = addMovieDto;
    const existing = await this.movieRepository.findOne({ where: { title } });
    if (existing) throw new BadRequestException('Movie with this title already exists');
    const movie = this.movieRepository.create(addMovieDto);
    return this.movieRepository.save(movie);
  }

  async searchMovies(searchDto: SearchMovieDto): Promise<Movie[]> {
    const { title } = searchDto;
    const query = this.movieRepository.createQueryBuilder('movie');
    if (title) {
      query.where('movie.title LIKE :title', { title: `%${title}%` });
    }
    const movies = await query.getMany();

    for (const movie of movies) {
      const avg = await this.ratingRepository
        .createQueryBuilder('rating')
        .where('rating.movieId = :movieId', { movieId: movie.id })
        .select('AVG(rating.value)', 'avg')
        .getRawOne();
      movie.averageRating = avg ? parseFloat(avg.avg) : 0;
    }
    return movies;
  }

  async findByIds(ids: number[]): Promise<Movie[]> {
  return this.movieRepository.findByIds(ids);
}

  async rateMovie(movieId: number, rateDto: RateMovieDto, userId: number): Promise<{ message: string }> {
    const movie = await this.movieRepository.findOne({ where: { id: movieId } });
    if (!movie) throw new NotFoundException('Movie not found');

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    let rating = await this.ratingRepository.findOne({
      where: { user: { id: userId }, movie: { id: movieId } },
    });

    if (rating) {
      rating.value = rateDto.value;
      await this.ratingRepository.save(rating);
      return { message: 'Rating updated' };
    } else {
      rating = this.ratingRepository.create({
        value: rateDto.value,
        user,
        movie,
      });
      await this.ratingRepository.save(rating);
      return { message: 'Rating added' };
    }
  }
}