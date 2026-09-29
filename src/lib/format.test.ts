import { describe, expect, it } from "vitest";

import { formatCurrency } from "@/lib/format";

describe("formatCurrency", () => {
  it("převádí centy na českou měnu", () => {
    expect(formatCurrency(123450)).toBe("1\u00a0234,50\u00a0Kč");
  });

  it("formátuje nulu", () => {
    expect(formatCurrency(0)).toBe("0,00\u00a0Kč");
  });
});
