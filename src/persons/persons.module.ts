import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { PersonsService } from "./persons.services";
import { PersonsGrpcController } from "./persons.grpc.controllers";

@Module({
    imports: [PrismaModule],
    providers: [PersonsService],
    controllers: [PersonsGrpcController]
})
export class PersonModule {}