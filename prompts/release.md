# Release Prompt

Use this flow for a normal release:

1. Update `CHANGELOG.md` with a new top section for the target version.
2. Update the `version` field in `package.json` to the target version.
3. Run `bun install` if the lockfile needs to reflect the version update.
4. Verify the package version updates in:
   `package.json`
5. Verify the release build:
   `bun run build`
6. Stage the release files.
7. Commit with:
   `git commit -m "release v<version>"`
8. Push the branch:
   `git push origin main`
9. Create the release tag:
   `git tag v<version>`
10. Push the tag:
    `git push origin v<version>`
