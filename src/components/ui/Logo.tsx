import logoDark from "@/assets/logos/logo-dark.svg";
import logoLight from "@/assets/logos/logo-light.svg";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";

interface LogoProps {
  className?: string;
}

export function Logo({
  className = "",
}: LogoProps) {
  const resolvedTheme = useResolvedTheme();

  const logo =
    resolvedTheme === "dark"
      ? logoDark
      : logoLight;

  return (
    <img
      src={logo}
      alt="FitNess"
      className={className}
    />
  );
}
