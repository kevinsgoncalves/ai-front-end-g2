import { useEffect, useState } from 'react';
import type { HealthStatus } from '../types';
import api from '../services/api';

type HealthState = 'loading' | 'healthy' | 'unhealthy';

function HealthIndicator() {
  const [state, setState] = useState<HealthState>('loading');

  useEffect(() => {
    let active = true;

    api
      .get<HealthStatus>('/health')
      .then(({ data }) => {
        if (active) {
          setState(data.status === 'UP' ? 'healthy' : 'unhealthy');
        }
      })
      .catch(() => {
        if (active) {
          setState('unhealthy');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const label = {
    loading: 'Verificando...',
    healthy: 'API online',
    unhealthy: 'API offline',
  }[state];

  return (
    <div className="health" role="status">
      <span className={`health__dot health__dot--${state}`} />
      <span className="health__text">{label}</span>
    </div>
  );
}

export default HealthIndicator;
