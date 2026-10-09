import { NextResponse } from "next/server";

const spec = {
  openapi: "3.1.0",
  info: {
    title: "The Price Wave API",
    version: "1.0.0",
    description:
      "Tests the Patient Zero thesis: does Toronto's unaffordability ripple outward? New Housing Price Index trajectories (1981-2026) for five corridor CMAs rebased to 2017=100, Toronto-relative catch-up ratios, and lead-lag cycle analysis. Seven corridor cities tracked from Toronto (0 km) to Brantford (90.7 km). Sources: StatCan tables 18-10-0205-01 and 98-10-0003-01. MIT licensed.",
  },
  servers: [{ url: "https://pricewave.canada.nshipyard.com/api/v1" }],
  paths: {
    "/cities": {
      get: {
        summary: "Seven corridor cities: CMA, distance from downtown Toronto, 2021 population, NHPI coverage",
        responses: { "200": { description: "City list with metadata and sources" } },
      },
    },
    "/ripple": {
      get: {
        summary: "Full dataset: cities, annual NHPI series, catch-up ratios, ripple lead-lag analysis, methodology gaps",
        responses: { "200": { description: "The complete price-wave dataset" } },
      },
    },
  },
};

export async function GET() {
  return NextResponse.json(spec);
}
