export const shouldFetchPreviousPeriod = (timePeriod: string): boolean =>
  timePeriod !== "allTime" && timePeriod !== "custom";
