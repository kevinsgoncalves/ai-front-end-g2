export interface ProblemDetail {
  status: number;
  title: string;
  detail: string;
}

export interface HealthStatus {
  status: 'UP' | 'DOWN';
  timestamp: string;
}
