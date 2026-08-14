import Color from 'color';

import { Ramp, RampStep, rampSteps } from './tokens';


/**
 * Amount of white (negative) or black (positive) mixed into the base colour
 * for each ramp step. `500` is the untouched base colour.
 */
const rampMix: Record<RampStep, number> = {
  50: -0.92,
  100: -0.82,
  200: -0.62,
  300: -0.40,
  400: -0.20,
  500: 0,
  600: 0.16,
  700: 0.32,
  800: 0.48,
  900: 0.64
};


function toHex(color: Color): string {
  return color.hex().toUpperCase();
}


/**
 * Derive a 10 step ramp from a single base colour. This is the *only* place
 * shades are computed - components and themes consume the resulting steps
 * instead of calling `Color()` ad hoc.
 */
export function makeRamp(base: string): Ramp {

  const color = Color(base);

  const white = Color('#FFFFFF');
  const black = Color('#000000');

  const entries = rampSteps.map((step) => {
    const mix = rampMix[step];

    const value = mix === 0
      ? color
      : (mix < 0 ? color.mix(white, -mix) : color.mix(black, mix));

    return [step, toHex(value)] as const;
  });

  return Object.fromEntries(entries) as Ramp;
}


/** Apply an alpha channel to a colour, returning an `rgba()` string. */
export function alpha(base: string, value: number): string {
  return Color(base).alpha(value).string();
}


/** Relative luminance as defined by WCAG 2.1. */
export function luminance(base: string): number {

  const [r, g, b] = Color(base).rgb().array().map((x) => {
    const channel = x / 255;

    return channel <= 0.03928
      ? channel / 12.92
      : Math.pow((channel + 0.055) / 1.055, 2.4);
  });

  return (0.2126 * r) + (0.7152 * g) + (0.0722 * b);
}


/**
 * WCAG 2.1 contrast ratio between two opaque colours.
 * Returns a value between 1 and 21.
 */
export function contrast(foreground: string, background: string): number {

  const a = luminance(foreground);
  const b = luminance(background);

  const lighter = Math.max(a, b);
  const darker = Math.min(a, b);

  return (lighter + 0.05) / (darker + 0.05);
}


/**
 * Pick whichever of `light` / `dark` has the better contrast against `base`.
 * Used to derive the text colour that sits on interactive fills.
 */
export function readableOn(base: string, light = '#FFFFFF', dark = '#14161A'): string {
  return contrast(light, base) >= contrast(dark, base) ? light : dark;
}
