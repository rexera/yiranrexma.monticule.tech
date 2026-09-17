import type { ImgHTMLAttributes } from "react";

/** Alt text at least this long is treated as a caption written for the
 *  reader. Shorter alts (badge images, "image", decorative labels) stay
 *  plain images so existing posts and publication badges are unaffected. */
const CAPTION_MIN_LENGTH = 40;

type FigureProps = ImgHTMLAttributes<HTMLImageElement>;

/**
 * Markdown images render through this component: when the alt text is a real
 * caption it is shown under the figure, the way it reads in the print or
 * WeChat version of an essay. The alt attribute stays on the image for
 * assistive tech.
 *
 * Caption colour and size come from the article's prose caption token; the
 * element just centres it under the image.
 *
 * `next/image` is not used here: markdown images carry no intrinsic
 * dimensions, and the site runs with `images.unoptimized` for the static
 * export, so the optimizer adds nothing.
 */
export function Figure({ alt, ...props }: FigureProps) {
  const caption = typeof alt === "string" ? alt.trim() : "";
  if (caption.length < CAPTION_MIN_LENGTH) {
    // eslint-disable-next-line @next/next/no-img-element -- see above
    return <img alt={alt} {...props} />;
  }
  return (
    <figure className="my-7">
      {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
      <img alt={alt} {...props} />
      <figcaption className="mx-auto mt-2.5 max-w-3xl text-center text-[0.8125rem] leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}
