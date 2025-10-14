import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { FilmsService } from './films.service';
import { CreateFilmRequest, FilmResponse } from '../proto/films';

@Controller()
export class FilmsGrpcController {
  constructor(private readonly filmsService: FilmsService) {}

  @GrpcMethod('FilmsService', 'CreateFilm')
  async createFilm(data: CreateFilmRequest): Promise<FilmResponse> {
    return this.filmsService.createFilm(data);
  }
}
