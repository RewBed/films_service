import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFilmRequest, FilmResponse } from '../proto/films';

@Injectable()
export class FilmsService {
  constructor(private readonly prisma: PrismaService) {}

  // REST-метод GET /films
  async getAll(): Promise<any[]> {
    return this.prisma.film.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  // gRPC метод создания фильма
  async createFilm(data: CreateFilmRequest): Promise<FilmResponse> {
    const film = await this.prisma.film.create({
      data: {
        title: data.title,
        original_title: data.originalTitle || null,
        overview: data.overview || null,
        release_date: this.timestampToDate(data.releaseDate),
        original_language: data.originalLanguage || null,
        themoviedb_id: data.themoviedbId || null,
      },
    });

    return {
      id: film.id,
      title: film.title,
      originalTitle: film.original_title || "",
      overview: film.overview || "",
      releaseDate: this.dateToTimestamp(film.release_date),
      originalLanguage: film.original_language || "",
      themoviedbId: film.themoviedb_id || 0,
      createdAt: this.dateToTimestamp(film.createdAt),
      updatedAt: this.dateToTimestamp(film.updatedAt),
    };
  }

  dateToTimestamp(date?: Date | null): { seconds: number; nanos: number } | undefined {
    if (!date) return undefined;
    const seconds = Math.floor(date.getTime() / 1000);
    const nanos = (date.getTime() % 1000) * 1_000_000;
    return { seconds, nanos };
  }

  // Преобразует gRPC Timestamp в JS Date
  timestampToDate(ts?: { seconds: number; nanos: number } | null): Date | null {
    if (!ts) return null;
    return new Date(ts.seconds * 1000 + Math.floor(ts.nanos / 1_000_000));
  }
}
