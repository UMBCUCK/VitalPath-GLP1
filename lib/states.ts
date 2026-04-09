export interface StateInfo {
  code: string;
  name: string;
  available: boolean;
  slug: string;
}

export const allStates: StateInfo[] = [
  { code: "AL", name: "Alabama", available: true, slug: "alabama" },
  { code: "AK", name: "Alaska", available: false, slug: "alaska" },
  { code: "AZ", name: "Arizona", available: true, slug: "arizona" },
  { code: "AR", name: "Arkansas", available: false, slug: "arkansas" },
  { code: "CA", name: "California", available: true, slug: "california" },
  { code: "CO", name: "Colorado", available: true, slug: "colorado" },
  { code: "CT", name: "Connecticut", available: true, slug: "connecticut" },
  { code: "DE", name: "Delaware", available: false, slug: "delaware" },
  { code: "FL", name: "Florida", available: true, slug: "florida" },
  { code: "GA", name: "Georgia", available: true, slug: "georgia" },
  { code: "HI", name: "Hawaii", available: false, slug: "hawaii" },
  { code: "ID", name: "Idaho", available: false, slug: "idaho" },
  { code: "IL", name: "Illinois", available: true, slug: "illinois" },
  { code: "IN", name: "Indiana", available: true, slug: "indiana" },
  { code: "IA", name: "Iowa", available: false, slug: "iowa" },
  { code: "KS", name: "Kansas", available: false, slug: "kansas" },
  { code: "KY", name: "Kentucky", available: false, slug: "kentucky" },
  { code: "LA", name: "Louisiana", available: false, slug: "louisiana" },
  { code: "ME", name: "Maine", available: false, slug: "maine" },
  { code: "MD", name: "Maryland", available: true, slug: "maryland" },
  { code: "MA", name: "Massachusetts", available: true, slug: "massachusetts" },
  { code: "MI", name: "Michigan", available: true, slug: "michigan" },
  { code: "MN", name: "Minnesota", available: true, slug: "minnesota" },
  { code: "MS", name: "Mississippi", available: false, slug: "mississippi" },
  { code: "MO", name: "Missouri", available: false, slug: "missouri" },
  { code: "MT", name: "Montana", available: false, slug: "montana" },
  { code: "NE", name: "Nebraska", available: false, slug: "nebraska" },
  { code: "NV", name: "Nevada", available: true, slug: "nevada" },
  { code: "NH", name: "New Hampshire", available: false, slug: "new-hampshire" },
  { code: "NJ", name: "New Jersey", available: true, slug: "new-jersey" },
  { code: "NM", name: "New Mexico", available: false, slug: "new-mexico" },
  { code: "NY", name: "New York", available: true, slug: "new-york" },
  { code: "NC", name: "North Carolina", available: true, slug: "north-carolina" },
  { code: "ND", name: "North Dakota", available: false, slug: "north-dakota" },
  { code: "OH", name: "Ohio", available: true, slug: "ohio" },
  { code: "OK", name: "Oklahoma", available: false, slug: "oklahoma" },
  { code: "OR", name: "Oregon", available: true, slug: "oregon" },
  { code: "PA", name: "Pennsylvania", available: true, slug: "pennsylvania" },
  { code: "RI", name: "Rhode Island", available: false, slug: "rhode-island" },
  { code: "SC", name: "South Carolina", available: false, slug: "south-carolina" },
  { code: "SD", name: "South Dakota", available: false, slug: "south-dakota" },
  { code: "TN", name: "Tennessee", available: true, slug: "tennessee" },
  { code: "TX", name: "Texas", available: true, slug: "texas" },
  { code: "UT", name: "Utah", available: false, slug: "utah" },
  { code: "VT", name: "Vermont", available: false, slug: "vermont" },
  { code: "VA", name: "Virginia", available: true, slug: "virginia" },
  { code: "WA", name: "Washington", available: true, slug: "washington" },
  { code: "WV", name: "West Virginia", available: false, slug: "west-virginia" },
  { code: "WI", name: "Wisconsin", available: false, slug: "wisconsin" },
  { code: "WY", name: "Wyoming", available: false, slug: "wyoming" },
];

export const availableStates = allStates.filter((s) => s.available);
export const availableCount = availableStates.length;
