export interface SportDto {
  ID: number;
  NOM: string;
  CODE: string;
}
export interface Sport {
  id: number;
  nom: string;
  code: string;
}

export function mapSport(dto: SportDto): Sport {
  return {
    id: dto.ID,
    nom: dto.NOM,
    code: dto.CODE,
  };
}
//
// import { z } from 'zod';
//
// export const SportSchema = z.object({
//   ID: z.number(),
//   NOM: z.string(),
//   CODE: z.string(),
// });
//
// export type Sport = z.infer<typeof SportSchema>;
