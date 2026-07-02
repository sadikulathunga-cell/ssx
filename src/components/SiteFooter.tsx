import { Link } from "@tanstack/react-router";
import { Camera } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-12 md:flex-row md:items-center">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-lg">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Camera className="h-4 w-4" />
            </span>
            Aperture
          </Link>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            A home for photographers and the people who want their stories told
            through light.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <Link to="/photographers" className="hover:text-foreground">
            Find a photographer
          </Link>
          <Link to="/dashboard" className="hover:text-foreground">
            Join as a photographer
          </Link>

          <a href="mailto:hello@aperture.studio" className="hover:text-foreground">
            hello@aperture.studio
          </a>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Aperture Studio. All rights reserved.
      </div>
    </footer>
  );
}
