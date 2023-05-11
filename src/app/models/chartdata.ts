export interface Chartdata {
  datasets: Pointdata[]
}

interface Pointdata {
  data: number[];
  fill: boolean;
  label: string;
  pointRadius: number;
}
