import { describe, expect, it } from "vitest";

import { splitLongTelegramText } from "@/src/telegram/send";

describe("splitLongTelegramText", () => {
  it("returns single part when text fits", () => {
    expect(splitLongTelegramText("short")).toEqual(["short"]);
  });

  it("splits long text on paragraph boundaries", () => {
    const paragraph = "word ".repeat(200).trim();
    const text = `${paragraph}\n\n${paragraph}`;
    const parts = splitLongTelegramText(text, 500);
    expect(parts.length).toBeGreaterThan(1);
    for (const part of parts) {
      expect(part.length).toBeLessThanOrEqual(500);
    }
    expect(parts.join("\n\n")).toContain("word");
  });

  it("does not split inside a fenced code block", () => {
    const prefix = "Intro paragraph.\n\n";
    const codeLine = "const value = 42;\n";
    const codeBlock = `\`\`\`js\n${codeLine.repeat(80)}\`\`\``;
    const suffix = "\n\nOutro paragraph.";
    const text = prefix + codeBlock + suffix;
    const parts = splitLongTelegramText(text, 400);

    for (const part of parts) {
      const opens = (part.match(/```/g) ?? []).length;
      expect(opens % 2).toBe(0);
    }

    const combined = parts.join("");
    expect(combined).toContain("```js");
    expect(combined).toContain("const value = 42;");
    expect(combined).toContain("Outro paragraph.");
  });
});
