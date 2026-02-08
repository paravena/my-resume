# Color Contrast Guidelines

This document provides guidelines for using colors in the portfolio application to ensure WCAG AA accessibility compliance.

## WCAG AA Standards

- **Normal text** (< 18px or < 14px bold): Minimum contrast ratio of **4.5:1**
- **Large text** (≥ 18px or ≥ 14px bold): Minimum contrast ratio of **3:1**

## Color Palette Contrast Ratios

### Primary Colors on White Background

| Color | Hex | Contrast Ratio | Normal Text | Large Text |
|-------|-----|----------------|-------------|------------|
| primary-600 | #0284c7 | 4.10:1 | ❌ Fails | ✅ Passes |
| primary-700 | #0369a1 | 5.93:1 | ✅ Passes | ✅ Passes |
| primary-800 | #075985 | 7.56:1 | ✅ Passes | ✅ Passes |
| primary-900 | #0c4a6e | 9.46:1 | ✅ Passes | ✅ Passes |

### Secondary Colors on White Background

All secondary colors from 600-900 meet WCAG AA standards for normal text.

| Color | Hex | Contrast Ratio | Normal Text | Large Text |
|-------|-----|----------------|-------------|------------|
| secondary-600 | #475569 | 8.59:1 | ✅ Passes | ✅ Passes |
| secondary-700 | #334155 | 12.63:1 | ✅ Passes | ✅ Passes |
| secondary-800 | #1e293b | 15.96:1 | ✅ Passes | ✅ Passes |
| secondary-900 | #0f172a | 18.67:1 | ✅ Passes | ✅ Passes |

### Text on Sidebar Background (primary-50 and primary-100)

Both primary-50 (#f0f9ff) and primary-100 (#e0f2fe) are very light backgrounds that work well with dark text colors.

**Recommended text colors for sidebar:**
- secondary-700 or darker
- secondary-800 (recommended for body text)
- secondary-900 (recommended for headings)

## Usage Guidelines

### For Normal Text (16px)

✅ **DO USE:**
- `text-primary-700` or darker on white backgrounds
- `text-secondary-700` or darker on white backgrounds
- `text-secondary-700` or darker on sidebar backgrounds (primary-50/100)

❌ **DON'T USE:**
- `text-primary-600` on white backgrounds for normal text
- `text-primary-500` or lighter for any text
- `text-secondary-600` or lighter for normal text

### For Large Text (≥18px) or Headings

✅ **DO USE:**
- `text-primary-600` or darker on white backgrounds
- `text-primary-700` or darker (recommended for better contrast)
- `text-secondary-600` or darker

### For Links

**Option 1: Use darker shades for normal-sized links**
```tsx
<a className="text-primary-700 hover:text-primary-800">Link</a>
```

**Option 2: Use primary-600 for large links (≥18px)**
```tsx
<a className="text-lg text-primary-600 hover:text-primary-700">Large Link</a>
```

**Option 3: Use underline to enhance visibility**
```tsx
<a className="text-primary-600 underline hover:text-primary-700">Link with underline</a>
```

### For Headings

```tsx
// Large headings (h1, h2)
<h1 className="text-h1 text-secondary-900">Main Heading</h1>
<h2 className="text-h2 text-primary-700">Section Heading</h2>

// Smaller headings (h3)
<h3 className="text-h3 text-secondary-800">Subsection</h3>
```

### For Body Text

```tsx
// Main body text
<p className="text-body text-secondary-700">Body content</p>

// Emphasized text
<p className="text-body text-secondary-800">Important content</p>

// Captions or metadata
<span className="text-body-sm text-secondary-600">Caption text</span>
```

## Testing

The color contrast compliance is verified through property-based tests in `src/test/colorContrast.test.ts`. These tests:

1. Verify all common text/background combinations meet WCAG AA standards
2. Test random color combinations to ensure the contrast calculation is correct
3. Validate specific color usage patterns (primary on white, secondary on white, text on sidebar)
4. Verify large text and bold text meet the 3:1 minimum requirement

Run tests with:
```bash
npm run test
```

## Resources

- [WCAG 2.0 Contrast Ratio Guidelines](https://www.w3.org/TR/WCAG20/#contrast-ratiodef)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Tailwind CSS Color Palette](https://tailwindcss.com/docs/customizing-colors)
