import { Kostra } from "@/components/kostra";

/**
 * Vnitřní aplikace bazaru čte data z databáze, která se mění při každém výkupu,
 * zásahu a prodeji. Statické předgenerování by na obrazovkách ponechalo data
 * z okamžiku sestavení, proto se celá větev vykresluje při každém požadavku.
 * Aplikace běží za jediným provozovatelem a nepotřebuje proto žádné CDN cache.
 */
export const dynamic = "force-dynamic";

export default function Layout({ children }: LayoutProps<"/">) {
  return <Kostra>{children}</Kostra>;
}
