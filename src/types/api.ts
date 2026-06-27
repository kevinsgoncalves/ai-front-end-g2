export interface ProblemDetail {
  status: number;
  title: string;
  detail: string;
  type?: string;
  timestamp?: string;
}

export interface HealthStatus {
  status: 'UP' | 'DOWN';
  timestamp: string;
}
