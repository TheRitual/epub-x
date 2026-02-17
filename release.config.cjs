/** @type {import('semantic-release').GlobalConfig} */
const config = {
  branches: ["main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        parserOpts: { noteKeywords: ["BREAKING CHANGE", "BREAKING CHANGES"] },
      },
    ],
    "@semantic-release/release-notes-generator",
    ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
    "@sebbo2002/semantic-release-jsr",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "jsr.json"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
      },
    ],
    ["@semantic-release/github", { labels: false }],
  ],
};

module.exports = config;
