# Project Configuration Guide

## Files Created

### 1. `.gitignore` - Version Control Exclusions
Ignores sensitive and unnecessary files:
- `node_modules/` - Dependencies
- `.env*` - Environment variables
- `dist/`, `build/` - Build outputs
- Logs, cache files, IDE settings

### 2. `eslint.config.js` - Code Quality & Style Rules
ESLint v9 configuration that enforces:

#### Error Checks (Errors stop the build)
- **no-unused-vars** - Unused variables (with `_` prefix exception)
- **no-undef** - Undefined variables
- **no-extra-semi** - Extra semicolons
- **no-var** - Disallows var keyword (use const/let)
- **prefer-const** - Use const when possible
- **eqeqeq** - Strict equality (=== instead of ==)

#### Style Rules (Formatting)
- **semi** - Require semicolons at end of statements
- **quotes** - Single quotes with escape option
- **indent** - 2 spaces indentation
- **comma-dangle** - Trailing commas in multiline arrays/objects
- **eol-last** - Newline at end of files
- **no-trailing-spaces** - No spaces at line end
- **space-before-function-paren** - Proper spacing before function parentheses
- **object-curly-spacing** - Spaces inside object braces
- **array-bracket-spacing** - No spaces inside array brackets
- **keyword-spacing** - Space after keywords
- **space-infix-ops** - Space around operators

#### Warning Checks (Won't fail build)
- **no-console** - Warns about console usage (except warn, error, log)

#### Structural Rules
- **curly** - Always use curly braces for blocks
- **brace-style** - 1TBS style for braces
- **no-else-return** - No else after return

### 3. `jsconfig.json` - Path Aliases Configuration
Enables import aliases for cleaner imports:

```javascript
// Instead of:
const User = require('../../../models/User');

// You can write:
const User = require('@models/User');
```

#### Available Aliases:
- `@config/*` → `config/`
- `@database/*` → `database/`
- `@models/*` → `models/`
- `@services/*` → `services/`
- `@controllers/*` → `controllers/`
- `@routes/*` → `routes/`
- `@middleware/*` → `middleware/`
- `@utils/*` → `utils/`
- `@` → Root directory

### 4. `.eslintrc.json` - Legacy ESLint Config (Optional)
Backup ESLint configuration in old format (for reference).

## Runtime Alias Support

The `module-alias` package is used for runtime alias support:
- Registered in `server.js` at application startup
- Works with all Node.js require statements
- Enables clean, maintainable import paths

### Server Setup (server.js)
```javascript
require('module-alias/register');
require('module-alias').addAliases({
  '@config': `${__dirname}/config`,
  '@database': `${__dirname}/database`,
  // ... other aliases
});
```

## NPM Scripts

### Linting Commands
```bash
npm run lint        # Check for all lint errors/warnings
npm run lint:fix    # Auto-fix fixable errors
```

### Server Commands
```bash
npm run dev         # Start development server
npm run staging     # Start staging server
npm run prod        # Start production server
```

## How to Use Aliases in Code

### Models
```javascript
const User = require('@models/User');
```

### Services
```javascript
const userService = require('@services/userService');
```

### Controllers
```javascript
const userController = require('@controllers/userController');
```

### Routes
```javascript
const userRoutes = require('@routes/userRoutes');
```

### Middleware
```javascript
const errorHandler = require('@middleware/errorHandler');
```

### Utils
```javascript
const { sendSuccess } = require('@utils/response');
```

### Config
```javascript
const config = require('@config/environment');
```

### Database
```javascript
const { connectDB } = require('@database/connection');
```

## Adding New Files

When adding new modules/files:

1. Create file in appropriate folder
2. No need to update aliases - they work automatically
3. Import using the `@` prefix alias
4. Run `npm run lint:fix` before committing

## Gitignore Structure

```
node_modules/        - Never commit dependencies
.env*                - Never commit secrets
dist/build/          - Never commit build outputs
*.log                - Never commit log files
.DS_Store            - macOS files
.vscode/             - IDE settings
.idea/               - IDE settings
coverage/            - Test coverage reports
.eslintcache         - ESLint cache
```

## Quality Assurance

Before committing code:

1. **Run linter**: `npm run lint`
2. **Fix automatically**: `npm run lint:fix`
3. **Review remaining errors**: Fix manually
4. **Test server**: `npm run dev`
5. **Check .gitignore**: Ensure sensitive files excluded

## IDE Integration (VS Code)

To enable ESLint in VS Code:

1. Install "ESLint" extension
2. Add to `.vscode/settings.json`:
```json
{
  "eslint.validate": [
    "javascript"
  ],
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Best Practices

✅ **DO:**
- Use `const` by default
- Use `===` for equality checks
- Keep lines properly indented (2 spaces)
- Add semicolons at end of statements
- Use trailing commas in multiline objects/arrays
- Import with aliases for cleaner code

❌ **DON'T:**
- Use `var` keyword
- Use unused variables
- Leave trailing spaces
- Mix quote styles
- Use `==` instead of `===`
- Forget semicolons

## Common ESLint Issues & Fixes

| Error | Solution |
|-------|----------|
| `no-unused-vars` | Remove unused variable or prefix with `_` |
| `no-undef` | Add `// eslint-disable-next-line no-undef` or import the global |
| `semi` | Add semicolon at end of line |
| `indent` | Fix to 2 spaces (use editor's auto-format) |
| `comma-dangle` | Add trailing comma in multiline object/array |
| `eol-last` | Add newline at end of file |

Run `npm run lint:fix` to auto-fix most issues!
