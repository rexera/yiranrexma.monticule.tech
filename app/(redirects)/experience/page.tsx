import { LocaleRedirect } from "@/components/locale-redirect";

/** The Story page used to be served from /experience; this keeps the old
 *  entry path pointing at it. */
export default function LegacyExperienceRedirectPage() {
  return <LocaleRedirect pathAfterLocale="/story" title="Redirecting to story..." />;
}
