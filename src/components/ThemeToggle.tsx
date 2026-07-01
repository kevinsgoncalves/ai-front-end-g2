import type { Theme } from '../hooks/useTheme';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

const ICONS: Record<Theme, string> = {
  spring: '\u{1F338}',
  summer: '\u{2600}\u{FE0F}',
  autumn: '\u{1F342}',
  winter: '\u{2744}\u{FE0F}',
};

const LABELS: Record<Theme, string> = {
  spring: 'Primavera',
  summer: 'Ver\u00E3o',
  autumn: 'Outono',
  winter: 'Inverno',
};

const NEXT_LABELS: Record<Theme, string> = {
  spring: 'Ver\u00E3o',
  summer: 'Outono',
  autumn: 'Inverno',
  winter: 'Primavera',
};

function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      aria-label={`Tema atual: ${LABELS[theme]}. Alternar para ${NEXT_LABELS[theme]}`}
      title={`${LABELS[theme]} \u2014 ir para ${NEXT_LABELS[theme]}`}
    >
      {ICONS[theme]}
    </button>
  );
}

export default ThemeToggle;
