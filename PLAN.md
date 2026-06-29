# PLAN.md

## Concept

Habit Atlas is a private habit tracker for people who want a small daily dashboard instead of a large productivity system. A user can register, log in, create habits, mark them complete for the current day, and delete habits they no longer need.

## Scope

### Included for Week 2

- Email/password registration and login through Supabase Auth
- Authenticated CRUD for habits
- User-specific habit data using Supabase row-level security
- Responsive React frontend
- Documentation for setup, architecture, schema, and deployment
- CI build workflow for pushes and pull requests

### Backlog

- Google OAuth login
- Habit history table for multi-day streaks
- Weekly progress chart
- Edit habit form
- Reminder notifications

## Data Model

### User

Managed by Supabase Auth.

### Habit

| Field | Type | Purpose |
| --- | --- | --- |
| id | uuid | Primary key |
| user_id | uuid | Owner, linked to Supabase Auth user |
| title | text | Habit name |
| frequency | text | Daily, Weekdays, or Weekly |
| target_count | integer | Target repetitions |
| notes | text | Optional detail |
| completed_today | boolean | Completion status for the current day |
| created_at | timestamptz | Created timestamp |
| updated_at | timestamptz | Updated timestamp |

## Incremental Build Plan

1. Create Vite React project and static layout.
2. Add Supabase client and environment variable wiring.
3. Implement registration, login, logout, and session persistence.
4. Add database table, constraints, and row-level security policies.
5. Implement habit create, read, update, and delete operations.
6. Add docs, CI build workflow, and deployment configuration.
