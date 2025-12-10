---
title: Component Contracts
version: 2.1
status: in-progress
created: 2025-01-10
updated: 2025-01-10
---

# Component Contracts — Munafa OS

API specifications for new components in `/components/munafa/`.

---

## 1. Icon

**File:** `components/munafa/Icon.tsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | required | Material Symbol name (without prefix) |
| `size` | `'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | Icon size (20/24/28/32px) |
| `filled` | `boolean` | `false` | Use filled variant |
| `className` | `string` | - | Additional CSS classes |

### Usage

```tsx
<Icon name="home" filled className="text-brand" />
<Icon name="search" size="lg" />
```

---

## 2. Button

**File:** `components/munafa/Button.tsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Button style |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |
| `icon` | `ReactNode` | - | Icon element (left side) |
| `iconRight` | `ReactNode` | - | Icon element (right side) |
| `loading` | `boolean` | `false` | Show loading spinner |
| `disabled` | `boolean` | `false` | Disable button |
| `fullWidth` | `boolean` | `false` | Full width button |
| `children` | `ReactNode` | required | Button label |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `ButtonHTMLAttributes` | - | Native button props |

### Variants

| Variant | Background | Text | Shadow |
|---------|------------|------|--------|
| `primary` | Brand gradient | White | `shadow-xl` |
| `secondary` | White | Brand | `shadow-md` |
| `ghost` | Transparent | Brand | None |
| `danger` | Rose-600 | White | `shadow-md` |

### Sizes

| Size | Height | Padding | Font |
|------|--------|---------|------|
| `sm` | 40px | px-4 | 14px |
| `md` | 48px | px-5 | 16px |
| `lg` | 56px | px-6 | 18px bold |

### States

- **Default:** Normal appearance
- **Hover:** Scale 1.02, shadow expands
- **Active:** Scale 0.95, brightness 90%
- **Disabled:** Gray bg, opacity 50%, no shadow
- **Loading:** Spinner replaces text

### Usage

```tsx
<Button variant="primary" size="lg">
  PAKKA KARO
</Button>

<Button variant="secondary" icon={<Icon name="save" />}>
  Save
</Button>

<Button variant="ghost" loading>
  Processing...
</Button>
```

---

## 3. Input

**File:** `components/munafa/Input.tsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'price' \| 'search'` | `'default'` | Input style |
| `label` | `string` | - | Field label |
| `error` | `string` | - | Error message |
| `icon` | `ReactNode` | - | Left icon |
| `iconRight` | `ReactNode` | - | Right icon |
| `className` | `string` | - | Additional CSS classes |
| `...props` | `InputHTMLAttributes` | - | Native input props |

### Variants

| Variant | Font Size | Special |
|---------|-----------|---------|
| `default` | 16px | Standard text input |
| `price` | 24px bold | Numeric, right-aligned |
| `search` | 16px | Rounded pill shape |

### States

- **Default:** Light gray bg (`#F1F5F9`), transparent border
- **Focus:** White bg, 2px indigo border, shadow-md
- **Error:** Rose border, rose bg, shake animation
- **Filled:** Primary text color

### Usage

```tsx
<Input
  label="उत्पाद का नाम"
  placeholder="जैसे: Tata Salt 1kg"
  error={errors.name?.message}
/>

<Input
  variant="price"
  label="बिक्री मूल्य"
  icon={<span>₹</span>}
  inputMode="decimal"
/>

<Input
  variant="search"
  placeholder="खोजें..."
  icon={<Icon name="search" />}
/>
```

---

## 4. Card

**File:** `components/munafa/Card.tsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'product' \| 'widget'` | `'default'` | Card style |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | `'md'` | Inner padding |
| `hoverable` | `boolean` | `false` | Show hover effect |
| `children` | `ReactNode` | required | Card content |
| `className` | `string` | - | Additional CSS classes |

### Variants

| Variant | Border Radius | Shadow | Special |
|---------|---------------|--------|---------|
| `default` | 24px | `shadow-md` | Standard container |
| `product` | 24px | `shadow-md` | Product bubble layout |
| `widget` | 24px | `shadow-md` | Dashboard widget |

### States

- **Default:** White bg, shadow-md
- **Hover (if hoverable):** 1px lavender border

### Usage

```tsx
<Card>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>

<Card variant="product" hoverable>
  <ProductContent />
</Card>
```

---

## 5. HealthBar

