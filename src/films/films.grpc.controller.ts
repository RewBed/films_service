import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FilmsService } from './films.service';
import { FullFilmData, FilmResponse } from '../proto/films';

@Controller()
export class FilmsGrpcController {
  constructor(private readonly filmsService: FilmsService) {}

  @GrpcMethod('FilmsService', 'UpsertFilm')
  async upsertFilm(data: FullFilmData): Promise<FilmResponse> {
    return this.filmsService.upsertFilm(data);
  }
}
