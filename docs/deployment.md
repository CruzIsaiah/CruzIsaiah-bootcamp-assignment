# Deployment Notes

## Netlify

1. Push the repository to GitHub Classroom.
2. Create a Netlify site from the repository.
3. Set the build command to `npm run build`.
4. Set the publish directory to `dist`.
5. Add these environment variables in Netlify:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
6. Deploy from the `main` branch.

## GitHub Actions

The workflow in `.github/workflows/deploy.yml` runs on pushes and pull requests to `main`. It installs dependencies and builds the app with secrets from the repository settings.

Required GitHub secrets:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Smoke Test

After deployment:

1. Open the live site.
2. Register a new account.
3. Log in.
4. Create a habit.
5. Mark it done.
6. Refresh the page and confirm the habit persists.
7. Delete the habit.
