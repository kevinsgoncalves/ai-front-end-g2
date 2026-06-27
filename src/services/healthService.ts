import type { HealthStatus } from '../types';
import api from './api';

export async function getHealthStatus(): Promise<HealthStatus> {
  const { data } = await api.get<HealthStatus>('/health');
  return data;
}
