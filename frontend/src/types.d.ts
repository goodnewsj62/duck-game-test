type RoundResp = {
  id: string;
  startDate: string;
  endDate: string;
  coolingDuration: number;
  roundDuration: number;
};

type RoundStat = {
  score: number;
  taps: number;
  higestest: number;
  username: string;
  totalScore?: number;
};
