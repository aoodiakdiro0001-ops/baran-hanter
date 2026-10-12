import { useI18n } from "../context/I18nContext.jsx";

export default function About() {
  const { t } = useI18n();
  return (
    <section className="page-shell">
      <h1>{t("page_about")}</h1>
      <p>{t("about_body")}</p>
      <p className="muted">{t("footer_affiliate")}</p>
    </section>
  );
}
