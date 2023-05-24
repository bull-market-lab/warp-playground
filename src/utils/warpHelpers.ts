export type Job = {
  id: string;
  name: string;
};

export const constructJobUrl = (jobId: string) =>
  `https://beta.warp.money/#/jobs/${jobId}`;
