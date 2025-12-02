# Project Architecture

The project follows a modular Angular architecture with a clear separation between logic, components, and data.

## ⛓️ Main Structure

- **core/** → services, models, utility functions
- **features/** → functional modules (champions, items, runes)
- **shared/** → reusable components
- **app/** → main configuration and root component

## 🧩 app/

### app.ts

Root component of the application.

### app.routes.ts

Defines main routes:

- /champions
- /items
- /runes

### app.config.ts

Configures the router and providers.

## 🔧 core/

### models/

TypeScript models for typing:

- champions
- items
- runes

### services/

`lol-api.service.ts` handles:

- data retrieval
- normalization
- optional caching
- separation of UI and business logic

## 🧱 features/

Each feature section includes:

- list view
- detail view
- dedicated service
- `.spec.ts` tests

## 🧩 shared/

### navbar/

Main navigation component.

### footer/

Global footer component.

### pipes/

Custom pipes, e.g., `format-ability-text.pipe.ts`.

## 🎯 Key Principles

- Modularity
- Separation of concerns
- Scalability
- Testability
