import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AKIRA // 1F Input Lab",
  description: "謠占・蠑ｾ閻ｿ・医い繧ｭ繝ｩ繧ｹ繝壹す繝｣繝ｫ・峨・1繝輔Ξ繝ｼ繝蜈･蜉帙ｒ蜿ｯ隕門喧縺吶ｋ邱ｴ鄙偵ヤ繝ｼ繝ｫ",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}

