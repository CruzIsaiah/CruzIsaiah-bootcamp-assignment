# BUILD_STEPS.md

## Step 1: Project Skeleton

Created the Vite React app structure, package scripts, source folder, and base HTML entrypoint.

Verify:

- App files exist under `src/`
- `package.json` includes `dev`, `build`, and `preview` scripts

Commit:

```bash
git add .
git commit -m "chore: scaffold habit atlas app"
```

## Step 2: Supabase Setup

Added the Supabase client and `.env.example` with required public project values.

Verify:

- `.env` is ignored
- `.env.example` lists `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

Commit:

```bash
git add .
git commit -m "chore: configure supabase client"
```

## Step 3: Authentication

Implemented registration, login, logout, and session state using Supabase Auth.

Verify:

- A new user can register
- An existing user can log in
- Logging out clears the user dashboard

Commit:

```bash
git add .
git commit -m "feat: add email authentication"
```

## Step 4: Database and Security

Created `supabase/schema.sql` with the `habits` table, validation constraints, indexes, timestamps, and row-level security policies.

Verify:

- SQL runs in the Supabase SQL editor
- Anonymous users cannot read or write rows
- Authenticated users can only access rows where `user_id = auth.uid()`

Commit:

```bash
git add .
git commit -m "feat: add habit schema and access policies"
```

## Step 5: CRUD Features

Implemented create, read, update, and delete operations for authenticated users.

Verify:

- User can create a habit
- Habit list reloads from Supabase
- User can mark a habit done
- User can delete a habit
- Signed-out users are prompted to authenticate before write actions

Commit:

```bash
git add .
git commit -m "feat: add authenticated habit crud"
```

## Step 6: Documentation and Deployment

Added README, design docs, Netlify config, and GitHub Actions build workflow.

Verify:

- `npm run build` passes with valid environment variables
- Netlify deploys from `main`
- Live smoke test covers register, login, create, update, and delete

Commit:

```bash
git add .
git commit -m "docs: add week two project documentation"
```
