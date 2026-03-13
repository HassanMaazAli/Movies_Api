import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MovieRating } from './movie-rating.entity';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  releaseYear: number;

  @OneToMany(() => MovieRating, (rating) => rating.movie)
  ratings: MovieRating[];

  averageRating?: number; // virtual
}