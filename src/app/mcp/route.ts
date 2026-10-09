import { NextResponse } from "next/server";
import { getData, lookupCity, citySeries } from "@/lib/contagion";

// Minimal MCP server over streamable HTTP (JSON-RPC 2.0 via POST).
// Supports: initialize, tools/list, tools/call. Stateless.

const SERVER = { name: "canada-contagion-tracker", version: "1.0.0" };

const TOOLS = [
  {
    name: "city_lookup",
    description:
      "Corridor city metadata: CMA, distance from downtown Toronto, 2021 census population, NHPI coverage, and the city's ripple record (price growth since 2017, price-cycle correlation with Toronto, cycle lead in months).",
    inputSchema: {
      type: "object",
      properties: {
        city_id: {
          type: "string",
          description: "City id, e.g. hamilton, kitchener-waterloo, oshawa, guelph, barrie, brantford, toronto",
        },
      },
      required: ["city_id"],
    },
  },
  {
    name: "ripple_series",
    description:
      "Annual New Housing Price Index series for one corridor city, rebased to 2017=100, with Toronto's index and the Toronto-relative catch-up ratio per year.",
    inputSchema: {
      type: "object",
      properties: {
        city_id: { type: "string", description: "City id, e.g. kitchener-waterloo" },
      },
      required: ["city_id"],
    },
  },
  {
    name: "contagion_summary",
    description:
      "Headline findings of the contagion test: which corridor cities outran Toronto since 2017, cycle synchrony and leads, and the explicit data gaps (no resale levels, no Barrie/Brantford NHPI coverage).",
    inputSchema: { type: "object", properties: {} },
  },
];

function ok(id: unknown, result: unknown) {
  return { jsonrpc: "2.0", id, result };
}
function err(id: unknown, code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}
function textResult(data: unknown) {
  return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
}

function handle(msg: any) {
  if (!msg || msg.jsonrpc !== "2.0" || typeof msg.method !== "string") {
    return err(msg?.id ?? null, -32600, "Invalid Request");
  }
  const id = msg.id ?? null;
  switch (msg.method) {
    case "initialize":
      return ok(id, {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: SERVER,
      });
    case "notifications/initialized":
      return null;
    case "tools/list":
      return ok(id, { tools: TOOLS });
    case "tools/call": {
      const name = msg.params?.name;
      const args = msg.params?.arguments ?? {};
      if (name === "city_lookup") {
        const rec = lookupCity(String(args.city_id ?? ""));
        if (!rec) return err(id, -32602, "Unknown city_id");
        return ok(id, textResult(rec));
      }
      if (name === "ripple_series") {
        const rec = citySeries(String(args.city_id ?? ""));
        if (!rec) return err(id, -32602, "Unknown city_id or no NHPI coverage");
        return ok(id, textResult(rec));
      }
      if (name === "contagion_summary") {
        const d = getData();
        const summary = {
          headline:
            "Kitchener-Waterloo new-home prices rose 46.7% from 2017 to 2026 against Toronto's 2.9%; its index sits at 1.43x Toronto's (2017=100).",
          growth_2017_2026: Object.fromEntries(
            d.ripple.map((r) => [r.city, r.growth_2017_2026])
          ),
          cycle_correlation_with_toronto: Object.fromEntries(
            d.ripple.filter((r) => r.city !== "Toronto").map((r) => [r.city, r.max_corr])
          ),
          cycle_lead_months_vs_toronto: Object.fromEntries(
            d.ripple.filter((r) => r.city !== "Toronto").map((r) => [r.city, r.best_lag_months])
          ),
          gaps: d.meta.gaps,
          sources: d.meta.sources,
        };
        return ok(id, textResult(summary));
      }
      return err(id, -32601, "Unknown tool");
    }
    default:
      return err(id, -32601, "Method not found");
  }
}

export async function POST(req: Request) {
  const msg = await req.json().catch(() => null);
  const res = handle(msg);
  if (res === null) return new NextResponse(null, { status: 202 });
  return NextResponse.json(res);
}
