# Testing Guide

This document describes the testing strategy and how to execute tests for the Analog Film Exposure Calculator.

## Test Framework

### Technologies

- **Jest** - JavaScript testing framework
- **JSDOM** - JavaScript implementation of web standards for testing DOM manipulation
- **@types/jest** - TypeScript type definitions for better IDE support

### Why Jest?

Jest was chosen for this project because:
1. **Zero configuration** - Works out of the box with minimal setup
2. **Built-in mocking** - Easy to mock DOM elements and browser APIs
3. **Fast and parallel** - Runs tests in parallel for speed
4. **Coverage reports** - Integrated code coverage without additional tools
5. **Great developer experience** - Watch mode, clear error messages, snapshot testing
6. **Industry standard** - Widely used and well-documented

## Test Structure

### Directory Layout

```
analog-exposure-calculator/
├── src/
│   └── script.js          # Source code with exported functions
├── tests/
│   └── calculator.test.js # Unit tests for calculator functions
├── coverage/              # Generated coverage reports (gitignored)
└── jest.config.js         # Jest configuration
```

### Test Categories

#### 1. Unit Tests for Pure Functions

These test the core calculation logic without DOM dependencies:

- `findClosestShutterSpeed()` - Tests logarithmic comparison for shutter speeds
- `findClosestLightSituation()` - Tests EV value matching
- `findClosestFilmSpeed()` - Tests ISO value matching

#### 2. Formula Validation Tests

These verify the mathematical correctness of photography exposure equations:

- **EV Calculation**: `EV = log₂(100 × A² / (ISO × T))`
- **Aperture Calculation**: `A = √(ISO × T × 2^EV / 100)`
- **ISO Calculation**: `ISO = 100 × A² / (T × 2^EV)`
- **Shutter Speed Calculation**: `T = 100 × A² / (ISO × 2^EV)`

Each formula is tested with real-world photography scenarios (Sunny 16 rule, indoor photography, etc.)

#### 3. DOM Manipulation Tests

These test UI-related functions with mocked DOM:

- `showError()` / `hideError()` - Error message display
- `clearField()` / `clearTimeFields()` / `clearEVFields()` / `clearISOFields()` - Field clearing and styling

#### 4. Edge Case Tests

These ensure the calculator handles extreme or unusual values gracefully:

- Very small/large aperture values
- Extreme ISO values
- Boundary conditions for shutter speeds

## Running Tests

### Basic Test Execution

```bash
# Run all tests once
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Watch Mode for Development

Watch mode is ideal during development:

```bash
npm run test:watch
```

Features:
- Automatically re-runs tests when files change
- Interactive menu for filtering tests
- Shows only failed tests after first run
- Press `a` to run all tests
- Press `f` to run only failed tests
- Press `q` to quit

### Coverage Reports

Generate a detailed coverage report:

```bash
npm run test:coverage
```

This creates:
1. **Console output** - Summary of coverage metrics
2. **HTML report** - Detailed line-by-line coverage in `coverage/lcov-report/index.html`
3. **LCOV file** - Machine-readable coverage data in `coverage/lcov.info`

View the HTML report:
```bash
# Open coverage report in browser
open coverage/lcov-report/index.html  # macOS
xdg-open coverage/lcov-report/index.html  # Linux
start coverage/lcov-report/index.html  # Windows
```

## Frontend/UI Testing Strategy

### Current Approach: Unit Tests with Mocked DOM

The current test suite uses JSDOM to mock browser DOM elements. This approach:

**Pros:**
- Fast execution (no browser startup)
- Runs in CI/CD without headless browser
- Easy to integrate with Jest
- Good for testing business logic

**Cons:**
- Cannot test visual rendering
- Cannot test real browser interactions
- Event handling is simplified
- No testing of CSS or layout

### Suggested Approaches for UI Testing

#### Option 1: Manual Testing Checklist (Current Recommendation)

For a simple application like this calculator, manual testing is often sufficient.

**Manual Test Checklist:**
1. Open `dist/index.html` in a browser after building
2. Test each calculation scenario:
   - Calculate EV from aperture, ISO, time
   - Calculate aperture from EV, ISO, time
   - Calculate ISO from EV, aperture, time
   - Calculate shutter speed from EV, aperture, ISO
3. Verify error messages for invalid inputs
4. Test field clearing functionality
5. Verify responsive design on mobile/tablet
6. Test documentation toggle
7. Verify all dropdowns populate correctly

**Testing Known-Good Values:**
```
Example 1 (Sunny 16):
  - Aperture: f/16
  - ISO: 100
  - Time: 1/125s
  - Expected EV: ~15

