import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"            // Tailwind dark mode support
      defaultTheme="system"        // system preference respected
      enableSystem
      disableTransitionOnChange    // no flicker on toggle
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}