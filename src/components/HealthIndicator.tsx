function HealthIndicator() {
  return (
    <div className="health" role="status" aria-label="API status: Verificando...">
      <span className="health__dot health__dot--loading" />
      <span className="health__text">Verificando...</span>
    </div>
  );
}

export default HealthIndicator;
