# Portfolio Design Improvements - Test Suite

This directory contains property-based tests and unit tests for the portfolio design improvements feature.

## Test Files

### `colorContrast.test.ts`
Property-based tests for color contrast compliance (WCAG AA standards).

**Property 1: Color Contrast Compliance**
- Validates Requirements 1.3, 10.1, 10.2
- Tests that all text/background color combinations meet WCAG AA standards
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text (≥18px or ≥14px bold)

**Test Coverage:**
- ✅ Common text/background combinations used in the application
- ✅ Random color combinations (100 iterations)
- ✅ Primary colors on white background
- ✅ Secondary colors on white background
- ✅ Text colors on sidebar background (primary-50/100)
- ✅ Large text contrast requirements
- ✅ Bold text contrast requirements

### `setup.ts`
Test environment setup file that configures jsdom and testing-library.

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test

# Run tests once (CI mode)
npm run test:run

# Run tests with UI
npm run test:ui
```

## Key Findings

### Color Contrast Analysis

The property-based tests revealed important findings about color usage:

1. **primary-600 (#0284c7)** has a contrast ratio of 4.10:1 on white background
   - ❌ Does NOT meet 4.5:1 requirement for normal text
   - ✅ DOES meet 3:1 requirement for large text (≥18px)
   - **Recommendation:** Use primary-700 or darker for normal-sized text

2. **primary-700 and darker** all meet WCAG AA standards for normal text
   - primary-700: 5.93:1 ✅
   - primary-800: 7.56:1 ✅
   - primary-900: 9.46:1 ✅

3. **All secondary colors (600-900)** meet WCAG AA standards for normal text

See [COLOR_CONTRAST_GUIDELINES.md](./COLOR_CONTRAST_GUIDELINES.md) for detailed usage guidelines.

## Testing Framework

- **Vitest**: Fast unit test framework
- **fast-check**: Property-based testing library
- **@testing-library/react**: React component testing utilities
- **jsdom**: DOM implementation for Node.js

## Property-Based Testing

Property-based tests use `fast-check` to generate random inputs and verify that properties hold across all valid executions. Each property test runs a minimum of 100 iterations to ensure comprehensive coverage.

### Benefits of Property-Based Testing

1. **Comprehensive Coverage**: Tests many more scenarios than hand-written examples
2. **Edge Case Discovery**: Automatically finds edge cases you might not think of
3. **Specification Verification**: Ensures properties hold universally, not just for specific examples
4. **Regression Prevention**: Once a property is defined, it's tested forever

## Adding New Tests

When adding new design properties to test:

1. Create a new test file or add to existing file
2. Use the property annotation format:
   ```typescript
   /**
    * **Feature: portfolio-design-improvements, Property X: Property Name**
    * **Validates: Requirements X.X, Y.Y**
    * 
    * Property description...
    */
   ```
3. Use `fc.assert()` with `fc.property()` for property-based tests
4. Set `numRuns: 100` or higher for thorough testing
5. Document findings in guidelines or README files

## Continuous Integration

These tests should be run:
- Before every commit (pre-commit hook)
- In CI/CD pipeline
- Before deploying to production

All tests must pass before merging code changes.
