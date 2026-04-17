# Implementation Plan: i18n Language Selector

## Overview

Implement internationalization (i18n) for the portfolio/resume website using a lightweight React Context approach. This plan incrementally builds the i18n infrastructure (types, context, locale files), then extracts text from all 7 components, adds the Toolbar and LanguageSelector UI, and wires everything together with persistence and error handling.

## Tasks

- [x] 1. Create i18n type definitions and constants
  - Create `src/i18n/types.ts` with `SupportedLocale`, `TranslationMap`, `SUPPORTED_LOCALES`, `LOCALE_STORAGE_KEY`, and `DEFAULT_LOCALE`
  - _Requirements: 2.1, 2.3, 7.1_

- [x] 2. Implement LocaleProvider context and useLocale hook
  - [x] 2.1 Create `src/i18n/LocaleContext.tsx` with `LocaleProvider` component
    - Implement `LocaleContextValue` interface (`locale`, `setLocale`, `t`, `isLoading`)
    - Read persisted locale from `localStorage` on init, default to `en` if missing or invalid
    - Fetch locale JSON from `public/locales/{locale}.json` on init and on locale change
    - Implement `t(key)` function: return value if key exists, return key itself as fallback
    - On fetch failure, fall back to English locale file and log error via `console.error`
    - While loading new locale, continue displaying previously loaded translations
    - Persist selected locale to `localStorage` on change
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 7.1, 7.2, 7.3, 8.1, 8.2, 8.3, 8.4_

  - [x] 2.2 Create `src/i18n/useLocale.ts` hook
    - Call `useContext(LocaleContext)` and throw if used outside `LocaleProvider`
    - _Requirements: 2.1_

  - [x] 2.3 Create `src/i18n/index.ts` barrel export for `LocaleProvider`, `useLocale`, and types
    - _Requirements: 2.1_

- [x] 3. Create English locale file with all translatable text
  - [x] 3.1 Create `public/locales/en.json` with dot-notation keys grouped by component
    - Extract all hardcoded text from Header (name, phone, email, linkedin, location)
    - Extract all hardcoded text from Summary (title, paragraph)
    - Extract all hardcoded text from ProfessionalExperience (section title, and for each job entry: title, company, location, dates, description paragraphs, activity list items)
    - Extract all hardcoded text from Technologies (section title, category titles)
    - Extract all hardcoded text from Passions (section title, passion names, descriptions)
    - Extract all hardcoded text from ProudOf (section title, achievement text, detail text, open source text, URL)
    - Extract all hardcoded text from DownloadButton (button labels, status messages, error messages, long operation messages)
    - Include toolbar/language selector keys (`toolbar.languageSelector.en`, `toolbar.languageSelector.es`, `toolbar.languageSelector.ariaLabel`)
    - _Requirements: 1.1, 1.3, 1.4_

- [x] 4. Create Spanish locale file
  - [x] 4.1 Create `public/locales/es.json` with the same key set as `en.json`
    - Translate all section titles and descriptive text to Spanish
    - Use formal Spanish ("usted" form) for professional tone
    - Preserve proper nouns, company names, technology names, and URLs without translation
    - _Requirements: 1.2, 1.5, 6.1, 6.2, 6.3, 6.4_

- [x] 5. Checkpoint - Verify locale files and context
  - Ensure all tests pass, ask the user if questions arise.

- [ ]\* 6. Write property tests for locale files and translation function
  - [ ]\* 6.1 Write property test for locale key structure
    - **Property 1: Locale key structure**
    - Verify all keys in each locale file match the dot-notation pattern `{componentName}.{path}` where componentName is one of: `header`, `summary`, `professionalExperience`, `technologies`, `passions`, `proudOf`, `downloadButton`, `toolbar`
    - **Validates: Requirements 1.3**

  - [ ]\* 6.2 Write property test for locale key set equality
    - **Property 2: Locale key set equality**
    - Load both `en.json` and `es.json`, verify they contain exactly the same set of keys
    - **Validates: Requirements 1.5**

  - [ ]\* 6.3 Write property test for translation function correctness
    - **Property 3: Translation function correctness**
    - Generate random translation maps and random keys (present and absent), verify `t()` returns the correct value or the key itself as fallback
    - **Validates: Requirements 2.2, 2.5**

  - [ ]\* 6.4 Write property test for locale persistence round-trip
    - **Property 4: Locale persistence round-trip**
    - Generate random supported locale values, write to mock `localStorage`, read back, verify equality
    - **Validates: Requirements 7.1, 7.2**

