// Theme switcher based on CSS variables made by Fernardo Paredes
// https://www.fdp.io/blog/2016/11/08/theming-via-css-properties/
// Polyfilling Object.entries for Safari :/
Object.entries = (object) => Object.keys(object).map(
  (key) => [ key, object[key] ]
);

const isObject = (obj) => obj === Object(obj);

const LightTheme = {
  '--bg-color': '#ffffff',
  '--text-color': '#000000',
  themeName: 'LightTheme'
};

const DarkTheme = {
  '--bg-color': '#000000',
  '--text-color': '#ffffff',
  themeName: 'DarkTheme'
};

const setCSSVariable = (key, value) => {
  document.body.style.setProperty(key, value);
};

const saveTheme = (theme) => {
  if (window.localStorage) {
    localStorage['theme'] = JSON.stringify(theme);
    localStorage['currentTheme'] = theme.themeName;
  }
};

const loadTheme = () => {
  if (window.localStorage) {
    const maybeTheme = localStorage['theme'];
    if (maybeTheme) return JSON.parse(maybeTheme);
  }
  return null;
};

const updateTheme = (theme) => {
  if (!isObject(theme)) return;
  Object.entries(theme).forEach(([key, value]) => setCSSVariable(key, value));
  const darkButton = document.getElementById('dark');
  const lightButton = document.getElementById('light');
  if (theme.themeName === LightTheme.themeName) {
    lightButton.style.display = 'none';
    darkButton.style.display = 'inline';
  } else {
    darkButton.style.display = 'none';
    lightButton.style.display = 'inline';
  }
  saveTheme(theme);
  console.log('not wack');
};

const checkForSavedTheme = () => {
  const theme = loadTheme();
  if (theme) updateTheme(theme);
};

const toggleColorMode = () => {
  const theme = loadTheme();
  const currentTheme = localStorage['currentTheme'];
  if (theme && currentTheme === LightTheme.themeName)
    updateTheme(DarkTheme);
  else
    updateTheme(LightTheme);
  console.log('wack');
};

window.onload = () => {
  checkForSavedTheme();
  if (!localStorage['currentTheme'])
    toggleColorMode();
};
