import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { api } from "../api.js";
import ProductGrid from "../components/ProductGrid.jsx";
import { useI18n } from "../context/I18nContext.jsx";

export default function Category() {
  const { slug } = useParams();
  const { t } = useI18n();
  const [params, setParams] = useSearchParams();
  const sort = params.get("sort") || "featured";
  const [data, setData] = useState({ products: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let live = true;
    setLoading(true);
    api(`/api/products?category=${encodeURIComponent(slug)}&sort=${sort}&limit=24`)
      .then((d) => live && setData(d))
      .catch(() => live && setError(true))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, [slug, sort]);

  return (
    <div>
      <div className="block-head">
        <h1>{t(`cat_${slug}`)}</h1>
        <label>
          {t("sort")}
          <select
            className="lang-select"
            value={sort}
            onChange={(e) => setParams({ sort: e.target.value })}
          >
            <option value="featured">{t("sort_featured")}</option>
            <option value="price_asc">{t("sort_price_asc")}</option>
            <option value="price_desc">{t("sort_price_desc")}</option>
            <option value="rating">{t("sort_rating")}</option>
          </select>
        </label>
      </div>
      <p className="muted">
        {data.total} {t("results")}
      </p>
      <ProductGrid products={data.products} loading={loading} error={error} />
    </div>
  );
}
