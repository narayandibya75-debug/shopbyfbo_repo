import { Helmet } from "react-helmet-async";

const SITE_NAME = "ShopVerse FBO";
const SITE_URL = "https://shopbyfbo.vercel.app";
const DEFAULT_IMG = "https://images.unsplash.com/photo-1765357285820-7f4f17fdcce9?q=80&w=1200";

export default function SEO({
  title,
  description,
  keywords,
  image,
  url,
  type = "website",
  noindex = false,
}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Authentic Forever Living Products India`;
  const metaDesc = description ||
    "Buy authentic Forever Living aloe vera, bee products, nutrition and skincare in India. Transparent BV/CC pricing. Free shipping above ₹999. Trusted FBO store.";
  const metaImg = image || DEFAULT_IMG;
  const metaUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const metaKeywords = keywords ||
    "forever living products india, aloe vera gel india, bee honey forever living, FBO store, forever living online shop, aloe vera juice india, forever nutrition, forever skincare";

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <meta name="keywords" content={metaKeywords} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      <link rel="canonical" href={metaUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImg} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImg} />
      <meta name="author" content={SITE_NAME} />
      <meta name="theme-color" content="#1E4E37" />
    </Helmet>
  );
}
