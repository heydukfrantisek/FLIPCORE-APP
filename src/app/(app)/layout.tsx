import { Kostra } from "@/components/kostra";

export default function Layout({ children }: LayoutProps<"/">) {
  return <Kostra>{children}</Kostra>;
}
