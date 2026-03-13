import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { MovieRating } from '../movie/movie-rating.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column({ type : 'date' })
  dateOfBirth: Date;

  @Column({ unique: true })
  email: string;

  

  @Column()
  password: string;

  @Column({ default: 'user' })
  role: string;

  @OneToMany(() => MovieRating, (rating) => rating.user)
  ratings: MovieRating[];
}