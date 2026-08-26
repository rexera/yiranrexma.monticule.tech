import { LocaleRedirect } from "@/components/locale-redirect";

export default function RootRedirectPage() {
  // Used by static-export deployments where request-time locale redirects are
  // unavailable. Vercel-style deployments normally rely on proxy.ts instead.
  return <LocaleRedirect />;
}
