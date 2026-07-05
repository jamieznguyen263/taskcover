import { generateLocalizedTrustStaticParams, localizedTrustMetadata, LocalizedTrustPage, type LocalizedTrustProps } from "../trust-route";

export const generateStaticParams = generateLocalizedTrustStaticParams;
export const generateMetadata = (props: LocalizedTrustProps) => localizedTrustMetadata("how-we-work", props);

export default function Page(props: LocalizedTrustProps) {
  return <LocalizedTrustPage slug="how-we-work" props={props} />;
}

