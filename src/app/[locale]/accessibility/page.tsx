import { generateLocalizedTrustStaticParams, localizedTrustMetadata, LocalizedTrustPage, type LocalizedTrustProps } from "../trust-route";

export const generateStaticParams = generateLocalizedTrustStaticParams;
export const generateMetadata = (props: LocalizedTrustProps) => localizedTrustMetadata("accessibility", props);

export default function Page(props: LocalizedTrustProps) {
  return <LocalizedTrustPage slug="accessibility" props={props} />;
}

