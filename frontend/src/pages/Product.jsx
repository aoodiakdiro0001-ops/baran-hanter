import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, money } from "../api.js";
import ProductGrid from "../components/ProductGrid.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useI18n } from "../context/I18nContext.jsx";

export default function Product() {
  const { id } = useParams();
  const { t } = useI18n();
  const { add } = useCart();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let live = true;
    setData(null);
    api(`/api/products/${id}`)
      .then((d) => live && setData(d))
      .catch(() => live && setError(true));
    return () => {
      live = false;
    };
  }, [id]);

  if (error) return <p className="muted">{t("error")}</p>;
  if (!data) return <p className="muted">{t("loading")}</p>;
  const p = data.product;

  const onAdd = () => {
    add(p, 1);
    setFlash(true);
    setTimeout(() => setFlash(false), 1200);
  };

  return (
    <div>
      <article className="pdp">
        <div className="pdp-media">
          <img src={p.image} alt={p.title} width="640" height="640" />
        </div>
        <div className="pdp-info">
          <p className="brand">{p.brand}</p>
          <h1>{p.title}</h1>
          <p className="rating">
            {p.rating} · {p.reviews} {t("reviews")}
          </p>
          <p className="price-row big">
            <strong>{money(p.price)}</strong>
            {p.compareAt > p.price ? <s>{money(p.compareAt)}</s> : null}
            {p.discount ? (
              <span className="deal-badge static">
                {t("save")} {p.discount}%
              </span>
            ) : null}
          </p>
          <p>{p.description}</p>
          <p className="muted">
            {p.stockHint === "low_stock" ? t("low_stock") : t("in_stock")}
          </p>
          <div className="hero-actions">
            <button className="primary-btn" type="button" onClick={onAdd}>
              {flash ? t("added") : t("add_cart")}
            </button>
            <a className="ghost-btn" href={p.amazonUrl} target="_blank" rel="noreferrer">
              {t("buy_amazon")}
            </a>
          </div>
          <Link className="muted" to={`/c/${p.categorySlug}`}>
            {t(`cat_${p.categorySlug}`)}
          </Link>
        </div>
      </article>
      <section className="block">
        <h2>{t("related")}</h2>
        <ProductGrid products={data.related} />
      </section>
    </div>
  );
}
