-- CreateTable
CREATE TABLE "Film" (
    "id" SERIAL NOT NULL,
    "themoviedbId" INTEGER NOT NULL,
    "imdbId" TEXT,
    "title" TEXT NOT NULL,
    "originalTitle" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "originalLanguage" TEXT,
    "releaseDate" TIMESTAMP(3),
    "runtime" INTEGER,
    "budget" BIGINT,
    "revenue" BIGINT,
    "popularity" DOUBLE PRECISION,
    "voteAverage" DOUBLE PRECISION,
    "voteCount" INTEGER,
    "status" TEXT,
    "tagline" TEXT,
    "homepage" TEXT,
    "posterPath" TEXT,
    "backdropPath" TEXT,
    "adult" BOOLEAN NOT NULL DEFAULT false,
    "video" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Film_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "themoviedbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilmGenre" (
    "filmId" INTEGER NOT NULL,
    "genreId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FilmGenre_pkey" PRIMARY KEY ("filmId","genreId")
);

-- CreateTable
CREATE TABLE "ProductionCompany" (
    "id" SERIAL NOT NULL,
    "themoviedbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "originCountry" TEXT,
    "logoPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionCompany_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilmProductionCompany" (
    "filmId" INTEGER NOT NULL,
    "companyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FilmProductionCompany_pkey" PRIMARY KEY ("filmId","companyId")
);

-- CreateTable
CREATE TABLE "ProductionCountry" (
    "id" SERIAL NOT NULL,
    "isoCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilmProductionCountry" (
    "filmId" INTEGER NOT NULL,
    "countryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FilmProductionCountry_pkey" PRIMARY KEY ("filmId","countryId")
);

-- CreateTable
CREATE TABLE "SpokenLanguage" (
    "id" SERIAL NOT NULL,
    "isoCode" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "englishName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SpokenLanguage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilmSpokenLanguage" (
    "filmId" INTEGER NOT NULL,
    "languageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FilmSpokenLanguage_pkey" PRIMARY KEY ("filmId","languageId")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" SERIAL NOT NULL,
    "themoviedbId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "biography" TEXT,
    "birthday" TIMESTAMP(3),
    "deathday" TIMESTAMP(3),
    "gender" INTEGER,
    "knownForDepartment" TEXT,
    "placeOfBirth" TEXT,
    "profilePath" TEXT,
    "homepage" TEXT,
    "popularity" DOUBLE PRECISION,
    "imdbId" TEXT,
    "adult" BOOLEAN NOT NULL DEFAULT false,
    "alsoKnownAs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FilmPerson" (
    "filmId" INTEGER NOT NULL,
    "personId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FilmPerson_pkey" PRIMARY KEY ("filmId","personId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Film_themoviedbId_key" ON "Film"("themoviedbId");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_themoviedbId_key" ON "Genre"("themoviedbId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionCompany_themoviedbId_key" ON "ProductionCompany"("themoviedbId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductionCountry_isoCode_key" ON "ProductionCountry"("isoCode");

-- CreateIndex
CREATE UNIQUE INDEX "SpokenLanguage_isoCode_key" ON "SpokenLanguage"("isoCode");

-- CreateIndex
CREATE UNIQUE INDEX "Person_themoviedbId_key" ON "Person"("themoviedbId");

-- AddForeignKey
ALTER TABLE "FilmGenre" ADD CONSTRAINT "FilmGenre_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmGenre" ADD CONSTRAINT "FilmGenre_genreId_fkey" FOREIGN KEY ("genreId") REFERENCES "Genre"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmProductionCompany" ADD CONSTRAINT "FilmProductionCompany_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmProductionCompany" ADD CONSTRAINT "FilmProductionCompany_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "ProductionCompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmProductionCountry" ADD CONSTRAINT "FilmProductionCountry_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmProductionCountry" ADD CONSTRAINT "FilmProductionCountry_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "ProductionCountry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmSpokenLanguage" ADD CONSTRAINT "FilmSpokenLanguage_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmSpokenLanguage" ADD CONSTRAINT "FilmSpokenLanguage_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "SpokenLanguage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmPerson" ADD CONSTRAINT "FilmPerson_filmId_fkey" FOREIGN KEY ("filmId") REFERENCES "Film"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FilmPerson" ADD CONSTRAINT "FilmPerson_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
