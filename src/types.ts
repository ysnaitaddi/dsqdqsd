export interface Task {
  id: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
  completed?: boolean;
}
