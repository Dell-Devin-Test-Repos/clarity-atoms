import { h, render } from 'preact';

import { installThemes } from '../src/theme';

import { App } from './app/App';
import { restoreTheme } from './components/ThemeSwitcher';


document.addEventListener('DOMContentLoaded', () => {

  const rootElm = document.createElement('div');

  document.body.appendChild(rootElm);

  // Emit tokens for every theme, then apply the visitor's preference.
  installThemes();
  restoreTheme();

  // Render Site App
  render(h(App, null), rootElm);

}, false);
