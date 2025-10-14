import { Controller, Get } from '@nestjs/common';
import { FilmsService } from './films.service';
import { Film } from '@prisma/client';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getAllFilms(): Promise<Film[]> {
    return this.filmsService.getAll();
  }
}
