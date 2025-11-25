import { useTheme } from './ThemeProvider';
import ThemeIcon from './ThemeIcon';

export default function ThemeSwitcher() {
  const { theme, setTheme, mounted } = useTheme();

  if (!mounted) {
    // Return a placeholder to prevent layout shift
    return (
      <button
        type="button"
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          padding: '4px 8px',
          fontSize: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-label="Theme switcher"
      >
        <ThemeIcon theme="system" />
      </button>
    );
  }

  const cycleTheme = () => {
    if (theme === 'system') {
      // When on system, switch to the opposite of what system is currently showing
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemIsDark ? 'light' : 'dark');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('system');
    }
  };

  const getLabel = () => {
    if (theme === 'system') return 'System theme';
    if (theme === 'light') return 'Light theme';
    return 'Dark theme';
  };

  return (
    <button
      type="button"
      onClick={cycleTheme}
      aria-label={getLabel()}
      title={getLabel()}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
    >
      <ThemeIcon theme={theme} />
    </button>
  );
}






