interface HealthIndicatorProps {
  status: 'healthy' | 'unhealthy' | 'loading';
}

function HealthIndicator({ status }: HealthIndicatorProps) {
  return (
    <div
      className="health"
      role="status"
      aria-label={
        status === 'healthy'
          ? 'API ativa'
          : status === 'unhealthy'
            ? 'API indisponível'
            : 'Verificando...'
      }
    >
      <span className={`health__dot health__dot--${status}`} />
      <span className="health__text">
        {status === 'healthy'
          ? 'API ativa'
          : status === 'unhealthy'
            ? 'API indisponível'
            : 'Verificando...'}
      </span>
    </div>
  );
}

export default HealthIndicator;
