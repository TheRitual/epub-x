import { describe, it, expect } from "vitest";
import { htmlToMarkdown, htmlToPlainText } from "./utils.js";

describe("htmlToPlainText", () => {
  it("strips HTML tags", () => {
    expect(htmlToPlainText("<p>Hello</p>")).toBe("Hello");
  });

  it("collapses whitespace", () => {
    expect(htmlToPlainText("<p>  a   b  </p>")).toBe("a b");
  });

  it("decodes common entities", () => {
    expect(htmlToPlainText("&amp; &lt; &gt; &quot;")).toBe('& < > "');
  });

  it("removes style and script tags", () => {
    expect(htmlToPlainText("<style>body{}</style>foo")).toBe("foo");
    expect(htmlToPlainText("<script>alert(1)</script>bar")).toBe("bar");
  });
});

describe("htmlToMarkdown", () => {
  it("converts headings to atx style", () => {
    const md = htmlToMarkdown("<h1>Title</h1>");
    expect(md).toContain("# Title");
  });

  it("converts paragraphs to newline-separated text", () => {
    const md = htmlToMarkdown("<p>One</p><p>Two</p>");
    expect(md).toMatch(/One/);
    expect(md).toMatch(/Two/);
  });
});
