# AGENTS.md

This file provides context and guidelines for AI coding agents working on this Next.js template project.

## Commands

### Development

```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production with Turbopack
npm run start        # Start production server (after build)
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Pre-commit Hooks

- Husky automatically runs `lint` and `format` on staged files before commit
- Configured via lint-staged in package.json

## Project Structure

```
next-js-template/
├── .claude/              # Claude Code configuration
│   └── context/          # Context documents (Japanese)
├── .husky/               # Git hooks
├── public/               # Static assets
├── rule/                 # Development guidelines (Japanese)
│   ├── rule.md          # Main coding standards
│   └── api-design.md    # API design guidelines
└── src/
    ├── app/              # Next.js App Router
    │   ├── layout.tsx   # Root layout
    │   ├── page.tsx     # Home page
    │   └── globals.css  # Global styles
    ├── components/       # Shared components
    │   ├── ui/          # UI components (no business logic)
    │   └── layout/      # Layout components
    ├── features/         # Feature-based modules
    │   └── home/        # Home feature
    ├── hooks/            # Custom React hooks
    ├── lib/              # Library code
    ├── utils/            # Utility functions
    ├── types/            # TypeScript type definitions
    └── constants/        # Constants
```

### Key Principles

- **Feature-based architecture**: Organize by feature in `src/features/`
- **UI vs Feature components**: Generic UI in `components/ui/`, feature-specific in `features/{name}/components/`
- **App Router**: Routes in `src/app/` using Next.js 16 App Router conventions

## Testing

Currently, no test framework is configured. When adding tests:

- Place test files adjacent to source files: `Component.test.tsx`
- Use `npm test` command (to be configured)

## Code Style

### Naming Conventions

| Type            | Convention             | Example                 |
| --------------- | ---------------------- | ----------------------- |
| Components      | PascalCase             | `UserProfile.tsx`       |
| Hooks           | camelCase + use prefix | `useAuth.ts`            |
| Utils           | camelCase              | `formatDate.ts`         |
| Types           | PascalCase             | `User.types.ts`         |
| Constants       | UPPER_SNAKE_CASE       | `API_BASE_URL`          |
| App directories | kebab-case             | `user-profile/page.tsx` |

### File Organization

**MUST:**

- Always read files before modifying them
- Place UI components in `src/components/ui/`
- Place feature code in `src/features/{feature-name}/`
- Use `@/` path alias for imports from `src/`
- Avoid deep nesting (max 7 levels)
- Keep files under 200 lines when possible

**MUST NOT:**

- Put all code directly in `src/app/`
- Use `any` type (use `unknown` if necessary)
- Hardcode API keys or secrets
- Leave `console.log` in production code
- Use relative paths excessively

### TypeScript

- **Strict mode enabled**: All TypeScript strict checks active
- **No any**: Use proper types or `unknown` with type guards
- **Type imports**: Use `import type` for type-only imports
- **Interface over type**: Prefer interfaces for object shapes

### Component Patterns

**Server Components (default):**

- Data fetching
- SEO-critical content
- Static UI

**Client Components (`"use client"`):**

- Interactive UI
- Browser APIs
- State management

## Git Workflow

### Branch Strategy

- Main branch: `main` (or as specified in project)
- Feature branches: `feature/description` or `claude/description-{sessionId}`

### Commit Messages

Format: `<type>: <description>`

Types:

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Test additions/modifications
- `chore`: Build process or tooling changes

Examples:

```
feat: add user authentication
fix: resolve hydration error in header
docs: update API design guidelines
```

### Pre-commit Checks

- ESLint runs automatically via Husky
- Prettier formats code automatically
- Fix any errors before committing

## Boundaries & Constraints

### Technology Stack (DO NOT CHANGE)

- Next.js 16.0.3 with App Router
- React 19.1.0
- TypeScript 5
- Tailwind CSS 4
- Turbopack for dev/build

### Security Rules

**NEVER:**

- Commit secrets, API keys, or credentials
- Use user input without validation
- Skip sanitization of dynamic content

**ALWAYS:**

- Use environment variables for secrets (`.env.local`)
- Validate and sanitize user input
- Use `NEXT_PUBLIC_` prefix for client-exposed env vars

### Performance Requirements

**Required:**

- Use Next.js `<Image>` component for images
- Implement dynamic imports for large components
- Use `React.memo`, `useMemo`, `useCallback` appropriately
- Optimize fonts with `next/font`

### Documentation

Primary documentation is in **Japanese** in these locations:

- `.claude/context/` - Claude Code specific context
- `rule/rule.md` - Main coding standards
- `rule/api-design.md` - API design guidelines

When in doubt, refer to these documents or ask for clarification.

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- Internal: See `rule/rule.md` for detailed conventions

---

**Last Updated**: 2025-11-22
**Template Version**: 1.0.0
