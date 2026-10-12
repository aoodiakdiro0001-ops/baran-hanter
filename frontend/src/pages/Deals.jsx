import { useEffect, useState } from "react";
import { api } from "../api.js";
import ProductGrid from "../components/ProductGrid.jsx";
import { useI18n } from "../context/I18nContext.jsx";

export default function Deals() {
  const { t } = useI18n();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let live = true;
    api("/api/deals")
      .then((d) => live && setProducts(d.products || []))
      .catch(() => live && setError(true))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, []);

  return (
    <div>
      <h1>{t("page_deals")}</h1>
      <ProductGrid products={products} loading={loading} error={error} />
    </div>
  );
}
