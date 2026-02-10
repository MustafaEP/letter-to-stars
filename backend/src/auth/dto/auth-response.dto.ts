export class UserDto {
  id: string;
  email: string;
  name: string | null;
  role: string;
}

export class AuthResponseDto {
  accessToken: string;
  user: UserDto;
}