**File:** `components/munafa/HealthBar.tsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `'OK' \| 'LOW' \| 'EMPTY'` | required | Stock status |
| `className` | `string` | - | Additional CSS classes |

### Visual Rules

| Status | Bar Width | Bar Color |
|--------|-----------|-----------|
| `OK` | 100% | `--color-success-bar` |
| `LOW` | 40% | `--color-warning-bar` |
| `EMPTY` | 8px dot | `--color-danger-bar` |

### Usage

```tsx
<HealthBar status="OK" />
<HealthBar status="LOW" />
<HealthBar status="EMPTY" />
```

---

## 6. NavDock

**File:** `components/munafa/NavDock.tsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `NavItem[]` | required | Navigation items |

### NavItem Type

```ts
interface NavItem {
  href: string;
  icon: string;      // Material Symbol name
  label: string;     // Hindi label
  labelEn?: string;  // English label (optional)
}
```

### Visual

- Glass morphism: `rgba(255,255,255,0.95)` + `backdrop-blur-md`
- Shadow: `shadow-glass`
- Height: 64px
- Safe area padding for iOS

### Active State

- Icon: Filled variant, brand color
- Label: Bold, brand color
- Optional: Subtle glow under icon

### Usage

```tsx
<NavDock items={[
  { href: '/', icon: 'home', label: 'होम' },
  { href: '/inventory', icon: 'inventory-2', label: 'माल' },
  { href: '/add', icon: 'add-circle', label: 'जोड़ें' },
  { href: '/settings', icon: 'settings', label: 'सेटिंग्स' },
]} />
```

---

## 7. MeshHeader

**File:** `components/munafa/MeshHeader.tsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | - | Page title |
| `showStatus` | `boolean` | `true` | Show online/offline |
| `children` | `ReactNode` | - | Additional content |

### Visual

- Background: Brand gradient (`linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)`)
- Text: White
- Height: 56px
- Position: Sticky top

### Usage

```tsx
<MeshHeader title="मेरी दुकान" />

<MeshHeader title="नया उत्पाद जोड़ें">
  <BackButton />
</MeshHeader>
```

---

## 8. Toast

**File:** `components/munafa/Toast.tsx`

### Props (ToastProvider)

Provider wraps app, exposes `useToast` hook.

### useToast Hook

```ts
const { toast } = useToast();

toast.success('Product added!');
toast.error('Failed to save');
toast.info('Working offline');
toast.warning('Low stock alert');
```

### Toast Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `string` | required | Toast message |
| `duration` | `number` | `3000` | Auto-dismiss ms |
| `dismissible` | `boolean` | `true` | Show close button |

### Visual

- Position: Fixed top, under header
- Shape: `rounded-2xl`
- Background: Glassmorphism (dark or light)
- Animation: Slide down (300ms spring), auto-dismiss

### Types

| Type | Icon | Icon Color |
|------|------|------------|
| `success` | `check-circle` | Green |
| `error` | `cancel` | Red |
| `warning` | `warning` | Amber |
| `info` | `info` | Blue |

---

## 9. Badge

**File:** `components/munafa/Badge.tsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'success' \| 'warning' \| 'danger'` | `'default'` | Badge style |
| `size` | `'sm' \| 'md'` | `'md'` | Badge size |
| `children` | `ReactNode` | required | Badge content |

### Usage

```tsx
<Badge variant="success">ठीक है</Badge>
<Badge variant="warning">कम है</Badge>
<Badge variant="danger">खाली</Badge>
```

---

## 10. Chip (Unit Selector)

**File:** `components/munafa/Chip.tsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `options` | `ChipOption[]` | required | Available options |
| `value` | `string` | required | Selected value |
| `onChange` | `(value: string) => void` | required | Change handler |

### ChipOption Type

```ts
interface ChipOption {
  value: string;
  label: string;
}
```

### Visual

- Unselected: Light gray bg, dark text
- Selected: Brand bg, white text
- Shape: Pill (`rounded-full`)
- Spacing: Gap 8px between chips

### Usage

```tsx
<Chip
  options={[
    { value: 'kg', label: 'kg' },
    { value: 'g', label: 'g' },
    { value: 'L', label: 'L' },
    { value: 'pcs', label: 'pcs' },
  ]}
  value={unit}
  onChange={setUnit}
/>
```

---

## Implementation Checklist

- [ ] Icon.tsx
- [ ] Button.tsx
- [ ] Input.tsx
- [ ] Card.tsx
- [ ] HealthBar.tsx
- [ ] NavDock.tsx
- [ ] MeshHeader.tsx
- [ ] Toast.tsx
- [ ] Badge.tsx
- [ ] Chip.tsx