- [x] 7. Extract text from components using translation function
  - [x] 7.1 Update Header component to use `t()` for all text
    - Import `useLocale` hook, replace hardcoded name, phone, email, linkedin URL, and location with `t()` calls
    - _Requirements: 5.1_

  - [x] 7.2 Update Summary component to use `t()` for all text
    - Replace hardcoded title and paragraph text with `t()` calls
    - _Requirements: 5.2_

  - [x] 7.3 Update ProfessionalExperience component to use `t()` for all text
    - Replace section title, all job entry titles, company names, dates, locations, descriptions, and activity items with `t()` calls
    - Update `ProfessionalExperienceEntry` to accept translated strings (it already receives props, so callers pass translated values)
    - _Requirements: 5.3_

  - [x] 7.4 Update Technologies component to use `t()` for all text
    - Replace section title and all category titles with `t()` calls
    - _Requirements: 5.4_

  - [x] 7.5 Update Passions component to use `t()` for all text
    - Replace section title, passion names, and descriptions with `t()` calls
    - _Requirements: 5.5_

  - [x] 7.6 Update ProudOf component to use `t()` for all text
    - Replace section title, achievement text, detail text, open source text, and URL with `t()` calls
    - _Requirements: 5.6_

  - [x] 7.7 Update DownloadButton component to use `t()` for all text
    - Replace button labels ("Download PDF", "Generating PDF...", "Downloaded!"), retry text ("Try Again"), error messages, and long operation messages with `t()` calls
    - _Requirements: 5.7_

- [x] 8. Checkpoint - Verify component text extraction
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Create Toolbar and LanguageSelector components
  - [x] 9.1 Create `src/components/Toolbar/Toolbar.tsx`
    - Render as a fixed bar at the top of the page with `bg-blue-50` background
    - Add `data-hide-for-print` attribute to hide during PDF generation
    - Set high `z-index` to stay above scrolling content
    - Arrange `LanguageSelector` and `DownloadButton` horizontally with appropriate spacing
    - Accept `targetRef` and `pdfFilename` props to pass through to `DownloadButton`
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [x] 9.2 Create `src/components/LanguageSelector/LanguageSelector.tsx`
    - Render EN and ES buttons using `useLocale` hook
    - Visually indicate the active locale (e.g., bold/filled background on active button)
    - Call `setLocale()` on click
    - Make buttons keyboard accessible with `aria-label` and `aria-pressed` attributes
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x] 9.3 Export new components from `src/components/index.ts`
    - Add exports for `Toolbar` and `LanguageSelector`
    - _Requirements: 3.3, 4.1_

- [x] 10. Wire everything together in App.tsx
  - [x] 10.1 Wrap the app with `LocaleProvider` in `App.tsx`
    - Import and wrap the root content with `<LocaleProvider>`
    - _Requirements: 2.1, 2.4_

  - [x] 10.2 Replace the existing `DownloadButton` wrapper with the new `Toolbar` component
    - Remove the current `data-hide-for-print` div and standalone `DownloadButton`
    - Add `<Toolbar>` component passing `targetRef` and filename
    - Add top padding to the resume content container to account for the fixed toolbar height
    - _Requirements: 3.1, 3.2, 3.3, 3.5_

- [x] 11. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- The design uses TypeScript throughout, so all implementation uses TypeScript/React
- Technology names, company names, proper nouns, and URLs are not translated in the Spanish locale file
