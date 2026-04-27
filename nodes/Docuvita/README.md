# n8n-nodes-docuvita

This n8n community node lets you interact with the **Docuvita** document management system API from your n8n workflows.

[Docuvita](http://www.docuvita.com) · [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)

---

## Installation

In your n8n instance, go to **Settings → Community Nodes → Install** and enter:

```
n8n-nodes-docuvita
```

---

## Credentials

Before using the node, create a **Docuvita API** credential:

| Field | Description |
|---|---|
| **Service-URL** | Base URL of your Docuvita REST API, e.g. `https://your-server/docuvita/api/` |
| **SessionGuid** | A valid Docuvita session GUID (acts as the authentication token) |

The credential is tested by calling `POST /info` on the configured URL.

> **Tip:** You can override the session GUID per execution using the **Use Different Session GUID** option on any node.

---

## Resources & Operations

### Info

Returns system information about the Docuvita instance. No additional parameters required.

---

### General

Calls any Docuvita REST endpoint directly. Use this for endpoints not covered by the other resources.

| Parameter | Required | Description |
|---|---|---|
| **Service-Operation** | Yes | The endpoint path to call, e.g. `getobject` |
| **Values to Set** | No | Key/value pairs sent as additional POST body parameters |

---

### Query

#### Get Query Result Set

Executes a saved or dynamic query and returns a paginated result set.

| Parameter | Required | Description |
|---|---|---|
| **QueryDetails** | Yes | JSON string describing the query (as returned by *Get Saved Queries → IncludeQueryDetails*) |
| **PageSize** | Yes | Number of results per page (default: 25) |
| **PageNumber** | Yes | Page to retrieve (zero-based) |

Results are sorted by `SortProperty -114` descending.

#### Get Saved Queries

Returns a list of queries saved in Docuvita.

| Parameter | Required | Description |
|---|---|---|
| **FilterByQueryType** | No | Filter results by query type string |
| **FilterByUsersAndQueriesId** | No | Filter by a specific user/query ID |
| **IncludeQueryDetails** | No | Whether to include full query details in the response (default: `true`) |

---

### Object

#### Create Object

Creates a new Docuvita object. Internally calls `getobjectproperties` to fetch the property template, merges the supplied values, then calls `setobjectproperties`. Optionally uploads a file in the same step.

| Parameter | Required | Description |
|---|---|---|
| **Object Name (OBJ_NAME)** | Yes | Display name of the new object |
| **Objecttype** | Yes | Numeric ID of the object type |
| **Parent** | Yes | Object ID of the parent object |
| **Additional Properties** | No | List of `name`/`value` pairs for any additional object fields |
| **Upload Version** | No | When enabled, a file from the workflow's binary data is attached to the new object |
| **BinaryData** | If Upload Version = true | Name of the binary data property in the incoming item (e.g. `data`) |

When **Upload Version** is enabled, the node first creates the object, then uploads the file via `fileupload`. The response includes the new object's ID (`ObjectId`).

#### Get Object

Retrieves a single object by its ID.

| Parameter | Required | Description |
|---|---|---|
| **ObjectId** | Yes | Numeric ID of the object |
| **SubselectPath** | No | Dot-notation path for selecting a nested sub-object |

#### Get Object Properties

Returns all metadata properties of an object as a flat property list.

| Parameter | Required | Description |
|---|---|---|
| **ObjectId** | Yes | Numeric ID of the object |
| **ObjectTypeId** | No | Override the object type for the property template |
| **Purpose** | No | Context for the property list: `DisplayObject` (0), `NewObject` (1), `Search` (2), `MetadataGeneration` (3), `Sort` (4), `ChangeType` (5), `Export` (6) |
| **ParentObject** | No | Parent object ID context |
| **Simplify** (Option) | No | When `true` (default), returns a flat `{ fieldName: value }` object instead of the raw `ObjectPropertyList` array |

#### Set Object Properties

Updates metadata properties of an existing object. Internally fetches the current property list, merges the supplied values, and writes them back.

| Parameter | Required | Description |
|---|---|---|
| **ObjectId** | Yes | Numeric ID of the object to update |
| **Additional Properties** | Yes | List of `name`/`value` pairs to update (field names are case-insensitive) |

At least one property must be supplied, otherwise the node throws an error.

#### Set Delete Flag

Marks an object for deletion.

| Parameter | Required | Description |
|---|---|---|
| **ObjectId** | Yes | Numeric ID of the object |
| **DeleteReason** | Yes | Reason: `Other` (0), `Invalid` (1), `Duplicate` (2), `Test` (3), `Expired` (4), `Data Privacy Protection` (5) |
| **IncludeSubItems** | Yes | Whether to also mark child objects for deletion (default: `false`) |
| **DeleteReasonText** | No | Free-text reason description |

#### Upload New Version

Uploads a new file version for an existing object. Internally calls `getobjectproperties` → `setobjectproperties` → `setversion` → `fileupload` in sequence.

| Parameter | Required | Description |
|---|---|---|
| **ObjectId** | Yes | Numeric ID of the object |
| **BinaryData** | Yes | Name of the binary data property in the incoming item (e.g. `data`) |
| **VersionComment** | No | Comment for this version |
| **VersionExternalMetaData** | No | External metadata string attached to the version |
| **CheckIn** | No | Whether to check in the version after upload (default: `false`) |
| **Append to Previous** | No | Append to the previous version instead of creating a new one (default: `false`) |
| **Additional Properties** | No | Object metadata fields to update alongside the new version |

**Version number options** (via the *VersionNumber* option):

| Option | Description |
|---|---|
| `NoVersionIncrement` (0) | Keep current version number |
| `IncrementMajor` (10) | Increment major version component |
| `IncrementMinor` (11) | Increment minor version component |
| `IncrementRevision` (12) | Increment revision component |
| `SpecifyVersionNumber` (13) | Set an explicit version using `VersionMajor1`, `VersionMinor`, `VersionRevision`, `VersionLabel` |

After a successful upload the node returns the updated object data from `getobject`.

---

### Workflow

#### Complete Task

Completes a specific workflow task in Docuvita.

| Parameter | Required | Description |
|---|---|---|
| **TaskId** | Yes | ID of the task to complete |
| **TaskProperties** | Yes | JSON string with task completion properties |

---

## Global Options

These options are available on all resources via the **Options** collection:

| Option | Description |
|---|---|
| **Use Different Session GUID** | Overrides the session GUID from the credential for this specific execution. Useful when working with user-scoped sessions at runtime. |
| **Simplify** *(Object → Get Object Properties only)* | Returns a flat key/value map instead of the raw `ObjectPropertyList` array (default: `true`) |
| **VersionNumber** *(Object → Upload New Version only)* | Controls versioning behaviour (see *Upload New Version* above) |

---

## Property Data Types

When setting object properties (in *Create Object*, *Set Object Properties*, *Upload New Version*), values are always supplied as strings and cast automatically based on the field's `FieldType`:

| FieldType | Docuvita Type | Cast to |
|---|---|---|
| `S` | String | string |
| `N` | Numeric | number |
| `C` | Currency | float |
| `B` | Boolean | `true` / `false` |
| `D` | DateTime | `Date` (ISO 8601 string accepted) |

Field names are matched case-insensitively.

---

## License

[MIT](../../LICENSE.md)
