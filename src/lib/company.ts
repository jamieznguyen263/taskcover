export const companyDetails = {
  brandName: "Taskcover Agency",
  formalName: "Taskcover Agency by Stoa Global Corporation",
  legalOperator: "Stoa Global Corporation",
  address: {
    street: "169 Madison Avenue",
    city: "New York",
    region: "NY",
    postalCode: "10016",
    country: "United States",
  },
  phone: "+1 (802) 802-9299",
  email: "business@taskcover.com",
} as const;

export function companyAddressLine() {
  const { street, city, region, postalCode, country } = companyDetails.address;
  return `${street}, ${city}, ${region} ${postalCode}, ${country}`;
}

