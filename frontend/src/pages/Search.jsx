import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import ProductGrid from "../components/ProductGrid.jsx";
import { useI18n } from "../context/I18nContext.jsx";

export default function Search() {
  const { t } = useI18n();
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [data, setData] = useState({ products: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let live = true;
    setLoading(true);
    const url = q
      ? `/api/products?q=${encodeURIComponent(q)}&limit=24`
      : "/api/products?limit=24";
    api(url)
      .then((d) => live && setData(d))
      .catch(() => live && setError(true))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [q]);

  return (
    <div>
      <h1>{t("page_search")}</h1>
      <p className="muted">
        {q ? `"${q}" · ` : null}
        {data.total} {t("results")}
      </p>
      <ProductGrid products={data.products} loading={loading} error={error} />
    </div>
  );
}
