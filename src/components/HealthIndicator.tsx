interface HealthIndicatorProps {
  status: 'loading' | 'healthy' | 'unhealthy';
}

const labels: Record<HealthIndicatorProps['status'], string> = {
  loading: 'Verificando...',
  healthy: 'API ativa',
  unhealthy: 'API indisponível',
};

function HealthIndicator({ status }: HealthIndicatorProps) {
  return (
    <div className="health" role="status">
      <span className={`health__dot health__dot--${status}`} />
      <span className="health__text">{labels[status]}</span>
    </div>
  );
}

export default HealthIndicator;
