# DigiDukan Optimization Proposal: Offline-First Architecture

> **Author:** Technical Design Document
> **Status:** Proposal
> **Target:** Production Enhancement for Unreliable Network Environments

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Problem Statement](#problem-statement)
3. [Proposed Solution](#proposed-solution)
4. [Technical Architecture](#technical-architecture)
5. [Why This Approach Works](#why-this-approach-works)
6. [Alternative Solutions Considered](#alternative-solutions-considered)
7. [Implementation Details](#implementation-details)
8. [Risk Analysis](#risk-analysis)
9. [Success Metrics](#success-metrics)

---

## Executive Summary

This document proposes implementing **offline-first capabilities** and **intelligent data caching** for the DigiDukan shop management system. The goal is to ensure reliable operation in environments with unreliable internet connectivity while significantly improving application performance.

### Key Outcomes
- **Work without internet** - Full read/write capability offline
- **5x faster page loads** - From cache instead of database
- **Instant feedback** - Optimistic UI updates
- **Automatic sync** - Queue changes offline, sync when connected
- **Graceful degradation** - Network drops don't break the app

---

## Problem Statement

### Current Situation

The shop operates in an environment with **unreliable internet connectivity**. Currently:

1. **Every page load requires network** - Each navigation fetches fresh data from PostgreSQL
2. **No offline capability** - If internet drops, the app becomes unusable
3. **No data caching** - Same data fetched repeatedly, wasting bandwidth
4. **Slow perceived performance** - Users wait 300-500ms per page load
5. **Lost work on network failure** - Form submissions fail silently or with errors

### Real-World Impact

| Scenario | Current Behavior | User Experience |
|----------|------------------|-----------------|
| Customer asks for price | Wait for page load | Customer waits, may leave |
| Stock status update | Fails if network drops | Frustration, manual tracking |
| Adding new product | Form submission fails | Data loss, re-entry needed |
| Browsing inventory | Repeated loading | Slow, frustrating |

### Technical Analysis

```
Current Data Flow (EVERY request):

User Action → React Component → Server Action → Prisma → PostgreSQL → Response
                                     ↑
                              Network Required
                              (300-500ms latency)
```

**Key Observations from Codebase:**
- `useOnline` hook exists at `lib/hooks/useOnline.ts` but is **never used**
- `useLocalStorage` hook exists but only stores preferences (theme, language)
- Service Worker in `public/sw.js` only caches static assets
- No API response caching anywhere
- All pages fetch data in `useEffect` on every mount

---

## Proposed Solution

### Two-Layer Optimization

```
Layer 1: Data Caching (TanStack Query)
├── Stale-while-revalidate pattern
├── Automatic background refresh
├── Optimistic mutations
└── Reduced API calls

Layer 2: Offline-First Storage (IndexedDB via Dexie)
├── Full product catalog locally
├── Mutation queue for offline changes
├── Automatic sync on reconnection
└── Conflict resolution
```

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Components                          │
│   (HomePage, InventoryPage, ProductPage, etc.)                  │
└─────────────────────┬───────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────┐
│                     TanStack Query Layer                         │
│   - Query caching (stale-while-revalidate)                      │
│   - Mutation hooks with optimistic updates                       │
│   - Automatic refetching on window focus                        │
└─────────────────────┬───────────────────────────────────────────┘
                      │
          ┌──────────┴──────────┐
          │                     │
          ▼                     ▼
┌─────────────────┐   ┌─────────────────────────────────────────┐
│   Online Mode   │   │           Offline Mode                   │
│                 │   │                                          │
│  Server Action  │   │  ┌─────────────┐    ┌────────────────┐  │
│       ↓         │   │  │  IndexedDB  │    │   Sync Queue   │  │
│    Prisma       │   │  │   (Dexie)   │    │   (Mutations)  │  │
│       ↓         │   │  └─────────────┘    └────────────────┘  │
│  PostgreSQL     │   │         │                    │          │
└─────────────────┘   │         └────────┬───────────┘          │
                      │                  │                       │
                      │                  ▼                       │
                      │         ┌─────────────────┐              │
                      │         │   Sync Engine   │              │
                      │         │  (on reconnect) │              │
                      │         └─────────────────┘              │
                      └─────────────────────────────────────────┘
```

---

## Technical Architecture

### Layer 1: Data Caching with TanStack Query

#### What It Does

TanStack Query (formerly React Query) provides:

1. **Automatic caching** - Responses stored in memory
2. **Stale-while-revalidate** - Show cached data instantly, refresh in background
3. **Deduplication** - Multiple components requesting same data = 1 request
4. **Optimistic updates** - Update UI before server confirms
5. **Background refresh** - Refetch when window regains focus

#### Cache Configuration

```typescript
const queryConfig = {
  products: {
    staleTime: 5 * 60 * 1000,    // 5 minutes - product list can be slightly stale
    gcTime: 30 * 60 * 1000,      // Keep in memory for 30 minutes
    refetchOnWindowFocus: true,  // Refresh when user returns to app
  },
  inventory: {
    staleTime: 1 * 60 * 1000,    // 1 minute - stock changes more frequently
    gcTime: 10 * 60 * 1000,
  },
  productDetail: {
    staleTime: 2 * 60 * 1000,    // 2 minutes
  }
}
```

#### Query Key Strategy

```typescript
// Hierarchical keys for fine-grained invalidation
const queryKeys = {
  products: {
    all: ['products'],
    list: () => [...queryKeys.products.all, 'list'],
    search: () => [...queryKeys.products.all, 'search'],
    detail: (id: string) => [...queryKeys.products.all, 'detail', id],
  },
  inventory: {
    all: ['inventory'],
    list: (filter?: StockStatus) => [...queryKeys.inventory.all, 'list', filter],
  },
}

// Invalidation examples:
// queryClient.invalidateQueries(['products'])           // All products
// queryClient.invalidateQueries(['products', 'detail']) // All details
// queryClient.invalidateQueries(['products', 'detail', '123']) // Specific product
```

### Layer 2: Offline Storage with IndexedDB (Dexie)

#### Why IndexedDB Over localStorage

| Feature | localStorage | IndexedDB (Dexie) |
|---------|-------------|-------------------|
| Storage limit | 5-10 MB | 50+ MB (browser-dependent) |
| Data structure | Key-value strings only | Structured objects, arrays |
| Querying | Manual iteration | Indexes, compound queries |
| Performance | Synchronous (blocks UI) | Asynchronous (non-blocking) |
| Transactions | No | Yes (ACID) |
| For 500 products | Slow, may hit limit | Fast, plenty of room |

#### Database Schema

```typescript
// lib/offline/db.ts
import Dexie, { Table } from 'dexie';

interface OfflineProduct {
  id: string;
  name: string;
  barcode: string | null;
  aliases: string[];
  sizeValue: number;
  sizeUnit: string;
  buyingPrice: number;
  sellingPrice: number;
  stockStatus: 'OK' | 'LOW' | 'EMPTY';
  lastChecked: Date;
  // Sync metadata
  _syncVersion: number;       // Server version for conflict detection
  _locallyModified: boolean;  // Has pending local changes
}

interface SyncQueueItem {
  id?: number;                // Auto-increment
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STOCK_UPDATE';
  entityType: 'product' | 'stock';
  entityId: string;
  payload: unknown;
  timestamp: number;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed';
}

class DigiDukanDB extends Dexie {
  products!: Table<OfflineProduct>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super('digidukan');
    this.version(1).stores({
      products: 'id, name, barcode, stockStatus, _locallyModified',
      syncQueue: '++id, action, entityType, entityId, status, timestamp'
    });
  }
}
```

### Sync Engine Design

#### Sync Flow on Reconnection

```
1. Detect online status change (useOnline hook)
           │
           ▼
2. Pull fresh data from server
   - Fetch all products from PostgreSQL
   - DON'T overwrite locally modified items
           │
           ▼
3. Process sync queue (oldest first)
   - For each queued mutation:
     a. Mark as 'syncing'
     b. Send to Server Action
     c. If success: Remove from queue, update local with server response
     d. If conflict: Apply resolution strategy, notify user
     e. If error: Increment retry count, exponential backoff
           │
           ▼
4. Update UI with sync status
   - Clear pending count
   - Show conflict notifications if any
```

#### Conflict Resolution: Last-Write-Wins with Notification

**Why Last-Write-Wins?**

For a small shop with typically one user:
- Conflicts are rare (usually same device)
- Simplicity > complex merge logic
- User notification ensures awareness
- Can upgrade to merge-based later if needed

```typescript
// Conflict scenarios and resolution
const conflictResolution = {
  'product_edited_both_places': {
    resolution: 'server_wins',
    notification: 'Some changes were overwritten by newer data',
  },
  'stock_changed_while_offline': {
    resolution: 'server_wins',
    notification: 'Stock status was updated from another source',
  },
  'product_deleted_while_editing': {
    resolution: 'server_wins',
    notification: 'This product was deleted',
  },
  'duplicate_barcode': {
    resolution: 'reject_local',
    notification: 'Barcode already exists. Please use a different barcode.',
  },
}
```

---

## Why This Approach Works

### 1. Matches Real-World Usage Patterns

**Shop workflow:**
- Morning: Check inventory, update stock status (batch operation)
- During day: Quick product lookups (read-heavy)
- End of day: Add new products, update prices (write operations)

**Our solution:**
- Cached reads = instant product lookups
- Offline mutations = stock updates work without internet
- Background sync = don't interrupt workflow

### 2. Leverages Existing Infrastructure

| What Exists | How We Use It |
|-------------|---------------|
| `useOnline` hook | Trigger sync engine on reconnect |
| `useLocalStorage` hook | Pattern for offline hooks |
| Service Worker | Already handles static assets |
| Server Actions | Wrap with offline-aware layer |
| Toast system | Show sync status, conflicts |

### 3. Progressive Enhancement

The solution works at multiple levels:

```
Level 0: Online, no cache    → Current behavior (fallback)
Level 1: Online, with cache  → 5x faster, still works
Level 2: Offline, read only  → Browse products offline
Level 3: Offline, read/write → Full offline capability
```

### 4. Minimal Breaking Changes

- **Same Server Actions** - Just wrapped with offline layer
- **Same UI components** - Add loading/offline states
- **Same data structures** - Extended with sync metadata
- **Same user flows** - Just faster and more reliable

### 5. Industry-Proven Patterns

| Pattern | Used By | Our Implementation |
|---------|---------|-------------------|
| Stale-while-revalidate | SWR, React Query | TanStack Query |
| IndexedDB for offline | PWAs, Notion, Figma | Dexie.js |
| Sync queue | Offline-first apps | Custom sync engine |
| Optimistic updates | Most modern apps | Mutation hooks |

---

## Alternative Solutions Considered

### Alternative 1: Service Worker API Caching

**Approach:** Cache Server Action responses in Service Worker

```javascript
// sw.js
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        return cached || fetch(event.request).then(response => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    );
  }
});
```

**Why NOT chosen:**

| Issue | Problem |
|-------|---------|
| Server Actions use POST | POST requests are not cacheable by default |
| No fine-grained control | Can't invalidate specific products |
| No optimistic updates | UI waits for real response |
| Complex offline mutations | Would need separate queue anyway |
| Debugging difficulty | Service Worker state is opaque |

**Verdict:** Service Worker is great for static assets (already doing this), but not ideal for dynamic API data with mutations.

---

### Alternative 2: Redux + Redux Offline

**Approach:** Use Redux for state management with redux-offline middleware

```typescript
// store.ts
import { offline } from '@redux-offline/redux-offline';
import offlineConfig from '@redux-offline/redux-offline/lib/defaults';

const store = configureStore({
  reducer: rootReducer,
  enhancers: [offline(offlineConfig)],
});
```

**Why NOT chosen:**

| Issue | Problem |
|-------|---------|
| Heavy-weight | Redux adds significant boilerplate |
| Overkill | We only have 3 data types (Product, Stock, Settings) |
| Learning curve | Team needs to learn Redux patterns |
| Not needed | React Query + Context is sufficient |
| Bundle size | Redux + Redux Offline = ~15KB vs Query ~12KB |

**Verdict:** Redux is excellent for complex state, but DigiDukan's state is simple. TanStack Query provides caching without Redux overhead.

---

### Alternative 3: SWR Instead of TanStack Query

**Approach:** Use Vercel's SWR library

```typescript
import useSWR from 'swr';

function useProduct(id: string) {
  return useSWR(`/api/products/${id}`, fetcher);
}
```

**Comparison:**

| Feature | TanStack Query | SWR |
|---------|----------------|-----|
| Bundle size | ~12KB | ~4KB |
| Devtools | Excellent | Limited |
| Mutations | Built-in useMutation | Manual |
| Optimistic updates | First-class support | Manual implementation |
| Cache invalidation | Fine-grained | Basic |
| Offline support | Built-in | Plugin required |
| TypeScript | Excellent | Good |

**Why TanStack Query chosen:**

1. **Mutations are first-class** - `useMutation` with `onMutate`, `onError`, `onSettled`
2. **Better DevTools** - Critical for debugging cache states
3. **Optimistic updates** - Built-in pattern, not manual
4. **Query invalidation** - Hierarchical keys, partial invalidation
5. **Offline mode** - Works with `onlineManager` out of box

**Verdict:** SWR is lighter, but TanStack Query's mutation support and DevTools justify the extra ~8KB.

---

### Alternative 4: localStorage Only (No IndexedDB)

**Approach:** Store everything in localStorage with compression

```typescript
const products = JSON.parse(localStorage.getItem('products') || '[]');
```

**Why NOT chosen:**

| Issue | Problem |
|-------|---------|
| 5-10MB limit | 500 products with full data may exceed |
| Synchronous | Blocks main thread on read/write |
| No indexing | Can't query by stockStatus efficiently |
| No transactions | Partial writes possible |
| String only | JSON.parse/stringify overhead |

**Calculation:**
- Average product: ~500 bytes
- 500 products: ~250KB (fits)
- But with search index, aliases, stock history: ~1-2MB
- Near the safety margin, especially on mobile

**Verdict:** localStorage works for preferences (already using), but IndexedDB is safer for product data at scale.

---

### Alternative 5: PouchDB + CouchDB Sync

**Approach:** Use PouchDB for automatic sync with a CouchDB backend

```typescript
const db = new PouchDB('digidukan');
db.sync('http://couchdb.example.com/digidukan', { live: true });
```

**Why NOT chosen:**

| Issue | Problem |
|-------|---------|
| Requires CouchDB | Need to replace PostgreSQL or run both |
| Different paradigm | Document DB vs relational |
| Overkill | DigiDukan's sync needs are simple |
| Complexity | CouchDB conflicts are complex |
| Cost | Additional infrastructure |

**Verdict:** PouchDB/CouchDB is excellent for truly distributed systems, but adds unnecessary complexity when PostgreSQL works well and we just need offline caching.

---

### Alternative 6: Workbox Background Sync

**Approach:** Use Google's Workbox for background sync

```javascript
import { BackgroundSyncPlugin } from 'workbox-background-sync';

const bgSyncPlugin = new BackgroundSyncPlugin('syncQueue', {
  maxRetentionTime: 24 * 60 // 24 hours
});
```

**Why PARTIALLY chosen:**

This is actually a good complement to our solution. We can:
1. Use TanStack Query for caching (Layer 1)
2. Use Dexie for IndexedDB storage (Layer 2)
3. Optionally add Workbox Background Sync for mutation queue (enhancement)

**Current decision:** Start with custom sync queue, consider Workbox as optimization later.

---

## Implementation Details

### New Files to Create

```
lib/
├── queries/
│   ├── queryKeys.ts           # Centralized query key factory
│   ├── useProducts.ts         # Product query and mutation hooks
│   └── useStock.ts            # Stock mutation hooks
├── contexts/
│   ├── QueryProvider.tsx      # TanStack Query setup
│   └── OfflineSyncContext.tsx # Sync state provider
├── offline/
│   ├── db.ts                  # Dexie database schema
│   ├── syncQueue.ts           # Queue management
│   ├── syncEngine.ts          # Background sync logic
│   └── offlineActions.ts      # Offline-aware action wrappers
└── hooks/
    └── useOfflineSync.ts      # Main offline sync hook

components/munafa/
└── ConnectionStatusBadge.tsx  # Offline indicator UI
```

### Files to Modify

| File | Changes |
|------|---------|
| `package.json` | Add `@tanstack/react-query`, `dexie` |
| `lib/contexts/Providers.tsx` | Add QueryProvider, OfflineSyncProvider |
| `components/munafa/AppBar.tsx` | Add connection status badge |
| `app/(shell)/page.tsx` | Use `useProductSearch()` hook |
| `app/(shell)/inventory/page.tsx` | Use `useInventory()`, `useStockMutation()` |
| `app/(shell)/product/[id]/page.tsx` | Use `useProduct()`, `useStockMutation()` |
| `app/(shell)/product/[id]/edit/page.tsx` | Use mutation hooks |
| `app/(shell)/add/page.tsx` | Use `useAddProduct()` mutation |

### Implementation Order

```
Phase 1: Caching Foundation
├── 1. Install dependencies
├── 2. Create QueryProvider
├── 3. Create query hooks
└── 4. Migrate home page

Phase 2: Full Caching Migration
├── 5. Migrate inventory page
├── 6. Migrate product detail
├── 7. Migrate add/edit pages
└── 8. Add optimistic updates

Phase 3: Offline Storage
├── 9. Create Dexie database
├── 10. Create sync queue
├── 11. Create offline actions
└── 12. Integrate with queries

Phase 4: Sync Engine
├── 13. Build sync engine
├── 14. Add conflict resolution
├── 15. Add UI indicators
└── 16. Test offline scenarios
```

---

## Risk Analysis

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| IndexedDB quota exceeded | Low | Medium | Monitor storage, implement cleanup |
| Sync conflicts | Medium | Low | Last-write-wins + notification |
| Stale data shown | Medium | Low | Configurable stale times |
| Browser compatibility | Low | High | Dexie handles fallbacks |

### Migration Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Breaking existing flows | Low | High | Incremental migration, fallbacks |
| Performance regression | Low | Medium | Benchmark before/after |
| Data inconsistency | Low | High | Extensive testing |

### Operational Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| User confusion (offline mode) | Medium | Low | Clear UI indicators |
| Sync failures not noticed | Medium | Medium | Pending count badge |

---

## Success Metrics

### Performance Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Home page load | 300-500ms | <100ms | Chrome DevTools |
| Product detail load | 200-300ms | <50ms | Chrome DevTools |
| Stock update feedback | 200ms | <50ms | Perceived (optimistic) |
| Time to interactive | 1-2s | <500ms | Lighthouse |

### Reliability Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Offline read capability | 0% | 100% |
| Offline write capability | 0% | 100% |
| Sync success rate | N/A | >99% |
| Data loss on network failure | Possible | 0% |

### User Experience Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Failed actions due to network | Common | Rare (queued) |
| User awareness of sync status | None | Always visible |
| Time to recover from offline | Manual refresh | Automatic |

---

## Conclusion

The proposed offline-first architecture with TanStack Query and IndexedDB provides:

1. **Immediate value** - Faster page loads from day one
2. **Progressive enhancement** - Add offline capabilities incrementally
3. **Low risk** - Uses proven libraries, minimal breaking changes
4. **Future-proof** - Can extend to multi-device sync, push notifications

This solution directly addresses the unreliable network conditions at the shop while improving overall application performance and user experience.

---

## Appendix: Code Examples

### Example: Query Hook

```typescript
// lib/queries/useProducts.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchProducts, addProduct } from '@/app/actions/products';
import { queryKeys } from './queryKeys';

export function useProductSearch() {
  return useQuery({
    queryKey: queryKeys.products.search(),
    queryFn: async () => {
      const result = await searchProducts();
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useAddProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ProductInput) => {
      const result = await addProduct(input);
      if (!result.success) throw new Error(result.error);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
    },
  });
}
```

### Example: Optimistic Stock Update

```typescript
// lib/queries/useStock.ts
export function useStockMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStockStatus,

    onMutate: async ({ productId, status }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.products.all });

      const previousData = queryClient.getQueryData(queryKeys.inventory.list());

      // Optimistic update
      queryClient.setQueryData(queryKeys.inventory.list(), (old) =>
        old?.map(p => p.id === productId
          ? { ...p, stock: { ...p.stock, status } }
          : p
        )
      );

      return { previousData };
    },

    onError: (err, variables, context) => {
      // Rollback on error
      queryClient.setQueryData(queryKeys.inventory.list(), context?.previousData);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inventory.all });
    },
  });
}
```

### Example: Offline Action Wrapper

```typescript
// lib/offline/offlineActions.ts
export async function offlineUpdateStockStatus(input: StockUpdateInput) {
  if (navigator.onLine) {
    // Online: normal flow
    const result = await updateStockStatus(input);
    if (result.success) {
      await db.products.update(input.productId, {
        stockStatus: input.status,
        _locallyModified: false,
      });
    }
    return result;
  }

  // Offline: save locally and queue
  await db.products.update(input.productId, {
    stockStatus: input.status,
    _locallyModified: true,
  });

  await syncQueue.enqueue({
    action: 'STOCK_UPDATE',
    entityType: 'stock',
    entityId: input.productId,
    payload: input,
  });

  return {
    success: true,
    message: 'Saved offline. Will sync when connected.',
  };
}
```
