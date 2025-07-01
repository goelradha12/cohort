import React, { useEffect, useState } from 'react';

const ThemeToggleButton = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleChange = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <label className="cursor-pointer flex items-center gap-2 fixed top-4 right-4 z-100">
      <span className="font-semibold">DARK</span>
      <input
        type="checkbox"
        className="toggle"
        onChange={handleChange}
        checked={theme === 'light'}
      />
      <span className="font-semibold">LIGHT</span>
    </label>
  );
};

export default ThemeToggleButton;
