function UploadZone() {
  return (
    <div
      className="upload-zone"
      role="button"
      tabIndex={0}
      aria-disabled="true"
      aria-label="Área de upload de arquivos"
    >
      <div className="upload-zone__content">
        <p className="upload-zone__text">
          Arraste arquivos .txt ou .pdf
          <br />
          ou clique para selecionar
        </p>
        <p className="upload-zone__limit">Limite máximo: 10 MB</p>
      </div>
    </div>
  );
}

export default UploadZone;
