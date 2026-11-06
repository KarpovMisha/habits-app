# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **src/app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Useful commands

### App

```bash
npx expo start              # Start the dev server (press i / a / w to open iOS, Android or web)
npx expo install <package>  # Add a package at the version compatible with this Expo SDK (use instead of npm install)
npx expo install --fix      # Fix installed packages whose versions don't match the SDK
npx expo lint               # Run ESLint
npx tsc --noEmit            # Type-check the project
npx expo-doctor             # Diagnose dependency and config problems
```

Run lint and the type check before committing.

### Local database (Supabase)

The backend runs locally in Docker via the [Supabase CLI](https://supabase.com/docs/guides/local-development). Requirements: Docker running and the Supabase CLI installed (`brew install supabase/tap/supabase`). Configuration lives in `supabase/config.toml`, schema changes in `supabase/migrations/`.

```bash
supabase start              # Start the local stack (Postgres, Auth, API, Realtime, Studio); first run downloads the Docker images
supabase status             # Show local URLs and keys (Project URL, Studio URL, publishable key)
supabase stop               # Stop the stack; data is kept
supabase db reset           # Recreate the database from migrations; all local data is deleted
supabase migration new <name>  # Create an empty migration file in supabase/migrations/
supabase db diff -f <name>  # Generate a migration from changes made in Studio
supabase gen types typescript --local > src/types/database.ts  # Generate TypeScript types from the local schema
```

Local services after `supabase start`. Ports are moved from the CLI defaults (543xx) to 553xx in `supabase/config.toml`, so this project can run alongside other local Supabase projects:

| Service | URL |
|---|---|
| API (used by the app) | http://127.0.0.1:55321 |
| Studio (web admin for tables and data) | http://127.0.0.1:55323 |
| Mailpit (catches auth emails sent locally) | http://127.0.0.1:55324 |
| Postgres | postgresql://postgres:postgres@127.0.0.1:55322/postgres |

The app uses the **publishable** key. Never put the **secret** key in the app; it bypasses row-level security.

A phone or emulator can't reach `127.0.0.1` on your computer. Point the app at your computer's LAN IP instead, e.g. `http://192.168.1.10:55321`.

### Hosted database (later)

```bash
supabase login              # Authenticate the CLI with your supabase.com account
supabase link --project-ref <ref>  # Link this repo to a hosted Supabase project
supabase db push            # Apply local migrations to the hosted database
```

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **example** directory and create a blank **src/app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
