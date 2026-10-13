# Changelog

All notable changes to this package are documented in this file.

## 26.10.1 - 2026-10-13

### Fixed

- **Set Delete Flag** now processes every incoming item. Previously the node stopped silently after the first item, so only one object was marked for deletion.
- The **Docuvita API** credential icon is displayed again. The credential referenced an SVG in its own folder that is not part of the package.

### Changed

- **Set Delete Flag** accepts a comma-separated list of object IDs and marks all of them in a single API call. `DeleteReason`, `IncludeSubItems` and `DeleteReasonText` apply to every ID of that call. A single ID behaves as before.

## 26.2.13 - 2026-04-27

### Added

- Initial release with the resources **Info**, **General**, **Query**, **Object** and **Workflow**.
