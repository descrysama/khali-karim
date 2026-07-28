import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Toutes les routes sauf api, les internes Next et les fichiers statiques.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
