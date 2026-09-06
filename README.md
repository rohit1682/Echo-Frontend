# Echo Frontend

Cross-platform (iOS + Android) mobile app for **Echo**, a personal finance & life-management
"operating system". Built with **Expo + React Native + TypeScript**, this repo currently implements
the **foundation + Finance vertical slice + Advisor**, with the Personal Activity section scaffolded.

## Stack

- **Expo SDK 57** / **React Native** / **Expo Router** (file-based navigation)
- **TypeScript**, **@tanstack/react-query** (server state), **zustand** (auth/session)
- **react-native-reanimated** + **gesture-handler** for a smooth, animated UI
- **react-native-svg** (custom donut chart), **expo-linear-gradient** (hero cards)
- **expo-secure-store** (JWT), **expo-local-authentication** (biometric lock), **expo-haptics**

## Getting started

```bash
npm install
# Start the Echo backend first (see ../Echo-Backend), then:
npx expo start
```

Then press `i` (iOS simulator), `a` (Android emulator), `w` (web), or scan the QR with Expo Go.

### Pointing at the backend

The API base URL is auto-selected for local dev (see [.env.example](.env.example)):

- iOS simulator / web → `http://localhost:4000/api`
- Android emulator → `http://10.0.2.2:4000/api`
- Physical device → set `EXPO_PUBLIC_API_URL` to your machine's LAN IP.

### Demo login

After seeding the backend (`npm run seed` there): `demo@echo.app` / `Password123`.

## Architecture

Two content pillars plus Advisor and Profile, as bottom tabs:

```
src/
  app/                      # Expo Router routes
    _layout.tsx             # providers + auth gate + biometric lock + Stack
    index.tsx               # blank entry (redirects by auth state)
    (auth)/                 # login, register
    (tabs)/
      _layout.tsx           # bottom tabs
      finance.tsx           # FINANCE section (Dashboard | Investments | SIPs | Insurance | Assets | Net worth)
      activity.tsx          # PERSONAL ACTIVITY section (Calendar | Tasks | Birthdays) — scaffolded
      advisor.tsx           # Echo Advisor recommendations
      profile.tsx           # account, theme, biometric lock, sync, logout
  api/                      # axios client (JWT + refresh), typed endpoints, react-query hooks
  components/               # themed primitives (Card, Button, Input, Sheet, DonutChart, ...)
  features/
    auth/                   # shared auth UI
    finance/                # FinanceDashboard, InvestmentsPanel, InvestmentForm
  store/                    # zustand auth store (SecureStore-backed)
  theme/                    # tokens + ThemeProvider (light/dark/system)
  types/                    # types mirroring the backend API
  utils/                    # formatting, haptics, storage
```

### What's implemented

- **Auth**: email/password login & register end-to-end; Google/Apple/OTP buttons scaffolded.
- **Finance → Dashboard**: net-worth hero, invested/current tiles, gain/loss, allocation donut.
- **Finance → Investments**: list with type filters, add/edit via animated bottom sheet, delete,
  tags (with inline tag creation), pull-to-refresh.
- **Advisor**: recommendation feed from the backend (rules engine; AI-personalized when enabled).
- **Profile**: light/dark/system theme, biometric app-lock toggle, sign out.
- Other Finance sub-tabs and the whole Activity section are navigable "coming soon" states.

### UI / animation notes

- All screens use themed tokens (`src/theme`) and respond to light/dark/system instantly.
- Reanimated powers: entrance fades (`FadeInDown`), the segmented control's active pill,
  press-scale feedback (`PressableScale`), the shimmer `Skeleton`, and the bottom `Sheet`.
- `AnimatedNumber` counts stat values up on load. The donut chart is hand-drawn with SVG.

> On **web** (used for quick previews) `react-native-svg` logs a harmless `transform-origin`
> DOM warning for the rotated donut group; it does not occur on native iOS/Android.

## Scripts

| Script            | Description                     |
| ----------------- | ------------------------------- |
| `npx expo start`  | Start the dev server           |
| `npm run android` | Open on Android                |
| `npm run ios`     | Open on iOS (macOS)            |
| `npm run web`     | Open in the browser            |
| `npx tsc --noEmit`| Type-check                     |
