export type Job = {
  id: string;
};

export const constructJobUrl = (jobId: string) =>
  `https://beta.warp.money/#/jobs/${jobId}`;
