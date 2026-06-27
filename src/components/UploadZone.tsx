function UploadZone() {
  return (
    <div className="upload-zone" role="button" tabIndex={0}>
      <p className="upload-zone__text">
        Arraste arquivos .txt ou .pdf
        <br />
        ou clique para selecionar
      </p>
      <p className="upload-zone__limit">Limite máximo: 10 MB</p>
    </div>
  );
}

export default UploadZone;
