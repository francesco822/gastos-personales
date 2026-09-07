import { Metadata } from "next";

interface MetadataProps extends Metadata {
  title: string;
  description?: string;
}

const NOMBRE = "Gastos · MyWorkIn";
const DESCRIPCION = "Control de gastos personales de Francesco.";
const URL = "https://franz-gastos.vercel.app";

export async function generateMetadata({
  title,
  description,
}: MetadataProps): Promise<Metadata> {
  return {
    title: title || NOMBRE,
    description: description || DESCRIPCION,
    manifest: "/manifest.json",
    openGraph: {
      type: "website",
      url: URL,
      title: title || NOMBRE,
      description: DESCRIPCION,
      images: [{ url: `${URL}/logo.png`, width: 512, height: 512, alt: "MyWorkIn" }],
    },
    robots: "noindex, nofollow",
    icons: [{ rel: "icon", href: "/favicon.ico", sizes: "32x32", url: "/favicon.ico" }],
    appleWebApp: {
      capable: true,
      title: "Gastos",
      statusBarStyle: "black-translucent",
    },
  };
}
