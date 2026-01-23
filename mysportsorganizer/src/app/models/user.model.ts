export interface UserDto {
  ID: number;
  NOM: string;
  PRENOM: string;
  DDN: Date;
  EMAIL: string;
  PASSWORD_HASH: string;
}
export interface User {
  id: number;
  nom: string;
  prenom: string;
  ddn: Date;
  email: string;
  password: string;
}

export function mapUser(dto: UserDto): User {
  return {
    id: dto.ID,
    nom: dto.NOM,
    prenom:dto.PRENOM,
    ddn: dto.DDN,
    email: dto.EMAIL,
    password: dto.PASSWORD_HASH,
  }
}

export function userToDto(user: User): UserDto {
  return {
    ID: user.id,
    NOM: user.nom,
    PRENOM: user.prenom,
    DDN: user.ddn,
    EMAIL: user.email,
    PASSWORD_HASH: user.password,
  }
}
