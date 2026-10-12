import ProductCard from "./ProductCard.jsx";
import { useI18n } from "../context/I18nContext.jsx";

export default function ProductGrid({ products, loading, error }) {
  const { t } = useI18n();
  if (loading) return <p className="muted">{t("loading")}</p>;
  if (error) return <p className="muted">{t("error")}</p>;
  if (!products?.length) return <p className="muted">{t("empty")}</p>;
  return (
    <div className="grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
