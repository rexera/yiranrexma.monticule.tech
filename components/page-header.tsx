type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
  return (
    <header className="pb-8">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="page-title mt-3">{title}</h1>
      {description ? (
        <p className="mt-4 max-w-[62ch] text-[17px] leading-[1.7] text-muted">{description}</p>
      ) : null}
    </header>
  );
}
