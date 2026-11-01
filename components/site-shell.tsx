"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import type { LocaleProfile } from "@/lib/content-types";
import type { NavItem } from "@/types/navigation";

type Locale = "en" | "zh";

type SiteShellProps = {
  children: React.ReactNode;
  navItems: NavItem[];
  profile: LocaleProfile;
  locale: Locale;
  email?: string;
  lastUpdated?: string;
};

const CONTOUR_OUTLINES = [
  "M402 55C540 45 692 150 727 292C762 434 683 607 544 694C405 781 221 739 118 621C15 503 37 322 129 196C221 70 264 65 402 55Z",
  "M409 126C520 112 627 197 658 309C689 421 625 544 520 613C415 682 273 654 187 561C101 468 111 340 179 238C247 136 298 140 409 126Z",
  "M407 196C495 183 575 246 599 331C623 416 574 505 493 555C412 605 305 584 241 514C177 444 181 355 231 278C281 201 319 209 407 196Z",
  "M405 264C468 255 524 298 540 358C556 418 522 478 465 511C408 544 337 530 294 483C251 436 253 377 286 326C319 275 342 273 405 264Z",
  "M404 319C446 314 481 342 491 380C501 418 480 456 443 477C406 498 359 489 331 460C303 431 304 392 325 359C346 326 362 324 404 319Z",
  "M403 361C426 359 445 374 450 394C455 414 443 435 423 446C403 457 378 452 363 437C348 422 349 402 360 385C371 368 380 363 403 361Z"
];

function ContourField({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 800 800" fill="none" aria-hidden="true">
      <g fill="currentColor" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke">
        {CONTOUR_OUTLINES.map((outline, index) => (
          <path
            key={outline}
            className={`contour-band contour-band-${index + 1}`}
            fillRule="evenodd"
            d={index < CONTOUR_OUTLINES.length - 1 ? `${outline} ${CONTOUR_OUTLINES[index + 1]}` : outline}
          />
        ))}
      </g>
    </svg>
  );
}

export function SiteShell({ children, navItems, profile, locale, email, lastUpdated }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="site-atmosphere" aria-hidden="true">
        <ContourField className="contour-field contour-field-a" />
        <ContourField className="contour-field contour-field-b" />
      </div>
      <SiteHeader navItems={navItems} currentLocale={locale} />
      <main className="relative z-10 flex-1">{children}</main>
      <SiteFooter profile={profile} email={email} lastUpdated={lastUpdated} locale={locale} />
    </div>
  );
}
