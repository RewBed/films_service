import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FullFilmData, FilmResponse, Genre, ProductionCompany, Country, Language } from '../proto/films';

@Injectable()
export class FilmsService {
  constructor(private readonly prisma: PrismaService) {}

  // REST-метод GET /films
  async getAll(): Promise<any> {
    return this.prisma.film.findMany();
  }

  async getCounts() : Promise<any> {
    return {
      filmsCount: (await this.prisma.film.count()).toFixed(),
      genresCount: (await this.prisma.genre.count()).toFixed(),
      productionComponiesCount: (await this.prisma.productionCompany.count()).toFixed(),
      productionCoutries: (await this.prisma.productionCountry.count()).toFixed()
    };
  }

  async getRandom(): Promise<any> {
    const sample = <T>(arr: T[], n: number): T[] =>
      arr.sort(() => 0.5 - Math.random()).slice(0, n);

    // --- 1. ЖАНРЫ ---
    const validGenres = await this.prisma.genre.findMany({
      include: { films: { select: { filmId: true } } },
    });
    const genres = validGenres.filter((g) => g.films.length >= 3);
    const selectedGenres = sample(genres, 4);

    // --- 2. КОМПАНИИ ---
    const validCompanies = await this.prisma.productionCompany.findMany({
      include: { films: { select: { filmId: true } } },
    });
    const companies = validCompanies.filter((c) => c.films.length >= 3);
    const selectedCompanies = sample(companies, 4);

    // --- 3. СТРАНЫ ---
    const validCountries = await this.prisma.productionCountry.findMany({
      include: { films: { select: { filmId: true } } },
    });
    const countries = validCountries.filter((c) => c.films.length >= 3);
    const selectedCountries = sample(countries, 4);

    // --- 4. ЯЗЫКИ ---
    /*
    const validLanguages = await this.prisma.spokenLanguage.findMany({
      include: { films: { select: { filmId: true } } },
    });
    const languages = validLanguages.filter((l) => l.films.length >= 3);
    const selectedLanguages = sample(languages, 3);
    */

    // --- 5. СОБИРАЕМ СВЯЗИ ---
    const referenceGroups = [
      { type: 'genre', data: selectedGenres },
      { type: 'company', data: selectedCompanies },
      { type: 'country', data: selectedCountries },
      // { type: 'language', data: selectedLanguages },
    ];

    const refResults: {
      id: number;
      name: string;
      filmIds: number[];
      type: string;
    }[] = [];

    const filmIdsSet = new Set<number>();

    for (const group of referenceGroups) {
      for (const ref of group.data) {
        const filmIds = sample(ref.films.map((f) => f.filmId), 3);
        refResults.push({
          id: ref.id,
          name: (ref as any).name ?? (ref as any).englishName ?? 'unknown',
          filmIds,
          type: group.type,
        });
        filmIds.forEach((id) => filmIdsSet.add(id));
      }
    }

    // --- 6. ПОЛУЧАЕМ ФИЛЬМЫ ---
    const allFilmIds = Array.from(filmIdsSet).slice(0, 20);
    const films = await this.prisma.film.findMany({
      where: { id: { in: allFilmIds } },
    });

    // --- 7. ВОЗВРАЩАЕМ ---
    return this.normalizeBigInt({
      films,
      references: refResults,
    });
  }

