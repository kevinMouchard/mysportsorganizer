import {Sport} from './sports.model';

export interface CourseDto {
  ID: number,
  TITRE: string,
  DISTANCE: number,
  DENIVELE: number,
  NOM_COURSE: string,
  DATE: Date,
  SPORT_ID: number,
};


export interface Course {
  id: number,
  titre: string,
  distance: number,
  denivele: number,
  nomCourse: string,
  date: Date,
  sportId: number,
};


export function mapCourse(dto: CourseDto): Course {
  return {
    id: dto.ID,
    titre: dto.TITRE,
    distance: dto.DISTANCE,
    denivele: dto.DENIVELE,
    nomCourse: dto.NOM_COURSE,
    date: new Date(dto.DATE),
    sportId: dto.SPORT_ID
  };
}


export function courseToDto(course: Course): CourseDto {
  return {
    ID: course.id,
    TITRE: course.titre,
    DISTANCE: course.distance,
    DENIVELE: course.denivele,
    NOM_COURSE: course.nomCourse,
    DATE: course.date,
    SPORT_ID: course.sportId,
  };
}
