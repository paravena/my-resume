# Design Document: i18n Language Selector

## Overview

This design adds internationalization (i18n) to the portfolio/resume website, enabling English and Spanish language support. The approach is lightweight and custom-built using React Context — no heavy i18n libraries are needed given the small scope (2 locales, ~7 components).

The system consists of four main parts:
1. JSON locale files in `public/locales/` loaded at runtime via `fetch`
2. A `LocaleProvider` React Context that manages the active locale, loads translations, and exposes a `t()` function
3. A `Toolbar` container fixed at the top of the page grouping the `LanguageSelector` and existing `DownloadButton`
4. A `LanguageSelector` component for switching between English and Spanish

All 7 existing components (Header, Summary, ProfessionalExperience, Technologies, Passions, ProudOf, DownloadButton) will replace hardcoded strings with calls to the `t()` translation function.

## Architecture

```mermaid
graph TD
    subgraph "Public Assets"
        EN["public/locales/en.json"]
        ES["public/locales/es.json"]
    end

    subgraph "Context Layer"
        LP["LocaleProvider"]
        LP -->|fetch| EN
        LP -->|fetch| ES
    end

    subgraph "Toolbar (fixed top bar)"
        LS["LanguageSelector"]
        DB["DownloadButton"]
    end

    subgraph "Resume Components"
        H["Header"]
        S["Summary"]
        PE["ProfessionalExperience"]
        T["Technologies"]
        PA["Passions"]
        PO["ProudOf"]
    end

    LP -->|provides t(), locale, setLocale| LS
    LP -->|provides t()| DB
    LP -->|provides t()| H
    LP -->|provides t()| S
    LP -->|provides t()| PE
    LP -->|provides t()| T
    LP -->|provides t()| PA
    LP -->|provides t()| PO

    LS -->|setLocale| LP
```

### Data Flow

1. On app load, `LocaleProvider` reads `localStorage` for a persisted locale (defaults to `en`)
2. `LocaleProvider` fetches the corresponding JSON file from `public/locales/{locale}.json`
3. The translations object is stored in state and exposed via context along with a `t(key)` function
4. When the user clicks a language in `LanguageSelector`, it calls `setLocale(newLocale)`
5. `LocaleProvider` persists the new locale to `localStorage`, fetches the new JSON, and updates state
6. All consuming components re-render with the new translations

### Design Decisions

- **No i18n library**: The scope is 2 locales and ~7 components. A custom React Context with `fetch` is simpler, has zero bundle impact, and is fully sufficient.
- **Runtime fetch vs bundled imports**: Locale files are fetched at runtime from `public/` so they can be edited without rebuilding. This also keeps the JS bundle small.
- **Toolbar container**: The `DownloadButton` currently floats as a fixed element. Moving it into a shared `Toolbar` alongside the `LanguageSelector` provides a cleaner layout and a single `data-hide-for-print` wrapper.

## Components and Interfaces

### LocaleProvider (Context)

```typescript
// src/i18n/LocaleContext.tsx

type SupportedLocale = 'en' | 'es';

type TranslationMap = Record<string, string>;

interface LocaleContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string) => string;
  isLoading: boolean;
}
```

- `locale`: The currently active locale
- `setLocale(locale)`: Switches the active locale, persists to `localStorage`, and triggers a fetch of the new locale file
- `t(key)`: Looks up a dot-notation key in the loaded translations. Returns the key itself if not found (fallback behavior per Requirement 2.5)
- `isLoading`: True while a locale file is being fetched

### useLocale Hook

```typescript
// src/i18n/useLocale.ts

function useLocale(): LocaleContextValue;
```

Convenience hook that calls `useContext(LocaleContext)` and throws if used outside `LocaleProvider`.

### Toolbar Component

```typescript
// src/components/Toolbar/Toolbar.tsx

interface ToolbarProps {
  targetRef: React.RefObject<HTMLElement>;
  pdfFilename?: string;
}
```

- Fixed position at top of page with `bg-blue-50` background
- Contains `LanguageSelector` and `DownloadButton` arranged horizontally
- Wrapped with `data-hide-for-print` attribute
- High `z-index` to stay above scrolling content
- The resume content container gets top padding to account for the toolbar height

### LanguageSelector Component

```typescript
// src/components/LanguageSelector/LanguageSelector.tsx

// No external props needed — reads from LocaleContext
```

- Renders two buttons (EN / ES) or a toggle-style selector
- Highlights the active locale visually (e.g., bold/underline or filled background)
- Keyboard accessible: focusable buttons with `aria-label` and `aria-pressed`
- Calls `setLocale()` from context on click


## Data Models

### Locale File Structure

Locale files are flat JSON objects with dot-notation keys grouped by component name. They live in `public/locales/`.

