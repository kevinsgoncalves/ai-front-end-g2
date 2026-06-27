interface UploadZoneProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
  error: string | null;
  isDisabled: boolean;
}

function UploadZone({ isUploading, error, isDisabled }: UploadZoneProps) {
  return (
    <div
      className="upload-zone"
      role="button"
      tabIndex={isDisabled ? -1 : 0}
      aria-disabled={isDisabled || isUploading}
      aria-label="Área de upload de arquivos"
    >
      <div className="upload-zone__content">
        {error ? (
          <p className="upload-zone__error">{error}</p>
        ) : isUploading ? (
          <p className="upload-zone__text">Enviando arquivo...</p>
        ) : (
          <>
            <p className="upload-zone__text">
              Arraste arquivos .txt ou .pdf
              <br />
              ou clique para selecionar
            </p>
            <p className="upload-zone__limit">Limite máximo: 10 MB</p>
          </>
        )}
      </div>
    </div>
  );
}

export default UploadZone;
