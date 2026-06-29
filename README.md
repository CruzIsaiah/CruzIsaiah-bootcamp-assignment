# Habit Atlas

Habit Atlas is a Week 2 full-stack assignment project. It is a private habit tracker where users register, log in, and manage their own recurring habits.

## Live URL

Add the deployed Netlify URL here after deployment.

## Features

- Email/password registration and login
- Persistent auth sessions through Supabase
- User-specific habit dashboard
- Create, read, update, and delete habits
- Protected write actions
- Supabase row-level security for database access control
- Responsive React interface

## Tech Stack

- React
- Vite
- Supabase Auth
- Supabase Postgres
- Netlify
- GitHub Actions

## Data Model

The main table is `habits`. Each row belongs to a Supabase Auth user through `user_id`.

See [docs/database.md](docs/database.md) for the ERD, schema notes, and access policies.

## Architecture

The React app talks directly to Supabase through the Supabase JavaScript client. Supabase handles authentication, database storage, and row-level security.

See [docs/architecture.md](docs/architecture.md) for the full overview.

## Setup

### Prerequisites

- Node.js 22 or newer
- npm
- Supabase project
- GitHub Classroom repository

### Install

```bash
npm install
```

### Configure Environment

Copy the example file:

```bash
cp .env.example .env
```

Set these values in `.env`:

```bash
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Create Database Table

Open the Supabase SQL editor and run the contents of:

```bash
supabase/schema.sql
```

### Run Locally

```bash
npm run dev
```

## Usage

1. Register with an email and password.
2. Log in.
3. Add a habit with a frequency and target count.
4. Mark the habit complete for today.
5. Refresh the habit list.
6. Delete habits you no longer want.

## Deployment

This project is configured for Netlify.

See [docs/deployment.md](docs/deployment.md) for the deployment checklist and smoke test.

## Planning

- [PLAN.md](PLAN.md)
- [BUILD_STEPS.md](BUILD_STEPS.md)

## Secrets Hygiene

`.env` is ignored by Git. Commit `.env.example`, but never commit real Supabase keys.

## Demo Video Checklist

Record a 2-3 minute video showing:

- Registration
- Login
- Creating a habit
- Marking a habit done
- Refreshing persisted data
- Deleting a habit
