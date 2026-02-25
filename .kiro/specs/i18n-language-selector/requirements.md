# Requirements Document

## Introduction

This feature adds internationalization (i18n) support to the portfolio/resume website. All hardcoded text currently embedded in React components (Header, Summary, ProfessionalExperience, Technologies, Passions, ProudOf, and DownloadButton) will be extracted into structured JSON locale files. The system will support English and Spanish, with a visible language selector that allows users to switch languages and re-render the entire page in the selected language.

## Glossary

- **Locale_Store**: The centralized state management module (React Context) that holds the current locale and provides translation functions to all components
- **Language_Selector**: A visible UI component that allows the user to switch between supported languages
- **Locale_File**: A JSON file containing all translatable text strings for a specific language, keyed by a dot-notation path
- **Translation_Function**: A function (commonly named `t`) that accepts a translation key and returns the corresponding string for the active locale
- **Resume_App**: The React-based portfolio/resume single-page application
- **Supported_Locale**: A language code representing a supported translation, initially `en` (English) and `es` (Spanish)
- **Toolbar_Container**: A small fixed header bar at the top of the page with a white-blue background that groups interactive controls (Language_Selector and DownloadButton) separately from the resume content

## Requirements

### Requirement 1: Locale File Structure

**User Story:** As a developer, I want all translatable text extracted into JSON locale files, so that translations are centralized and easy to maintain.

#### Acceptance Criteria

1. THE Resume_App SHALL store English translations in a `public/locales/en.json` Locale_File
2. THE Resume_App SHALL store Spanish translations in a `public/locales/es.json` Locale_File
3. THE Locale_File SHALL organize translation keys using dot-notation grouped by component name (e.g., `header.name`, `summary.title`, `professionalExperience.title`)
4. THE Locale_File SHALL contain entries for every user-visible text string currently hardcoded in the Header, Summary, ProfessionalExperience, Technologies, Passions, ProudOf, and DownloadButton components
5. WHEN a new Locale_File is added, THE Locale_File SHALL contain the same set of keys as every other Locale_File

### Requirement 2: Locale State Management

**User Story:** As a developer, I want a centralized locale state, so that all components can reactively access the current language and translation strings.

#### Acceptance Criteria

1. THE Locale_Store SHALL provide the current Supported_Locale to all components via React Context
2. THE Locale_Store SHALL provide a Translation_Function that accepts a dot-notation key and returns the translated string for the active locale
3. THE Locale_Store SHALL default to English (`en`) as the initial locale
4. WHEN the active locale changes, THE Locale_Store SHALL trigger a re-render of all components that consume translated text
5. IF the Translation_Function receives a key that does not exist in the active Locale_File, THEN THE Translation_Function SHALL return the key itself as a fallback

### Requirement 3: Toolbar Container

**User Story:** As a site visitor, I want the language selector and download button grouped together in a small toolbar at the top of the page, so that interactive controls are clearly separated from the resume content and easy to find.

#### Acceptance Criteria

1. THE Toolbar_Container SHALL be rendered as a fixed small header bar at the top of the page, above the resume content
2. THE Toolbar_Container SHALL have a white-blue background (e.g., `bg-blue-50` or equivalent light blue-white gradient)
3. THE Toolbar_Container SHALL contain the Language_Selector and the DownloadButton as its children
4. THE Toolbar_Container SHALL arrange the Language_Selector and DownloadButton horizontally with appropriate spacing
5. THE Toolbar_Container SHALL be hidden during PDF generation (marked with `data-hide-for-print`), ensuring all child elements are also hidden
6. THE Toolbar_Container SHALL have a z-index high enough to remain visible above other page content when scrolling

### Requirement 4: Language Selector Component

**User Story:** As a site visitor, I want a visible language selector on the page, so that I can switch between English and Spanish.

#### Acceptance Criteria

1. THE Language_Selector SHALL be placed inside the Toolbar_Container alongside the DownloadButton
2. THE Language_Selector SHALL display the available Supported_Locales (English and Spanish)
3. THE Language_Selector SHALL visually indicate which locale is currently active
4. WHEN the user selects a different locale, THE Language_Selector SHALL update the Locale_Store with the selected Supported_Locale
5. THE Language_Selector SHALL be keyboard accessible and include appropriate ARIA attributes for screen readers

### Requirement 5: Component Text Extraction

**User Story:** As a developer, I want all hardcoded text replaced with translation function calls, so that every component renders text from the active locale.

#### Acceptance Criteria

1. THE Header component SHALL render all text (name, contact labels, location) using the Translation_Function
2. THE Summary component SHALL render its title and paragraph text using the Translation_Function
3. THE ProfessionalExperience component SHALL render all job titles, company names, dates, locations, and description text using the Translation_Function
4. THE Technologies component SHALL render section titles and category titles using the Translation_Function
5. THE Passions component SHALL render section title, passion names, and descriptions using the Translation_Function
6. THE ProudOf component SHALL render section title, achievement descriptions, and link text using the Translation_Function
7. THE DownloadButton component SHALL render button labels, status messages, and error messages using the Translation_Function

### Requirement 6: Spanish Translations

**User Story:** As a Spanish-speaking visitor, I want to read the resume in Spanish, so that I can understand the content in my preferred language.

#### Acceptance Criteria

1. THE Spanish Locale_File SHALL contain accurate Spanish translations for all section titles (e.g., "Summary" → "Resumen", "Professional Experience" → "Experiencia Profesional")
2. THE Spanish Locale_File SHALL contain Spanish translations for all descriptive and narrative text
3. THE Spanish Locale_File SHALL preserve proper nouns, company names, technology names, and URLs without translation
4. THE Spanish Locale_File SHALL use formal Spanish ("usted" form) for professional tone consistency

### Requirement 7: Locale Persistence

**User Story:** As a returning visitor, I want my language preference remembered, so that I do not have to re-select my language each time I visit.

#### Acceptance Criteria

1. WHEN the user selects a locale, THE Locale_Store SHALL persist the selected Supported_Locale to browser localStorage
2. WHEN the Resume_App loads, THE Locale_Store SHALL read the persisted locale from localStorage and apply it as the active locale
3. IF no persisted locale exists in localStorage, THEN THE Locale_Store SHALL default to English (`en`)

### Requirement 8: Locale File Loading

**User Story:** As a developer, I want locale files loaded efficiently, so that the application remains fast and responsive.

#### Acceptance Criteria

1. WHEN the Resume_App initializes, THE Locale_Store SHALL load the active Locale_File
2. WHEN the user switches locale, THE Locale_Store SHALL load the corresponding Locale_File
3. WHILE a Locale_File is loading, THE Resume_App SHALL continue displaying the previously loaded translations until the new Locale_File is ready
4. IF a Locale_File fails to load, THEN THE Locale_Store SHALL fall back to the English Locale_File and display an error in the browser console
