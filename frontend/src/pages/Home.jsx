import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api.js";
import ProductGrid from "../components/ProductGrid.jsx";
import { useI18n } from "../context/I18nContext.jsx";

export default function Home() {
  const { t } = useI18n();
  const [featured, setFeatured] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let live = true;
    Promise.all([
      api("/api/products?featured=1&limit=8"),
      api("/api/deals"),
    ])
      .then(([f, d]) => {
        if (!live) return;
        setFeatured(f.products || []);
        setDeals((d.products || []).slice(0, 8));
      })
      .catch(() => live && setError(true))
      .finally(() => live && setLoading(false));
    return () => {
      live = false;
    };
  }, []);

  return (
    <div>
      <section className="hero">
        <p className="kicker">{t("hero_kicker")}</p>
        <h1>{t("brand")}</h1>
        <p className="lead">{t("tagline")}</p>
        <div className="hero-actions">
          <Link className="primary-btn" to="/deals">
            {t("hero_cta")}
          </Link>
          <Link className="ghost-btn" to="/c/electronics">
            {t("hero_cta2")}
          </Link>
        </div>
        <div className="trust">
          <span>{t("trust_1")}</span>
          <span>{t("trust_2")}</span>
          <span>{t("trust_3")}</span>
        </div>
      </section>
      <section className="block">
        <div className="block-head">
          <h2>{t("featured")}</h2>
        </div>
        <ProductGrid products={featured} loading={loading} error={error} />
      </section>
      <section className="block">
        <div className="block-head">
          <h2>{t("shop_deals")}</h2>
          <Link to="/deals">{t("view_all")}</Link>
        </div>
        <ProductGrid products={deals} loading={loading} error={error} />
      </section>
    </div>
  );
}
