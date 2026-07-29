import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "繧｢繧ｭ繝ｩ繧ｹ繝壹す繝｣繝ｫ邱ｴ鄙呈ｩ滂ｽ懊い繧ｱ繧ｳ繝ｳ蜈･蜉帙ヨ繝ｬ繝ｼ繝翫・",
  description: "PC縺ｫ繧｢繧ｱ繧ｳ繝ｳ繧呈磁邯壹＠縲∵匕縺ｮ謠占・蠑ｾ閻ｿ繧・繝輔Ξ繝ｼ繝蜊倅ｽ阪〒邱ｴ鄙偵〒縺阪ｋ蟆ら畑繝・・繝ｫ",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}

