import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";
import { ResultsView } from "@/components/results-view";

export default async function RecherchePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <Suspense fallback={null}>
      <ResultsView />
    </Suspense>
  );
}
