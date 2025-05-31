import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDTO {
    @ApiProperty({ 
        description: 'Correo electrónico del usuario', 
        example: 'usuario@example.com', 
        required: true
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;
  
    @ApiProperty({ 
        description: 'Contraseña del usuario',
        example: 'tuContraseña123',
        required: true,
        minLength: 3
    })
    @IsString()
    @MinLength(3)
    @IsNotEmpty()
    @Transform(({ value }) => value.trim()) 
    password: string;
  }