export interface ProblemDetail {
  type?: string;
  title: string;
  status?: number;
  detail: string;
  instance?: string;
  timestamp?: string;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
}