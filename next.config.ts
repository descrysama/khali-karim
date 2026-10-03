import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

// En prod, URL publique de l'API (ex. https://api.altayssir.com) d'où
// viennent les photos.
const publicApi = process.env.PUBLIC_API_URL
  ? new URL(process.env.PUBLIC_API_URL)
  : null;

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      // Photos servies par le backend Altayssir (/uploads/*)
      {
        protocol: "http",
        hostname: "localhost",
        port: "4001",
      },
      ...(publicApi
        ? [
            {
              protocol: publicApi.protocol.replace(":", "") as "http" | "https",
              hostname: publicApi.hostname,
              pathname: "/uploads/**",
            },
          ]
        : []),
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
