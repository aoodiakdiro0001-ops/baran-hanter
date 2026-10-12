import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useI18n } from "../context/I18nContext.jsx";
import { money } from "../api.js";

export default function ProductCard({ product }) {
  const { t } = useI18n();
  const { add } = useCart();
  const [flash, setFlash] = useState(false);

  const onAdd = (e) => {
    e.preventDefault();
    add(product, 1);
    setFlash(true);
    setTimeout(() => setFlash(false), 1200);
  };

  return (
    <article className="card">
      <Link to={`/p/${product.id}`} className="card-media">
        {product.deal ? (
          <span className="deal-badge">
            {t("save")} {product.discount}%
          </span>
        ) : null}
        <img src={product.image} alt={product.title} width="640" height="640" loading="lazy" />
      </Link>
      <div className="card-body">
        <p className="brand">{product.brand}</p>
        <Link to={`/p/${product.id}`}>
          <h3>{product.title}</h3>
        </Link>
        <p className="rating">
          {product.rating} · {product.reviews} {t("reviews")}
        </p>
        <p className="price-row">
          <strong>{money(product.price)}</strong>
          {product.compareAt > product.price ? (
            <s>{money(product.compareAt)}</s>
          ) : null}
        </p>
        <button className="primary-btn full" type="button" onClick={onAdd}>
          {flash ? t("added") : t("add_cart")}
        </button>
      </div>
    </article>
  );
}
