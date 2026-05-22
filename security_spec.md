# Security Specification - Staje Platform

## Data Invariants
1. **Public Read Access**: All site configuration and app data are publicly readable.
2. **Admin-only Write Access**: Modifying site configuration or app data requires administrative privileges.
3. **Admin Definition**: Admins are authenticated users whose UID exists in the `/admins/` collection.
4. **Data Integrity**: All app entries must have a title, description, and imageUrl.

## "The Dirty Dozen" Payloads (Red Team Test Cases)
1. **Unauthorized Config Update**: Unauthenticated user attempts to update `/config/site`. -> PERMISSION_DENIED
2. **Non-Admin App Creation**: Authenticated non-admin attempts to create a document in `/apps/`. -> PERMISSION_DENIED
3. **App Deletion by Non-Admin**: Authenticated non-admin attempts to delete a document in `/apps/`. -> PERMISSION_DENIED
4. **Shadow Field Injection**: Admin attempts to add `ghostField` to an app document. -> PERMISSION_DENIED
5. **Invalid App Data (Missing Required)**: Admin attempts to create app without `title`. -> PERMISSION_DENIED
6. **Invalid Data Type**: Admin attempts to set `order` as a string. -> PERMISSION_DENIED
7. **Malformed ID**: Admin attempts to create app with ID containing special characters. -> PERMISSION_DENIED
8. **PII Leak Attempt**: Unauthorized user attempts to read `/admins/` collection. -> PERMISSION_DENIED
9. **Identity Spoofing**: User A attempts to update something on behalf of User B (if ownership applied). -> N/A (Admin only)
10. **State Shortcutting**: Skipping validation gates. -> PERMISSION_DENIED
11. **Resource Poisoning**: Extremely large strings in descriptions. -> PERMISSION_DENIED
12. **Terminal State Locking**: Attempting to modify immutable fields (e.g. `createdAt`). -> PERMISSION_DENIED

## Test Plan
- Verify public read on `/config/site` and `/apps/{appId}`.
- Verify block write for anonymous.
- Verify block write for non-admin.
- Verify allow write for admin.
- Verify strict schema validation for app documents.
