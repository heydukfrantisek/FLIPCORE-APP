# FLIPCORE — Architecture

## 1. Purpose

FLIPCORE is an internal system for managing PC flipping operations.

The system should allow the user to quickly answer:

- What components are currently available?
- What PC can be built from current inventory?
- What is the real cost of a build?
- What selling price is reasonable?
- What profit and margin can be expected?
- Which builds and components have already been sold?

The architecture is designed to remain extensible as inventory, finance, listings, AI assistance, and administration grow.

## 2. Core Domains

### Inventory

Tracks physical PC components and their lifecycle.

Typical concepts:

- Component
- Component category
- Inventory item
- Purchase cost
- Availability
- Reservation
- Usage in a build
- Sale

A physical inventory item must not be consumed by more than one build.

Recommended lifecycle:

`AVAILABLE → RESERVED → USED → SOLD`

### Builds

Represents a PC assembled from inventory.

A build contains:

- selected physical components
- calculated acquisition cost
- expected selling price
- actual selling price
- expected profit
- actual profit
- build status

Build calculations must use server-side business logic rather than UI calculations.

### Finance

Finance records the economic result of purchases and sales.

Important values:

- purchase cost
- build cost
- additional expenses
- asking price
- actual sale price
- gross profit
- net profit
- margin percentage

Financial calculations should be centralized and reusable.

### Listings

Listings represent advertisements for builds or components.

The listing domain should remain independent from presentation channels such as Bazoš or Facebook Marketplace so additional channels can be added later.

### Administration

Administration controls:

- users
- roles
- permissions
- dictionaries
- margin rules
- application configuration

Authorization must be enforced server-side.

### AI

AI assistance is an application service, not the source of truth.

AI may:

- recommend builds
- estimate pricing
- help identify components
- generate listing copy
- analyze expected profitability

AI output must not bypass validation or core business rules.

## 3. Architectural Principles

### Server is authoritative

The client must never be trusted for:

- prices
- inventory availability
- ownership
- permissions
- profit calculations
- state transitions

All important business rules are validated on the server.

### Domain logic is separate from UI

React components should handle presentation and interaction.

Business calculations and state transitions belong in reusable server/domain modules.

### Validate boundaries

External input should be validated with Zod before entering business logic.

This includes:

- forms
- API requests
- route parameters
- imported data
- AI-generated structured data

### Prefer incremental change

Existing functionality should be preserved unless there is a concrete reason to replace it.

Avoid unnecessary rewrites and dependencies.

## 4. Data Model Direction

The target conceptual model is:

`User`
→ manages → `InventoryItem`

`InventoryItem`
→ belongs to → `Component`

`Build`
→ contains → `BuildComponent`

`BuildComponent`
→ references → `InventoryItem`

`Build`
→ may produce → `Listing`

`Build`
→ may result in → `Sale`

`Sale`
→ contributes to → `Finance`

The exact Prisma schema is the implementation source of truth and must be inspected before adding or changing models.

## 5. Application Layers

The preferred separation is:

### Presentation

- Next.js App Router
- React Server Components
- Client Components where interaction requires them
- reusable UI components
- forms and validation feedback

### Application

Coordinates use cases such as:

- creating inventory
- reserving components
- creating a build
- calculating a build price
- completing a sale

### Domain / Business Logic

Contains rules that must remain independent of presentation.

Examples:

- inventory state transitions
- build cost calculation
- profit calculation
- margin rules
- compatibility rules

### Infrastructure

Contains integrations with:

- Prisma
- PostgreSQL
- authentication
- external listing channels
- AI providers

## 6. API and Server Actions

Use Server Actions for appropriate application mutations.

Use Route Handlers when an HTTP API endpoint is required.

Every mutation should:

1. validate input
2. authenticate the user
3. authorize the operation
4. load authoritative database state
5. execute business rules
6. persist the transaction
7. return a typed result

## 7. Database Integrity

Database operations involving inventory and sales should be transactional where multiple records must change together.

Examples:

- reserving multiple components
- creating a build from inventory
- marking components as used
- completing a sale

The system must avoid partial state changes.

## 8. Compatibility

PC build compatibility should eventually cover at least:

- CPU ↔ motherboard socket
- motherboard ↔ RAM generation
- RAM capacity and supported configuration
- GPU physical considerations
- PSU capacity
- case form factor
- storage interface
- cooler compatibility

Compatibility rules should be implemented as reusable domain logic rather than scattered through UI components.

## 9. Pricing and Margin Engine

Pricing should be configurable.

A future margin engine may consider:

- total acquisition cost
- target margin
- minimum profit
- component age
- market price
- build quality
- demand
- additional expenses

The UI should consume pricing results rather than reproduce the calculation.

## 10. Security

Never commit:

- API keys
- database passwords
- session secrets
- external service credentials

Use environment variables and keep secrets server-side.

All privileged operations require server-side authorization.

## 11. Testing Strategy

Priority testing areas:

1. inventory state transitions
2. build cost calculations
3. profit calculations
4. margin calculations
5. compatibility rules
6. authorization
7. important API/server mutations

Tests should focus especially on business rules and edge cases.

## 12. Observability and Errors

Errors should be explicit and actionable.

Avoid silently swallowing exceptions.

Production errors should provide enough context for diagnosis without exposing secrets or sensitive data.

## 13. Evolution

The architecture should support future additions without requiring a rewrite of the core system.

Potential future modules:

- AI build assistant
- automated market-price collection
- Bazoš integration
- Facebook Marketplace workflows
- barcode/QR inventory
- purchase history
- supplier tracking
- advanced analytics
- notifications
- automated profitability alerts

New modules should integrate through existing domain/application boundaries rather than directly coupling UI components to infrastructure.

## 14. Decision Rule for Codex

Before making an architectural change, Codex should:

1. inspect the current implementation
2. identify existing patterns
3. prefer reuse over duplication
4. identify database and business-rule impact
5. implement the smallest production-quality change
6. run relevant validation
7. document significant architectural decisions

When the current repository differs from this document, the actual working code and explicit project requirements take precedence. Significant deviations should be documented rather than silently ignored.
