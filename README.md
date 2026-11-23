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

### Hosted database (supabase.com)

The production backend is a hosted Supabase project. The schema comes from the same `supabase/migrations/` files as the local stack; data is never copied between them.

Use the Homebrew `supabase` binary, not `npx supabase`: `npx` pulls CLI v3, which rejects the `[inbucket]` section of `supabase/config.toml`.

#### First-time setup

1. Create a project at [supabase.com](https://supabase.com) (Free plan). Save the **Database password**; `link` and `db push` ask for it. Forgot it? Reset it in **Project Settings → Database**.
2. Link this repo to the project. The project ref is the ID in the dashboard URL: `supabase.com/dashboard/project/<ref>`.

   ```bash
   supabase login                     # Opens the browser to authenticate the CLI
   supabase link --project-ref <ref>  # Stores the link in supabase/.temp (git-ignored)
   ```

3. Apply the schema:

   ```bash
   supabase db push --dry-run  # Preview which migrations will run
   supabase db push            # Apply them
   ```

4. Repeat the auth settings in the dashboard under **Authentication**. `db push` only applies migrations; `config.toml` is not uploaded.

   | Setting | Value |
   |---|---|
   | Sign In / Providers → Email | enabled |
   | Sign In / Providers → Allow anonymous sign-ins | off |
   | Sign In / Providers → Minimum password length | 8 |
   | Sign In / Providers → Confirm email | off until custom SMTP is set up (see below) |
   | URL Configuration → Site URL | `habitsapp://` |
   | URL Configuration → Redirect URLs | `habitsapp://**` |

   The built-in email service only delivers to members of your Supabase organization, a few emails per hour. Before inviting other users, set up custom SMTP (e.g. [Resend](https://resend.com), needs your own domain) in **Project Settings → Authentication → SMTP Settings**, then turn **Confirm email** on.

#### Point the app at the hosted project

Copy the **Project URL** and the **Publishable key** (`sb_publishable_...`) from **Project Settings → Data API / API Keys** into `.env.local`. Keep the local values commented out to switch back:

```bash
# Local
# EXPO_PUBLIC_SUPABASE_URL=http://127.0.0.1:55321
# EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...

# Hosted
EXPO_PUBLIC_SUPABASE_URL=https://<ref>.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

`EXPO_PUBLIC_` values are inlined into the bundle, so restart with a cleared cache after changing them: `npx expo start -c`.

`.env.local` is git-ignored and not available to EAS Build or EAS Update. Their values live in the EAS `preview` environment instead (`npx eas-cli@latest env:list --environment preview`).

#### Changing the schema

Make the change locally first, then ship it as a migration:

```bash
supabase db diff -f <name>  # Save changes made in local Studio as a migration (or write one with `supabase migration new <name>`)
supabase db reset           # Optional: check the migrations apply cleanly from scratch
supabase db push            # Apply new migrations to the hosted database
```

Never edit a migration that has already been pushed; add a new one instead.

The Free plan pauses a project after a week without requests. Restore it from the dashboard; data is kept.

## Releasing the Android app (without Google Play)

The app is installed from an APK built by [EAS Build](https://docs.expo.dev/build/introduction/) and updated over the air by [EAS Update](https://docs.expo.dev/eas-update/introduction/). Both run on the free Expo plan. EAS project: [@mkarpov/habits-app](https://expo.dev/accounts/mkarpov/projects/habits-app).

Run EAS CLI as `npx eas-cli@latest <command>`. Log in once with `npx eas-cli@latest login`.

| Config | Where |
|---|---|
| Build profile `preview`: APK, internal distribution, channel `preview`, auto-incremented `versionCode` | `eas.json` |
| `runtimeVersion` (policy `appVersion`) and the update URL | `app.json` |
| Supabase URL and publishable key for builds and updates | EAS environment `preview` |
| Versions the app compares against (`latest_version`, `min_version`, `store_url`) | `app_config` table in hosted Supabase |

### Which kind of release?

| What changed | Release |
|---|---|
| JS/TS only: screens, styles, logic, assets | **OTA update**: no new APK |
| Native: a package with native code, `app.json`, icon/splash, Expo SDK upgrade | **New APK** + bump `version` |

`runtimeVersion` equals `version` in `app.json`. An OTA update only reaches APKs with the same `version`, so an update that needs new native code can never land on an APK that lacks it. When unsure, ship a new APK.

### OTA update (most changes)

```bash
npx eas-cli@latest update --channel preview --environment preview --message "Short description"
```

The app checks for updates on launch and downloads them in the background. The banner **Update ready → Restart** applies the update immediately; otherwise it applies on the next cold start.

Roll back a bad update: `npx eas-cli@latest update:republish` with an earlier group, or from the project's **Updates** page on expo.dev.

### New APK (native changes)

1. Bump `version` in `app.json` (e.g. `1.0.0` → `1.1.0`). `versionCode` increments by itself.
2. Build:

   ```bash
   npx eas-cli@latest build --platform android --profile preview
   ```

   Takes ~10–20 minutes on the free queue. The result page on expo.dev has an **Install** link and QR code.
3. In hosted Supabase, **Table Editor → app_config → android** row: set `latest_version` to the new version and `store_url` to the build's install link. Every older APK now shows **New version available → Update**.
4. To force the update (e.g. the old version breaks against a changed schema), also set `min_version`. Older APKs then show a blocking **Update required** screen.

### Installing on a phone

Open the build's install link on the phone, download the APK and open it. Android asks once to allow installs from the browser. A new APK installs over the old one and keeps the data, as long as it is signed with the same key; EAS stores the keystore, so builds from this project always are.

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
