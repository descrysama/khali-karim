import { setRequestLocale } from "next-intl/server";
import { ListingDetail } from "@/components/listing-detail";

export default async function AnnoncePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <ListingDetail id={id} />;
}