  normalizeBigInt(obj: any): any {
    if (typeof obj === 'bigint') return Number(obj);

    if (Array.isArray(obj)) {
      return obj.map((item) => this.normalizeBigInt(item));
    }

    if (obj && typeof obj === 'object') {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [key, this.normalizeBigInt(value)]),
      );
    }

    return obj;
  }

  // gRPC метод upsert фильма
  async upsertFilm(data: FullFilmData): Promise<FilmResponse> {

    // Upsert фильма
    const film = await this.prisma.film.upsert({
      where: { themoviedbId: data.film?.themoviedbId },
      update: {
        title: data.film?.title,
        originalTitle: data.film?.originalTitle || "",
        overview: data.film?.overview || "",
        releaseDate: this.timestampToDate(data.film?.releaseDate),
        originalLanguage: data.film?.originalLanguage || null,
        runtime: data.film?.runtime || null,
        budget: data.film?.budget || null,
        revenue: data.film?.revenue || null,
        popularity: data.film?.popularity || null,
        voteAverage: data.film?.voteAverage || null,
        voteCount: data.film?.voteCount || null,
        status: data.film?.status || null,
        tagline: data.film?.tagline|| null,
        homepage: data.film?.homepage || null,
        posterPath: data.film?.posterPath || null,
        backdropPath: data.film?.backdropPath || null,
        adult: data.film?.adult ?? false,
        video: data.film?.video ?? false,
      },
      create: {
        themoviedbId: data.film?.themoviedbId || 0,
        title: data.film?.title || "",
        originalTitle: data.film?.originalTitle || "",
        overview: data.film?.overview || "",
        releaseDate: this.timestampToDate(data.film?.releaseDate),
        originalLanguage: data.film?.originalLanguage || null,
        runtime: data.film?.runtime || null,
        budget: data.film?.budget || null,
        revenue: data.film?.revenue || null,
        popularity: data.film?.popularity || null,
        voteAverage: data.film?.voteAverage || null,
        voteCount: data.film?.voteCount || null,
        status: data.film?.status || null,
        tagline: data.film?.tagline|| null,
        homepage: data.film?.homepage || null,
        posterPath: data.film?.posterPath || null,
        backdropPath: data.film?.backdropPath || null,
        adult: data.film?.adult ?? false,
        video: data.film?.video ?? false,
      },
    });

    // Upsert справочников и связываем с фильмом
    await Promise.all([
      this.upsertGenres(data.genres || [], film.id),
      this.upsertProductionCompanies(data.companies || [], film.id),
      this.upsertProductionCountries(data.countries || [], film.id),
      this.upsertLanguages(data.languages || [], film.id),
    ]);

    return this.mapFilmToResponse(film);
  }

  private async upsertGenres(genres: Genre[], filmId: number) {
    for (const g of genres) {
      const genre = await this.prisma.genre.upsert({
        where: { themoviedbId: g.themoviedbId },
        update: { name: g.name },
        create: { themoviedbId: g.themoviedbId, name: g.name },
      });
      await this.prisma.filmGenre.upsert({
        where: { filmId_genreId: { filmId, genreId: genre.id } },
        update: {},
        create: { filmId, genreId: genre.id },
      });
    }
  }

  private async upsertProductionCompanies(companies: ProductionCompany[], filmId: number) {
    for (const c of companies) {
      const company = await this.prisma.productionCompany.upsert({
        where: { themoviedbId: c.themoviedbId },
        update: { name: c.name, originCountry: c.originCountry },
        create: { themoviedbId: c.themoviedbId, name: c.name, originCountry: c.originCountry },
      });
      await this.prisma.filmProductionCompany.upsert({
        where: { filmId_companyId: { filmId, companyId: company.id } },
        update: {},
        create: { filmId, companyId: company.id },
      });
    }
  }

  private async upsertProductionCountries(countries: Country[], filmId: number) {
    for (const c of countries) {
      const country = await this.prisma.productionCountry.upsert({
        where: { isoCode: c.isoCode },
        update: { name: c.name },
        create: { isoCode: c.isoCode, name: c.name },
      });
      await this.prisma.filmProductionCountry.upsert({
        where: { filmId_countryId: { filmId, countryId: country.id } },
        update: {},
        create: { filmId, countryId: country.id },
      });
    }
  }

  private async upsertLanguages(languages: Language[], filmId: number) {
    for (const l of languages) {
      const language = await this.prisma.spokenLanguage.upsert({
        where: { isoCode: l.isoCode },
        update: { name: l.name, englishName: l.englishName, isoCode: l.isoCode || "" },
        create: { isoCode: l.isoCode || "", name: l.name, englishName: l.englishName },
      });

      await this.prisma.filmSpokenLanguage.upsert({
        where: { filmId_languageId: { filmId, languageId: language.id } },
        update: {},
        create: { filmId, languageId: language.id },
      });
    }
  }

  private mapFilmToResponse(film: any): FilmResponse {
    return {
      id: film.id
    };
  }

  private dateToTimestamp(date?: Date | null): { seconds: number; nanos: number } | undefined {
    if (!date) return undefined;
    const seconds = Math.floor(date.getTime() / 1000);
    const nanos = (date.getTime() % 1000) * 1_000_000;
    return { seconds, nanos };
  }

  private timestampToDate(ts?: { seconds: number; nanos: number } | null): Date | null {
    if (!ts) return null;
    return new Date(ts.seconds * 1000 + Math.floor(ts.nanos / 1_000_000));
  }
}