```json
// public/locales/en.json (abbreviated example)
{
  "header.name": "Pablo Aravena",
  "header.phone": "+56 9 62810987",
  "header.email": "paravena74@gmail.com",
  "header.linkedin": "https://linkedin.com/in/paravena74",
  "header.location": "Santiago, Chile",

  "summary.title": "Summary",
  "summary.text": "I have extensive experience as a software developer...",

  "professionalExperience.title": "Professional Experience",
  "professionalExperience.indeed.title": "Full Stack Developer",
  "professionalExperience.indeed.company": "Indeed",
  "professionalExperience.indeed.location": "Remote",
  "professionalExperience.indeed.fromDate": "September 2024",
  "professionalExperience.indeed.description": "Working as a Full Stack Developer on the Career Guide website...",
  "professionalExperience.indeed.activities.0": "Build and maintain micro frontend components using React and TypeScript",
  "professionalExperience.indeed.activities.1": "Develop server-side features with Node.js and Java",

  "technologies.title": "Technologies",
  "technologies.programmingLanguages.title": "Programming Languages",
  "technologies.frameworks.title": "Frameworks and Libraries",
  "technologies.databases.title": "Databases",
  "technologies.clouds.title": "Clouds Environments",
  "technologies.certifications.title": "Certifications",

  "passions.title": "Passions",
  "passions.programming.title": "Programming",
  "passions.programming.description": "It is not only a job for me...",
  "passions.saxophone.title": "Saxophone",
  "passions.saxophone.description": "It is still hard for me...",

  "proudOf.title": "Most Proud Of",
  "proudOf.degree.text": "Graduated as Computer Engineer from",
  "proudOf.degree.detail": "Universidad de Santiago de Chile, 2001",
  "proudOf.openSource.text": "I have created my own open source project published at",
  "proudOf.openSource.url": "http://github.com/paravena/myui2",

  "downloadButton.download": "Download PDF",
  "downloadButton.generating": "Generating PDF...",
  "downloadButton.downloaded": "Downloaded!",
  "downloadButton.retry": "Try Again",
  "downloadButton.error.targetNotFound": "Target element not found",
  "downloadButton.longOperation.title": "Still generating your PDF...",
  "downloadButton.longOperation.elapsed": "This is taking longer than expected ({seconds}s elapsed)",

  "toolbar.languageSelector.en": "EN",
  "toolbar.languageSelector.es": "ES",
  "toolbar.languageSelector.ariaLabel": "Select language"
}
```

### TypeScript Types

```typescript
// src/i18n/types.ts

export type SupportedLocale = 'en' | 'es';

export type TranslationMap = Record<string, string>;

export const SUPPORTED_LOCALES: SupportedLocale[] = ['en', 'es'];

export const LOCALE_STORAGE_KEY = 'preferred-locale';

export const DEFAULT_LOCALE: SupportedLocale = 'en';
```

### localStorage Schema

| Key | Value | Description |
|-----|-------|-------------|
| `preferred-locale` | `"en"` or `"es"` | The user's selected language preference |


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Locale key structure

*For any* key in any locale file, the key should match the dot-notation pattern `{componentName}.{path}` where `componentName` is one of the known component prefixes (`header`, `summary`, `professionalExperience`, `technologies`, `passions`, `proudOf`, `downloadButton`, `toolbar`).

**Validates: Requirements 1.3**

### Property 2: Locale key set equality

*For any* two locale files in the system, they should contain exactly the same set of keys. That is, the set of keys in `en.json` should be identical to the set of keys in `es.json`.

**Validates: Requirements 1.5**

### Property 3: Translation function correctness

*For any* translation map and any string key, if the key exists in the map then `t(key)` should return the corresponding value from the map; if the key does not exist in the map then `t(key)` should return the key itself unchanged.

**Validates: Requirements 2.2, 2.5**

### Property 4: Locale persistence round-trip

*For any* supported locale value, persisting it to localStorage and then reading it back during initialization should yield the same locale value.

**Validates: Requirements 7.1, 7.2**

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Missing translation key | `t(key)` returns the key string itself (Req 2.5) |
| Locale file fetch fails | Fall back to English locale file; log error to `console.error` (Req 8.4) |
| Invalid locale in localStorage | Ignore the stored value and default to `en` |
| Locale file returns non-JSON | Treat as fetch failure — fall back to English |
| Network timeout on locale fetch | Continue showing previously loaded translations until resolved (Req 8.3) |

## Testing Strategy

### Property-Based Testing

The project already has `fast-check` (v4.5.3) installed. Each correctness property will be implemented as a single property-based test using `fast-check` with a minimum of 100 iterations.

Each test will be tagged with a comment in the format:
**Feature: i18n-language-selector, Property {number}: {property_text}**

| Property | Test Approach |
|----------|--------------|
| Property 1: Locale key structure | Generate random locale maps, verify all keys match the component prefix pattern |
| Property 2: Locale key set equality | Load both locale files, compare key sets for strict equality |
| Property 3: Translation function correctness | Generate random translation maps and random keys (both present and absent), verify `t()` returns correct value or key fallback |
| Property 4: Locale persistence round-trip | Generate random supported locale values, write to mock localStorage, read back, verify equality |

### Unit Testing

Unit tests complement property tests by covering specific examples, integration points, and edge cases:

- **Toolbar rendering**: Verify it contains both LanguageSelector and DownloadButton, has `data-hide-for-print`, has fixed positioning
- **LanguageSelector**: Verify both locale options are displayed, active locale is visually indicated, clicking triggers `setLocale`, ARIA attributes are present
- **LocaleProvider defaults**: Verify default locale is `en` when localStorage is empty
- **Component text extraction**: For each of the 7 components, verify they call `t()` for their text content (render with mock context and check output)
- **Locale file loading**: Verify fetch is triggered on init and on locale change
- **Graceful loading**: Verify old translations remain visible while new locale file loads
- **Fetch failure fallback**: Verify fallback to English on fetch error with console.error
- **Spanish proper nouns**: Verify specific proper nouns (company names, URLs, tech names) are identical between en.json and es.json
