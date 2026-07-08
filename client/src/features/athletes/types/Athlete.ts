export type Athlete = {
  id: string;
  name: string;
  age: number;
  height: number;
  createdAt: Date;
  updatedAt: Date;
};

export type NewAthlete = Omit<Athlete, "id">;

export type AthleteListResponse = {
  athleteList: Athlete[];
  nextCursor: string | null;
};

export interface GetAthletePageParams {
  cursor: string | null;
}
