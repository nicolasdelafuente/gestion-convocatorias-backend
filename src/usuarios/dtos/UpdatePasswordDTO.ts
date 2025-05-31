import { PickType } from "@nestjs/swagger";
import { CreateUserDTO } from "./CreateUserDTO";

export class UpdatePasswordDTO extends PickType(CreateUserDTO, ['password'] as const) {}