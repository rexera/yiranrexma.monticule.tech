import Image from "next/image";

import {
  DouyinIcon,
  ExternalLinkIcon,
  GitHubIcon,
  InstagramIcon,
  MailIcon,
  QrCodeIcon,
  WeChatIcon,
  XLogoIcon,
  XiaohongshuIcon
} from "@/components/icons";
import type { LocaleProfile } from "@/lib/content-types";

type Locale = "en" | "zh";

type SideProfileCardProps = {
  profile: LocaleProfile;
  locale?: Locale;
  avatarSrc?: string;
  contactHref?: string;
  contactLabel?: string;
};

/** Icons for plain external links, keyed by label. */
const PLATFORM_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  X: XLogoIcon,
  GitHub: GitHubIcon,
  Instagram: InstagramIcon
};

/** Icons for QR platforms, keyed by the QR image path — stable across
    locales (WeChat OA / 微信公众号 etc. share one image). */
const QR_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "/images/wechat_oa.JPG": WeChatIcon,
  "/images/xiaohongshu.JPG": XiaohongshuIcon,
  "/images/douyin.JPG": DouyinIcon
};

/** Native pixel sizes of the QR images, so next/image can reserve layout. */
const QR_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "/images/wechat_oa.JPG": { width: 430, height: 430 },
  "/images/xiaohongshu.JPG": { width: 987, height: 1347 },
  "/images/douyin.JPG": { width: 1125, height: 1680 }
};

const ROW_CLASSES =
  "group relative flex w-full items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-slate-600 transition hover:border-brand/60 hover:bg-brand/5 hover:text-brand dark:border-slate-700 dark:text-slate-300 dark:hover:border-brand/70 dark:hover:bg-brand/10 dark:hover:text-brand";

/**
 * Profile summary card. Full-width banner on mobile; on desktop it fills the
 * shell's fluid sidebar column and stretches with the grid row, with the
 * contact/social block pinned to the bottom. Email comes first, then X,
 * GitHub, Instagram (plain links), then the Chinese platforms, whose rows
 * reveal a QR-code popover on hover/focus instead of navigating.
 */
export function SideProfileCard({ profile, locale = "en", avatarSrc = "/images/profile.jpg", contactHref, contactLabel }: SideProfileCardProps) {
  const imageSrc = profile.avatar ?? avatarSrc;
  return (
    <aside className="relative z-10 flex w-full flex-col gap-6 self-start rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_30px_60px_-45px_rgba(15,23,42,0.4)] dark:border-slate-800 dark:bg-slate-900 lg:self-stretch print:hidden">
      <div className="flex flex-col gap-4">
        <div className="relative h-40 w-40 self-center overflow-hidden rounded-full border border-slate-200 dark:border-slate-700">
          <Image
            src={imageSrc}
            alt={profile.name}
            fill
            priority
            className="object-cover object-top"
            sizes="(min-width: 1024px) 200px, 160px"
          />
        </div>
        <div className="w-full space-y-2 text-center">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-50">{profile.name}</h1>
          {profile.nativeName ? <p className="text-sm text-slate-600 dark:text-slate-300">{profile.nativeName}</p> : null}
        </div>
      </div>
      <div className="w-full space-y-2 text-sm text-slate-600 dark:text-slate-300">
        <p className="font-medium text-slate-700 dark:text-slate-200">{profile.affiliation}</p>
        <p className="text-slate-600 dark:text-slate-300">{profile.title}</p>
        <p className="text-slate-600 dark:text-slate-300">{profile.location}</p>
      </div>
      <div className="mt-auto w-full space-y-2 text-sm">
        {contactHref ? (
          <a href={contactHref} className={ROW_CLASSES}>
            <span className="flex min-w-0 items-center gap-2.5">
              <MailIcon aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="truncate text-sm font-medium">{contactLabel ?? "Email"}</span>
            </span>
          </a>
        ) : null}
        {profile.social.map((link) => {
          if (link.qr) {
            const Icon = QR_ICONS[link.qr] ?? QrCodeIcon;
            const dims = QR_DIMENSIONS[link.qr] ?? { width: 430, height: 430 };
            return (
              <div key={link.label} tabIndex={0} className={ROW_CLASSES}>
                <span className="flex items-center gap-2.5">
                  <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                  <span className="text-sm font-medium">{link.label}</span>
                </span>
                <QrCodeIcon aria-hidden="true" className="h-4 w-4 shrink-0 opacity-60" />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-full right-0 z-50 mb-2 hidden w-44 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_60px_-20px_rgba(15,23,42,0.45)] group-hover:block group-focus-within:block dark:border-slate-700 dark:bg-slate-900"
                >
                  <Image
                    src={link.qr}
                    alt=""
                    width={dims.width}
                    height={dims.height}
                    className="h-auto w-full rounded-lg"
                  />
                </span>
              </div>
            );
          }
          const Icon = PLATFORM_ICONS[link.label] ?? ExternalLinkIcon;
          return (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className={ROW_CLASSES}
            >
              <span className="flex items-center gap-2.5">
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium">{link.label}</span>
              </span>
              <ExternalLinkIcon
                aria-hidden="true"
                className="h-4 w-4 shrink-0 opacity-70 transition group-hover:translate-x-0.5 group-hover:opacity-100"
              />
            </a>
          );
        })}
      </div>
    </aside>
  );
}
