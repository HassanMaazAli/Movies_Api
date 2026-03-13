import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { User } from '../user/user.entity';
import { Movie } from './movie.entity';

@Entity()
@Unique(['user', 'movie'])
export class MovieRating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  value: number; // 1-5

  @ManyToOne(() => User, (user) => user.ratings, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Movie, (movie) => movie.ratings, { onDelete: 'CASCADE' })
  movie: Movie;
}