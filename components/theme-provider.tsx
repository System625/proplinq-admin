'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes';

export function ThemeProvider({ children, attribute = 'class', ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute={attribute as 'class' | 'data-theme'} {...props}>
      {children}
    </NextThemesProvider>
  );
}