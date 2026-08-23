import { describe, expect, it } from "vitest";
import { triageHKRequest } from "./hkTriage";

describe("triageHKRequest", () => {
  it("prioritizes a possible phishing incident over ordinary account access", () => {
    const result = triageHKRequest(
      "I got a phishing email saying my Gmail will be locked unless I sign in"
    );

    expect(result.category).toBe("security");
    expect(result.priority).toBe("high");
    expect(result.stage).toBe("stabilize");
    expect(result.needsHuman).toBe(true);
  });

  it("marks disclosed credentials or money as urgent security escalation", () => {
    const result = triageHKRequest(
      "Someone called and I gave them my password and sent money"
    );

    expect(result.category).toBe("security");
    expect(result.priority).toBe("urgent");
    expect(result.needsHuman).toBe(true);
    expect(result.response.toLowerCase()).toContain("stop contact");
  });

  it("routes email recovery to account access", () => {
    const result = triageHKRequest(
      "I forgot my Gmail password and cannot sign in"
    );

    expect(result.category).toBe("account-access");
    expect(result.stage).toBe("safe-fix");
    expect(result.response.toLowerCase()).toContain("official sign-in page");
  });

  it("routes Wi-Fi failures to connectivity", () => {
    const result = triageHKRequest("My laptop cannot connect to Wi-Fi");

    expect(result.category).toBe("connectivity");
    expect(result.response.toLowerCase()).toContain("one device");
  });

  it("routes job application help to employment", () => {
    const result = triageHKRequest("I need help applying for a job on NCWorks");

    expect(result.category).toBe("employment");
    expect(result.response).toContain("NCWorks");
  });

  it("asks one bounded clarification question for an unknown issue", () => {
    const result = triageHKRequest("Something is not working");

    expect(result.category).toBe("unknown");
    expect(result.stage).toBe("classify");
    expect(result.needsHuman).toBe(true);
    expect(result.response).toContain("main problem");
  });

  it("never requests sensitive credentials in the empty-input response", () => {
    const result = triageHKRequest("   ");

    expect(result.response.toLowerCase()).toContain("do not include passwords");
    expect(result.response.toLowerCase()).toContain("verification codes");
  });
});
