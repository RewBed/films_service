import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Person, PersonResponse } from "src/proto/person";

@Injectable()
export class PersonsService {

    constructor(private readonly prisma: PrismaService) {}

    async upsertPerson(data: Person): Promise<PersonResponse> {
        const person = await this.prisma.person.upsert({
            where: { themoviedbId: data.themoviedbId },
            update: {
            name: data.name,
            biography: data.biography || null,
            birthday: data.birthday ? new Date(data.birthday) : null,
            deathday: data.deathday ? new Date(data.deathday) : null,
            gender: data.gender || null,
            knownForDepartment: data.knownForDepartment || null,
            placeOfBirth: data.placeOfBirth || null,
            profilePath: data.profilePath || null,
            homepage: data.homepage || null,
            popularity: data.popularity || null,
            imdbId: data.imdbId || null,
            adult: data.adult ?? false,
            alsoKnownAs: data.alsoKnownAs || [],
            },
            create: {
            themoviedbId: data.themoviedbId,
            name: data.name,
            biography: data.biography || null,
            birthday: data.birthday ? new Date(data.birthday) : null,
            deathday: data.deathday ? new Date(data.deathday) : null,
            gender: data.gender || null,
            knownForDepartment: data.knownForDepartment || null,
            placeOfBirth: data.placeOfBirth || null,
            profilePath: data.profilePath || null,
            homepage: data.homepage || null,
            popularity: data.popularity || null,
            imdbId: data.imdbId || null,
            adult: data.adult ?? false,
            alsoKnownAs: data.alsoKnownAs || [],
            },
        });

        return {
            id: person.id
        };
    }
}