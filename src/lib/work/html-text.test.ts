import { describe, expect, it } from "vitest";
import { htmlToText, isHtmlEmpty } from "./html-text";

describe("htmlToText", () => {
  it("turns list items into '- ' lines", () => {
    expect(htmlToText("<ul><li>Call the client</li><li>Send recap</li></ul>")).toBe("- Call the client\n- Send recap");
  });

  it("preserves a literal '- [ ] …' a user typed inside a list (keeps extraction working)", () => {
    // TipTap consumes the leading "- " into a bullet; "[ ] Follow up" stays as the item text.
    expect(htmlToText("<ul><li>[ ] Follow up with Vivagen</li></ul>")).toBe("- [ ] Follow up with Vivagen");
  });

  it("breaks paragraphs and headings into separate lines and strips tags", () => {
    expect(htmlToText("<h2>Notes</h2><p>ACTION: send the proposal</p>")).toBe("Notes\nACTION: send the proposal");
  });

  it("decodes common entities", () => {
    expect(htmlToText("<p>Tom &amp; Jerry &lt;3</p>")).toBe("Tom & Jerry <3");
  });

  it("collapses excessive blank lines", () => {
    expect(htmlToText("<p>a</p><p></p><p></p><p>b</p>")).toBe("a\n\nb");
  });
});

describe("isHtmlEmpty", () => {
  it("treats an empty editor as empty", () => {
    expect(isHtmlEmpty("<p></p>")).toBe(true);
    expect(isHtmlEmpty("")).toBe(true);
  });

  it("is false when there is visible text", () => {
    expect(isHtmlEmpty("<p>hello</p>")).toBe(false);
  });
});
