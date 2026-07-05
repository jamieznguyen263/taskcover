import { generateLocalizedTrustStaticParams, localizedTrustMetadata, LocalizedTrustPage, type LocalizedTrustProps } from "../trust-route";

export const generateStaticParams = generateLocalizedTrustStaticParams;
export const generateMetadata = (props: LocalizedTrustProps) => localizedTrustMetadata("terms", props);

export default function Page(props: LocalizedTrustProps) {
  return <LocalizedTrustPage slug="terms" props={props} />;
}

