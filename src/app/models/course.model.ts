import {Sport} from './sports.model';

export interface CourseDto {
  ID: number,
  TITRE: string,
  DISTANCE: number,
  DENIVELE: number,
  NOM_COURSE: string,
  DATE: Date,
  TIME: number,
  FINISHED: boolean,
  SPORT_ID: number,
  USER_ID: number,
  GPX_FILE: string,
};


export interface Course {
  id: number,
  titre: string,
  distance: number,
  denivele: number,
  nomCourse: string,
  date: Date,
  time: number,
  finished: boolean,
  sportId: number,
  userId: number,
  gpxFile: string
};


export function mapCourse(dto: CourseDto): Course {
  return {
    id: dto.ID,
    titre: dto.TITRE,
    distance: dto.DISTANCE,
    denivele: dto.DENIVELE,
    nomCourse: dto.NOM_COURSE,
    time: dto.TIME,
    finished: dto.FINISHED,
    date: new Date(dto.DATE),
    sportId: dto.SPORT_ID,
    userId: dto.USER_ID,
    gpxFile: dto.GPX_FILE
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
    TIME: course.time,
    FINISHED: course.finished,
    SPORT_ID: course.sportId,
    USER_ID: course.userId,
    GPX_FILE: course.gpxFile,
  };
}
