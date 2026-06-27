import { useCallback } from 'react';
import { isAllowedType, isAllowedExtension, isUnderMaxSize } from '../utils/validators';
import type { ValidationResult } from '../types/upload';

export function useFileValidation() {
  const validateFile = useCallback((file: File): ValidationResult => {
    if (!isAllowedType(file)) {
      return {
        valid: false,
        error: 'Tipo de arquivo não permitido. Apenas .txt e .pdf.',
      };
    }

    if (!isAllowedExtension(file)) {
      return {
        valid: false,
        error: 'Extensão não permitida. Apenas .txt e .pdf.',
      };
    }

    if (!isUnderMaxSize(file)) {
      return {
        valid: false,
        error: 'Arquivo excede o limite máximo de 10 MB.',
      };
    }

    return { valid: true };
  }, []);

  return { validateFile };
}
