import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

export function NotFoundPage() {
  const t = useTranslation();
  return (
    <section className="mx-auto max-w-lg py-20 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-3xl font-semibold">{t.common.notFound}</h1>
      <p className="my-6 text-sm text-text-subtle">{t.common.notFoundHint}</p>
      <Link to="/" className="secondary-button">
        {t.common.goHome}
      </Link>
    </section>
  );
}
