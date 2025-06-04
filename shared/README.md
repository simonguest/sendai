# Shared Types and Internationalization

This directory contains shared types, constants, and internationalization content used across the renderer and shell projects in the monorepo.

## Structure

```
shared/
├── i18n/                    # Internationalization content
│   ├── types.ts            # Locale and text direction types
│   ├── locales.ts          # Locale configuration and metadata
│   ├── labels/             # Translation labels organized by domain
│   │   ├── navigation.ts   # Navigation menu labels
│   │   ├── notebooks.ts    # Notebook-related labels
│   │   ├── settings.ts     # Settings page labels
│   │   └── themes.ts       # Theme display labels
│   └── index.ts            # Convenience re-exports
├── theme/                   # Theme configuration
│   ├── types.ts            # Theme types and constants
│   └── index.ts            # Convenience re-exports
├── schemas/                 # Data schemas (e.g., notebook.ts)
└── types.ts                # Backward compatibility re-exports
```

## Usage

### Recommended Imports (New Code)

For new code, import directly from the specific modules:

```typescript
// Internationalization
import { Locale, DEFAULT_LOCALE } from '@shared/i18n/types';
import { LOCALE_METADATA } from '@shared/i18n/locales';
import { SETTINGS_LABELS } from '@shared/i18n/labels/settings';
import { NAV_LABELS } from '@shared/i18n/labels/navigation';

// Or use the convenience re-export
import { Locale, SETTINGS_LABELS, NAV_LABELS } from '@shared/i18n';

// Theming
import { Theme, DEFAULT_THEME } from '@shared/theme/types';
// Or use the convenience re-export
import { Theme, DEFAULT_THEME } from '@shared/theme';
```

### Backward Compatibility (Existing Code)

Existing imports continue to work unchanged:

```typescript
import { Theme, Locale, SETTINGS_LABELS, NAV_LABELS } from '@shared/types';
```

## Benefits

- **Clear organization**: i18n content is separate from theme configuration
- **Better maintainability**: Translators can focus on specific label files
- **Tree-shaking friendly**: Import only what you need
- **Scalable**: Easy to add new label categories
- **Type safety**: Maintained across all files

## Adding New Translations

1. **New label category**: Create a new file in `shared/i18n/labels/`
2. **New locale**: Add to `LOCALE_OPTIONS` in `shared/i18n/types.ts` and update all label files
3. **New labels**: Add to the appropriate file in `shared/i18n/labels/`

## Migration Guide

To gradually migrate existing code to use the new structure:

1. Replace imports from `@shared/types` with specific imports from `@shared/i18n` or `@shared/theme`
2. Update your IDE to use the new import paths for better tree-shaking
3. The old `@shared/types` import will continue to work during the transition
