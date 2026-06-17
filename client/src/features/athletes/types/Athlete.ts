export type Athlete = {
  id: string;
  name: string;
  age: number;
  height: number;
};

export type NewAthlete = Omit<Athlete, "id">;

export type AthleteListResponse = {
  athleteList: Athlete[];
  nextCursor: string | null;
};
