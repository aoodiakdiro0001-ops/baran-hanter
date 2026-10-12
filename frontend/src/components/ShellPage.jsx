import { useI18n } from "../context/I18nContext.jsx";

export default function ShellPage({ titleKey }) {
  const { t } = useI18n();
  return (
    <section className="page-shell">
      <h1>{t(titleKey)}</h1>
      <p className="muted">{t("shell_note")}</p>
    </section>
  );
}
