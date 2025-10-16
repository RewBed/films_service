import { Controller } from "@nestjs/common";
import { GrpcMethod } from "@nestjs/microservices";
import { Person, PersonResponse } from "src/proto/person";
import { PersonsService } from "./persons.services";

@Controller()
export class PersonsGrpcController {
    constructor(private readonly personsService: PersonsService) {}
    
    @GrpcMethod('PersonService', 'UpsertPerson')
    async UpsertPerson(data: Person): Promise<PersonResponse> {
        return await this.personsService.upsertPerson(data);
    }
}