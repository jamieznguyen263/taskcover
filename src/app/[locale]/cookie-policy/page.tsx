import { generateLocalizedTrustStaticParams, localizedTrustMetadata, LocalizedTrustPage, type LocalizedTrustProps } from "../trust-route";

export const generateStaticParams = generateLocalizedTrustStaticParams;
export const generateMetadata = (props: LocalizedTrustProps) => localizedTrustMetadata("cookie-policy", props);

export default function Page(props: LocalizedTrustProps) {
  return <LocalizedTrustPage slug="cookie-policy" props={props} />;
}

