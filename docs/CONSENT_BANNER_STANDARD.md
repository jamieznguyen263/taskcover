# Consent Banner Standard

The Taskcover consent banner is implemented in
`src/components/marketing/analytics/consent-banner.tsx`.

## Behavior

- Appears on public pages when no consent state exists.
- Does not appear on Admin, API, preview, invite, internal, or debug routes.
- Uses EN/FR/ES copy from the banner component.
- Provides Accept all, Reject non-essential, and Customize controls.
- Links to Cookie Policy and Cookie Preferences.
- Keeps non-essential categories off by default.
- Saves through `saveConsentPreferences`.
- Dispatches the existing consent preference change event.
- Does not reload the page after a choice.

## Customize Panel

The customize panel uses checkbox controls with labels and descriptions.
Strictly necessary is locked on. Preferences, analytics, and marketing are
optional and not preselected.

Escape closes the customize panel back to the banner; it does not hide the
required choice. The banner itself has no dismiss-only control.

## Accessibility And Mobile

The banner is fixed to the viewport bottom to reduce layout shift. Buttons are
keyboard reachable, focus states use the global focus style, and category
controls are labeled. The panel is a dialog with `aria-modal`.

Mobile layout stacks controls and keeps the panel scrollable within the
viewport.

## Measurement

`cookie_banner_view` and `cookie_preferences_update` are typed events. They are
only sent to dataLayer when the consent/configuration gate allows it. Consent
mode updates can be pushed separately without loading GTM before consent.

No dark-pattern UI, preselected analytics/marketing, or legal compliance claim
is included.
