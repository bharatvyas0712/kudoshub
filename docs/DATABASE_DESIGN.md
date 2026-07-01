# Database Design

## Tables

- users
- departments
- kudos
- notifications
- moderation_logs

## Design Notes

- Users store identity, department, role, and profile image metadata.
- Kudos supports moderation metadata and visibility control.
- Notifications are user-scoped and support read state.
- Moderation logs provide an audit trail for admin actions.