Example 2 (Indoor):
  - Aperture: f/2.8
  - ISO: 400
  - Time: 1/60s
  - Expected EV: ~7
```

#### Option 2: Playwright or Cypress (For Future)

If you want to add automated browser testing in the future:

**Playwright Setup:**
```bash
npm install --save-dev @playwright/test
npx playwright install
```

**Cypress Setup:**
```bash
npm install --save-dev cypress
npx cypress open
```

**Benefits:**
- Test real browser behavior
- Visual regression testing
- Record test runs
- Test across multiple browsers

**Example Playwright Test:**
```javascript
test('should calculate EV correctly', async ({ page }) => {
  await page.goto('http://localhost:8000');
  
  // Fill in known values
  await page.selectOption('#aperture', '16');
  await page.selectOption('#isoFilm', '100');
  await page.selectOption('#timeShutter', '0.008'); // 1/125s
  
  // Click calculate
  await page.click('button:has-text("Calculate")');
  
  // Check result
  const ev = await page.textContent('#evDisplay');
  expect(parseFloat(ev)).toBeCloseTo(15, 0);
});
```

#### Option 3: Testing Library (React Testing Library style)

For better DOM testing without a full browser:

```bash
npm install --save-dev @testing-library/dom @testing-library/jest-dom
```

This provides better DOM querying and assertions while still using JSDOM.

## Continuous Integration

### GitHub Actions Integration

To run tests in GitHub Actions, add this to your workflow:

```yaml
- name: Run tests
  run: npm test

- name: Run tests with coverage
  run: npm run test:coverage

- name: Upload coverage to Codecov (optional)
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

### Pre-commit Hooks (Optional)

Install Husky to run tests before commits:

```bash
npm install --save-dev husky
npx husky install
npx husky add .git/hooks/pre-commit "npm test"
```

## Writing New Tests

### Test File Template

```javascript
describe('Feature Name', () => {
  describe('Function Name', () => {
    test('should do something specific', () => {
      // Arrange - Set up test data
      const input = 'test input';
      
      // Act - Execute the function
      const result = functionToTest(input);
      
      // Assert - Verify the result
      expect(result).toBe('expected output');
    });
  });
});
```

### Best Practices

1. **Test one thing per test** - Each test should verify a single behavior
2. **Use descriptive names** - Test names should explain what they verify
3. **Follow AAA pattern** - Arrange, Act, Assert
4. **Test edge cases** - Don't just test happy paths
5. **Keep tests independent** - Tests should not depend on each other
6. **Mock external dependencies** - Use mocks for DOM, APIs, etc.

### Mocking DOM Elements

When testing functions that manipulate DOM:

```javascript
beforeEach(() => {
  // Set up DOM before each test
  document.body.innerHTML = `
    <input id="testInput" value="" />
    <div id="testOutput"></div>
  `;
});

afterEach(() => {
  // Clean up after each test
  document.body.innerHTML = '';
});

test('should update output when input changes', () => {
  const input = document.getElementById('testInput');
  const output = document.getElementById('testOutput');
  
  input.value = 'test value';
  updateOutput(); // Your function
  
  expect(output.textContent).toBe('test value');
});
```

## Troubleshooting

### Common Issues

**Issue: Tests fail with "Cannot read properties of null"**
- **Cause**: DOM elements not mocked before module loads
- **Solution**: Set up `document.body.innerHTML` before requiring the module

**Issue: Event listeners not firing**
- **Cause**: JSDOM doesn't fully implement browser events
- **Solution**: Call the function directly or use `@testing-library/dom`

**Issue: Coverage is lower than expected**
- **Cause**: Event handlers and UI code are hard to test in JSDOM
- **Solution**: This is expected. Focus on testing business logic thoroughly.

**Issue: Tests are slow**
- **Cause**: Too many DOM manipulations or synchronous I/O
- **Solution**: Mock heavy operations, use `jest.mock()` for modules

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [JSDOM Documentation](https://github.com/jsdom/jsdom)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Playwright Documentation](https://playwright.dev) (for future UI testing)
- [Cypress Documentation](https://docs.cypress.io) (for future UI testing)

## Future Improvements

Potential testing enhancements:

1. **Add E2E tests** with Playwright or Cypress
2. **Visual regression testing** to catch UI changes
3. **Performance testing** for calculation speed
4. **Accessibility testing** with jest-axe
5. **Integration with CI/CD** coverage tracking (Codecov/Coveralls)
6. **Mutation testing** with Stryker to verify test quality
