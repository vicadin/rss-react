import { useTheme } from "./ThemeContext";

const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={`theme-switcher ${theme}`}>
      <label>
        Theme:
        <select value={theme} onChange={toggleTheme}>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </label>
    </div>
  );
};

export default ThemeSwitcher;
