# Proof and Authority Standard

This document governs every Taskcover proof, authority, review, media,
video, spokesperson, and private-reference surface.

## Evidence Record Model

Evidence records live in `src/content/proof.registry.ts` and use the
`ProofRecord` type from `src/content/proof.types.ts`.

Fields include `id`, `type`, `title`, `organizationName`, `personName`,
`personRole`, `summary`, `quote`, `sourceUrl`, `assetPath`, `thumbnailPath`,
`videoUrl`, `publicationName`, `publishedAt`, `locale`, `permissionStatus`,
`verificationStatus`, `publicDisclosure`, `disclosureText`, and
`internalNotes`.

`internalNotes` must never render publicly.

## Permission Statuses

- `verified-public`: approved for named public display.
- `private-reference`: may be used only in a private reference workflow.
- `internal-only`: internal record only; never public.
- `pending`: not yet approved; never public.

## Verification Statuses

- `verified`: source and context confirmed.
- `unverified`: not confirmed; never public.
- `expired`: no longer valid; never public.
- `not-applicable`: used only when verification does not apply to the record.

## Public Rendering Rules

A record can render as named public proof only when all conditions are true:

- `permissionStatus === "verified-public"`
- `verificationStatus === "verified"`
- `publicDisclosure === true`

Use `isPublicVerifiedProofItem()` or the exported public helper functions.
Do not filter records manually inside components.

## Private Reference Policy

Private reference records may produce only generic public wording:

> Private references may be available for qualified engagements.

Do not expose names, quotes, URLs, roles, companies, thumbnails, screenshots,
or source details from private-reference records.

## Safe Experience Wording

The approved wording is:

> Selected team and partner experience across global brands, campaigns, and
> search programs.

The approved text-only experience names are Agoda, Skyscanner, British
Council, and Avis.

## Brand Disclosure Rules

- Brand names are experience context only.
- Do not imply current endorsement.
- Do not imply a direct contract unless verified evidence exists.
- Do not use logos without permissioned public assets.
- Do not use brands as testimonial sources.

## Review Rules

- Do not invent reviews.
- Do not invent reviewer names, roles, companies, initials, quotes, or ratings.
- Do not show star ratings or rating counts without verified source data.
- Do not add `Review` or `AggregateRating` schema until a later verified,
  source-linked task confirms it is appropriate.

## Video Rules

- Do not invent video testimonials, thumbnails, dates, speakers, durations, or
  URLs.
- Render video records only through verified-public proof helpers.
- Do not emit `VideoObject` schema without a real public video URL,
  thumbnail, title, description, and valid date data.

## Media Source Rules

- Do not invent press coverage, publication logos, article titles, authors,
  dates, or source URLs.
- Verified media links require a real source URL and approved public wording.
- Publication logos require verified public assets and permission.

## Spokesperson Profile Rules

Optional future fields: name, role, headshot, biography, verified
credentials, approved topics, language availability, source links, and public
permission status.

Do not invent a founder, spokesperson name, credentials, education, job
history, awards, speaking history, or employer history.

If no verified public spokesperson exists, render at agency level.

## Prohibited Proof Patterns

- "Trusted by"
- Fake testimonials
- Fake press
- Fake awards
- Fake case-study metrics
- Fake logos
- Fake screenshots
- "Coming soon"
- "Placeholder"
- Review or aggregate-rating schema without verified source data
- Public display of private, pending, internal, expired, or unverified records

## Future Workflow For Adding Evidence

1. Add the evidence record to `proof.registry.ts`.
2. Store internal notes in `internalNotes` only.
3. Confirm source, identity, context, permission, and public wording.
4. Set `permissionStatus`, `verificationStatus`, and `publicDisclosure`.
5. Add source assets only when permissioned for public use.
6. Run lint, typecheck, and build.
7. QA the relevant localized proof page.
8. Add schema only when the record type has complete verified schema data.

## Relationship To Work Pages

Proof answers why buyers should trust Taskcover. Work answers what Taskcover
produces and how the work is structured.

Work records reuse the same permission and verification language as proof:
`verified-public`, `private-reference`, `internal-only`, `pending`,
`verified`, `unverified`, `expired`, and `not-applicable`.

Case studies and client results have stricter public requirements documented
in `docs/WORK_AND_CASE_STUDY_STANDARD.md`. Do not publish private proof as
Work output, and do not imply that an illustrative sample is client proof.

## Task 8B Verified Case Studies

The 10 Task 8B case studies are approved for full public use as Taskcover
Agency case studies. Public copy must not mention Innovative Brain Agency,
iBrain, partner-agency work, or historical team experience.

Metrics may be shown only at the claim level supported by the approved source
case pages. Do not transform narrative ratings, app-store context, awards, or
review references into `Review`, `AggregateRating`, endorsement, or unsupported
Organization schema.

## Private Reference Routing (Task 9)

Private reference CTAs route to localized `/contact?intent=private-reference`.
The contact form may qualify the request, but it must not expose private
reference names, engagement details, source files, or introductions
automatically. Availability remains case by case and permission-bound.

Media inquiry CTAs route to localized `/contact?intent=media` and must not
promise spokesperson availability.
