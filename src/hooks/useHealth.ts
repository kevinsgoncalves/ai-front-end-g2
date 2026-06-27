import { useState, useEffect } from 'react';
import { getHealthStatus } from '../services/healthService';

export type HealthState = 'loading' | 'healthy' | 'unhealthy';

const POLL_INTERVAL = 30000;

export function useHealth(): HealthState {
  const [state, setState] = useState<HealthState>('loading');

  useEffect(() => {
    let active = true;

    const check = async () => {
      try {
        const data = await getHealthStatus();
        if (active) {
          setState(data.status === 'UP' ? 'healthy' : 'unhealthy');
        }
      } catch {
        if (active) {
          setState('unhealthy');
        }
      }
    };

    check();
    const id = setInterval(check, POLL_INTERVAL);

    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  return state;
}
