import { Module } from '@nestjs/common';
import { FilmsService } from './films.service'
import { FilmsController } from './films.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { FilmsGrpcController } from './films.grpc.controller';

@Module({
  imports: [PrismaModule],
  providers: [FilmsService],
  controllers: [FilmsController, FilmsGrpcController],
})
export class FilmsModule {}
