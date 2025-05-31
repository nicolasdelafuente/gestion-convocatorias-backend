import { ApiProperty, ApiSchema } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

@ApiSchema({ description: 'DTO para crear un nuevo usuario' })
export class CreateUserDTO {

    @IsString()
    @ApiProperty({
        description: 'Nombre del usuario',
        example: 'Juan Perez',
        type: String,
        required: true
    })
    readonly nombre: string;
    
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        description: 'Email del usuario',
        example: 'ejemplo@gmail.com',
        type: String,
        required: true
    })
    readonly email: string;
  
    @IsNotEmpty({message: 'La contraseña del usuario no puede estar vacia'})
    @MinLength(3)
    @ApiProperty({
        description: 'Contraseña del usuario',
        example: 'password123',
        type: String,
        required: true
    })
    readonly password: string;
  
  }