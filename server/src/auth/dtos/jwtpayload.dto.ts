import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class JwtPayload {
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsOptional()
  role?: string;
}
