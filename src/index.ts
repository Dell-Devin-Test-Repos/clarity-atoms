export { setupTheme } from './Theme';
export type { Theme } from './Theme';
export * from './theme';


export function initialize() {
  // This function is required to make TS happy
  // when this library is published as NPM module.
  // This modules helps properly setup "typings" property in package.json
}
