# Hardcoded Colors Refactoring Guide

## Summary
**Total files with hardcoded colors:** 11 CSS files
**Total unique hardcoded color values:** 30+ distinct colors
**Color system already defined in App.css:** YES

---

## 1. Files with Hardcoded Colors

| File | Location | Hardcoded Colors Count |
|------|----------|------------------------|
| [src/App.css](src/App.css) | Body gradient, Alerts, Shadows | 15+ |
| [src/paginas/Inicio.css](src/paginas/Inicio.css) | Gradients, Shadows, Borders | 20+ |
| [src/paginas/Despesas.css](src/paginas/Despesas.css) | Not fully examined |
| [src/componentes/PopupNotificacao.css](src/componentes/PopupNotificacao.css) | Success/Error backgrounds | 8+ |
| [src/componentes/PainelOrcamento.css](src/componentes/PainelOrcamento.css) | Progress bars, Alerts | 6+ |
| [src/componentes/SimuladorDepositos.css](src/componentes/SimuladorDepositos.css) | Gradients, Borders | 8+ |
| [src/componentes/Navegacao.css](src/componentes/Navegacao.css) | Navigation background | 3+ |
| [src/componentes/ListaDespesas.css](src/componentes/ListaDespesas.css) | Alerts, Item backgrounds | 5+ |
| [src/componentes/FormularioDespesa.css](src/componentes/FormularioDespesa.css) | Alerts, Shadows | 5+ |
| [src/componentes/FormularioReceita.css](src/componentes/FormularioReceita.css) | Alerts, Shadows | 5+ |
| [src/componentes/BarraProgresso.css](src/componentes/BarraProgresso.css) | Progress background | 1 |
| [src/componentes/Logo.css](src/componentes/Logo.css) | Drop shadow | 1 |

---

## 2. Hardcoded Colors Found & Mapping

### Primary Green Colors (Map to existing variables)

| Hardcoded Value | RGB Format | Recommended Variable | Current Definition |
|-----------------|-----------|----------------------|-------------------|
| `#2d9057` | `rgb(45, 144, 87)` | `--color-green-primary` | ✓ Exists |
| `#1f5540` | `rgb(31, 90, 69)` | `--color-green-dark` | ✓ Exists |
| `#52b788` | `rgb(82, 183, 136)` | `--color-green-light` | ✓ Exists |
| `#d8f3dc` | — | `--color-green-lighter` | ✓ Exists |
| `#e8f5f1` | — | `--color-green-subtle` | ✓ Exists |

**Files using these colors:**
- `rgba(45, 144, 87, X)` - Used in 20+ places across Inicio.css, PopupNotificacao.css, PainelOrcamento.css
- `rgba(82, 183, 136, X)` - Used in Inicio.css, PainelOrcamento.css
- `rgba(31, 90, 69, X)` - Used in Inicio.css, Navegacao.css, SimuladorDepositos.css

---

### Surface/Background Colors (Map to existing variables)

| Hardcoded Value | RGB Format | Recommended Variable | Current Definition |
|-----------------|-----------|----------------------|-------------------|
| `#f5f0e8` | `rgb(245, 240, 232)` | `--color-surface` | ✓ Exists |
| `#faf8f5` | — | `--color-surface-soft` | ✓ Exists |
| `#ffffff` | `rgb(255, 255, 255)` | `--color-white` | ✓ Exists |
| `#e8dfd3` | — | `--color-surface-dark` | ✓ Exists |

**Files using these colors:**
- `#f5f0e8` - App.css (body gradient)
- `#faf8f5` - App.css (body gradient)
- `#ffffff` - App.css (body gradient), PopupNotificacao.css, Navegacao.css
- `rgba(245, 240, 232, X)` - Navegacao.css background

---

### Text Colors (Map to existing variables)

| Hardcoded Value | RGB Format | Recommended Variable | Current Definition |
|-----------------|-----------|----------------------|-------------------|
| `#1a1a1a` | `rgb(26, 26, 26)` | `--color-text-primary` | ✓ Exists |
| `#5a5450` | — | `--color-text-secondary` | ✓ Exists |

**Files using these colors:**
- `rgba(26, 26, 26, X)` - Used in shadows in Inicio.css, ListaDespesas.css, FormularioDespesa.css, FormularioReceita.css

---

### Error/Alert Colors (Map to existing or new variables)

| Hardcoded Value | RGB Format | Recommended Variable | Current Definition | Status |
|-----------------|-----------|----------------------|-------------------|--------|
| `#c74c3e` | `rgb(199, 76, 62)` | `--color-error` | ✓ Exists | MATCHES |
| `#a03a2f` | — | `--color-error-dark` | ✓ Exists | — |
| `#ef4444` | `rgb(239, 68, 68)` | ❌ **NOT IN SYSTEM** | — | ⚠️ NEEDS REVIEW |

**Files using error colors:**
- `rgba(199, 76, 62, X)` - PopupNotificacao.css, ListaDespesas.css, FormularioDespesa.css, FormularioReceita.css
- `rgba(239, 68, 68, X)` - Inicio.css, ListaDespesas.css
- `#ff7f7f`, `#e46060` - PainelOrcamento.css (gradient)

---

## 3. New/Non-System Colors Requiring Attention

These colors are hardcoded but NOT defined in the App.css color system:

### Reds/Pinks (Issue - conflicts with error system)
- `#ef4444` / `rgb(239, 68, 68)` - **Used in Inicio.css (line 395)**
- `#ff7f7f` - **Used in PainelOrcamento.css progress bar**
- `#e46060` - **Used in PainelOrcamento.css progress bar**
- `#fce2e2` / `rgba(254, 226, 226, X)` - **Used in Inicio.css (line 394)**
- `#fef3f3` / `rgba(254, 243, 243, X)` - **Used in Inicio.css (line 394)**
- `#fff4f4` - **Used in PopupNotificacao.css**

### Neutral/Custom Colors
- `#f7fcf6` - **Used in PopupNotificacao.css** (light green background)
- `#d1d5db` - **Used in SimuladorDepositos.css** (gray border)
- `rgba(15, 31, 26, X)` - **Used in SimuladorDepositos.css** (dark border - not in system)
- `rgba(16, 42, 67, X)` - **Used in multiple files** (dark blue-ish - not in system)
- `rgba(56, 178, 172, X)` - **Used in SimuladorDepositos.css** (teal - not in system)
- `rgba(208, 234, 224, X)` - **Used in SimuladorDepositos.css** (light teal - not in system)
- `rgba(141, 203, 184, X)` - **Used in Inicio.css** (teal - not in system)

---

## 4. Detailed File-by-File Color Analysis

### [src/App.css](src/App.css)
**Hardcoded colors in CSS rules (excluding color variables definition):**

| Line | Property | Hardcoded Value | Should Be | Priority |
|------|----------|-----------------|-----------|----------|
| 97 | background gradient | `#f5f0e8`, `#faf8f5`, `#ffffff` | `var(--color-surface)`, `var(--color-surface-soft)`, `var(--color-white)` | 🔴 HIGH |
| 118 | radial-gradient + linear | `rgba(45, 144, 87, 0.08)`, `#f5f0e8`, `#ffffff` | Use vars | 🔴 HIGH |
| 126-127 | border | `rgba(255, 255, 255, X)` | New shadow var needed | 🟡 MEDIUM |
| 248, 268 | box-shadow | `rgba(45, 144, 87, X)` | Use shadow vars | 🟡 MEDIUM |
| 303 | gradient | `rgba(199, 76, 62, X)`, `rgba(255, 240, 240, X)` | New error gradient var | 🔴 HIGH |
| 310 | gradient | `rgba(45, 144, 87, X)`, `rgba(216, 243, 220, X)` | New success gradient var | 🔴 HIGH |
| 317 | gradient | `rgba(82, 183, 136, X)` | New warning gradient var | 🟡 MEDIUM |
| 324 | gradient | `rgba(45, 144, 87, X)`, `rgba(216, 243, 220, X)` | New info gradient var | 🟡 MEDIUM |
| 378, 392 | box-shadow | `rgba(45, 144, 87, X)` | Use shadow vars | 🟡 MEDIUM |

---

### [src/paginas/Inicio.css](src/paginas/Inicio.css)
**Hardcoded colors (20+ occurrences):**

| Lines | Property | Hardcoded Value | Should Be | Priority |
|-------|----------|-----------------|-----------|----------|
| 17 | gradient background | `rgba(45, 144, 87, 0.06)`, `rgba(82, 183, 136, 0.03)` | Vars or new gradient | 🔴 HIGH |
| 19 | border | `rgba(45, 144, 87, 0.08)` | New border var | 🟡 MEDIUM |
| 20 | box-shadow | `rgba(31, 90, 69, 0.04)` | Use shadow var | 🟡 MEDIUM |
| 158, 217, 341 | background/border | `rgba(45, 144, 87, X)` | Create accent vars | 🟡 MEDIUM |
| 267, 289 | box-shadow | `rgba(26, 26, 26, X)` | Use shadow vars | 🟡 MEDIUM |
| 390 | gradient | `rgba(250, 249, 244, 0.95)`, `rgba(241, 245, 249, 0.95)` | ⚠️ Not in system | 🔴 HIGH |
| 394-395 | gradient + border | `rgba(254, 226, 226, 0.95)`, `#fef3f3`, `rgba(239, 68, 68, 0.18)` | ⚠️ Different reds | 🔴 HIGH |
| 419, 428 | background + shadow | `rgba(45, 144, 87, X)` | Use vars | 🟡 MEDIUM |
| 475 | background | `rgba(31, 90, 69, 0.12)` | Use var + opacity | 🟡 MEDIUM |
| 522 | border-top | `rgba(45, 144, 87, 0.1)` | Use var + opacity | 🟡 MEDIUM |
| 569, 576 | background/gradient | `rgba(45, 144, 87, X)`, `rgba(82, 183, 136, X)` | Use vars | 🟡 MEDIUM |
| 639 | border-bottom | `rgba(31, 90, 69, 0.08)` | Use var + opacity | 🟡 MEDIUM |
| 670 | background | `rgba(141, 203, 184, 0.18)` | ⚠️ Not in system | 🔴 HIGH |
| 676, 680 | background | `rgba(239, 68, 68, X)`, `rgba(31, 90, 69, X)` | ⚠️ Mixed errors | 🔴 HIGH |

---

### [src/componentes/PopupNotificacao.css](src/componentes/PopupNotificacao.css)
**Hardcoded colors:**

| Line | Property | Hardcoded Value | Should Be | Priority |
|------|----------|-----------------|-----------|----------|
| 14 | gradient | `#f7fcf6`, `#ffffff` | Use vars | 🟡 MEDIUM |
| 15 | border | `rgba(45, 144, 87, 0.18)` | Use var + opacity | 🟡 MEDIUM |
| 27 | border-color | `rgba(45, 144, 87, 0.28)` | Use var + opacity | 🟡 MEDIUM |
| 31 | gradient | `#fff4f4`, `#ffffff` | Use vars | 🟡 MEDIUM |
| 32 | border-color | `rgba(199, 76, 62, 0.24)` | Use var + opacity | 🟡 MEDIUM |
| 43 | background | `rgba(45, 144, 87, 0.08)` | Use var + opacity | 🟡 MEDIUM |
| 63 | background | `rgba(45, 144, 87, 0.16)` | Use var + opacity | 🟡 MEDIUM |
| 70 | background | `rgba(199, 76, 62, 0.14)` | Use var + opacity | 🟡 MEDIUM |

---

### [src/componentes/PainelOrcamento.css](src/componentes/PainelOrcamento.css)
**Hardcoded colors:**

| Line | Property | Hardcoded Value | Should Be | Priority |
|------|----------|-----------------|-----------|----------|
| 86 | box-shadow | `rgba(45, 144, 87, 0.14)` | Use var + opacity | 🟡 MEDIUM |
| 114 | border | `rgba(16, 42, 67, 0.08)` | ⚠️ Not in system | 🔴 HIGH |
| 137 | background-color | `rgba(56, 178, 172, 0.08)` | ⚠️ Not in system | 🔴 HIGH |
| 155 | gradient | `#ff7f7f`, `#e46060` | ⚠️ Different from error color | 🔴 HIGH |

---

### [src/componentes/SimuladorDepositos.css](src/componentes/SimuladorDepositos.css)
**Hardcoded colors:**

| Line | Property | Hardcoded Value | Should Be | Priority |
|------|----------|-----------------|-----------|----------|
| 77 | box-shadow | `rgba(45, 144, 87, 0.14)` | Use var + opacity | 🟡 MEDIUM |
| 114 | border-left | `#d1d5db` | ⚠️ Not in system | 🔴 HIGH |
| 163 | border | `rgba(15, 31, 26, 0.08)` | ⚠️ Not in system | 🔴 HIGH |
| 214 | gradient | `rgba(56, 178, 172, 0.12)`, `rgba(208, 234, 224, 0.14)` | ⚠️ Not in system | 🔴 HIGH |

---

### [src/componentes/Navegacao.css](src/componentes/Navegacao.css)
**Hardcoded colors:**

| Line | Property | Hardcoded Value | Should Be | Priority |
|------|----------|-----------------|-----------|----------|
| 3 | gradient | `rgba(255, 255, 255, 0.98)`, `rgba(245, 240, 232, 0.95)` | Use vars + opacity | 🟡 MEDIUM |
| 4 | box-shadow | `rgba(45, 144, 87, X)` | Use var + opacity | 🟡 MEDIUM |

---

### [src/componentes/ListaDespesas.css](src/componentes/ListaDespesas.css)
**Hardcoded colors:**

| Lines | Property | Hardcoded Value | Should Be | Priority |
|-------|----------|-----------------|-----------|----------|
| 57 | box-shadow | `rgba(26, 26, 26, 0.08)` | Use var + opacity | 🟡 MEDIUM |
| 95 | background | `rgba(45, 144, 87, 0.12)` | Use var + opacity | 🟡 MEDIUM |
| 180 | background-color | `rgba(255, 255, 255, 0.9)` | Use var + opacity | 🟡 MEDIUM |
| 182 | border | `rgba(16, 42, 67, 0.08)` | ⚠️ Not in system | 🔴 HIGH |
| 213 | background | `rgba(239, 68, 68, 0.1)` | ⚠️ Different error | 🔴 HIGH |
| 215 | border | `rgba(239, 68, 68, 0.2)` | ⚠️ Different error | 🔴 HIGH |

---

### [src/componentes/FormularioDespesa.css](src/componentes/FormularioDespesa.css)
**Hardcoded colors:**

| Line | Property | Hardcoded Value | Should Be | Priority |
|------|----------|-----------------|-----------|----------|
| 70 | box-shadow | `rgba(45, 144, 87, 0.06)` | Use var + opacity | 🟡 MEDIUM |
| 91 | box-shadow | `rgba(16, 42, 67, 0.06)` | ⚠️ Not in system | 🔴 HIGH |
| 131 | background | `rgba(199, 76, 62, 0.12)` | Use var + opacity | 🟡 MEDIUM |
| 137 | background | `rgba(45, 144, 87, 0.12)` | Use var + opacity | 🟡 MEDIUM |
| 153 | box-shadow | `rgba(199, 76, 62, 0.06)` | Use var + opacity | 🟡 MEDIUM |

---

### [src/componentes/FormularioReceita.css](src/componentes/FormularioReceita.css)
**Hardcoded colors:**

| Line | Property | Hardcoded Value | Should Be | Priority |
|------|----------|-----------------|-----------|----------|
| 69 | box-shadow | `rgba(45, 144, 87, 0.06)` | Use var + opacity | 🟡 MEDIUM |
| 90 | box-shadow | `rgba(26, 26, 26, 0.06)` | Use var + opacity | 🟡 MEDIUM |
| 130 | background | `rgba(199, 76, 62, 0.12)` | Use var + opacity | 🟡 MEDIUM |
| 136 | background | `rgba(45, 144, 87, 0.12)` | Use var + opacity | 🟡 MEDIUM |
| 152 | box-shadow | `rgba(199, 76, 62, 0.06)` | Use var + opacity | 🟡 MEDIUM |

---

### [src/componentes/BarraProgresso.css](src/componentes/BarraProgresso.css)
**Hardcoded colors:**

| Line | Property | Hardcoded Value | Should Be | Priority |
|------|----------|-----------------|-----------|----------|
| 7 | background | `rgba(45, 144, 87, 0.12)` | Use var + opacity | 🟡 MEDIUM |

---

### [src/componentes/Logo.css](src/componentes/Logo.css)
**Hardcoded colors:**

| Line | Property | Hardcoded Value | Should Be | Priority |
|------|----------|-----------------|-----------|----------|
| 34 | filter (drop-shadow) | `rgba(45, 144, 87, 0.12)` | Use var + opacity | 🟡 MEDIUM |

---

## 5. New CSS Variables Recommended for App.css

To complete the color refactoring, consider adding these new variables:

```css
/* Existing color system - these are already defined */

/* New: Opacity/Gradient variants of primary colors */
--color-green-primary-light: rgba(45, 144, 87, 0.12);
--color-green-primary-lighter: rgba(45, 144, 87, 0.08);
--color-green-primary-lightest: rgba(45, 144, 87, 0.06);
--color-green-dark-light: rgba(31, 90, 69, 0.12);

/* New: Opacity/Gradient variants of error colors */
--color-error-light: rgba(199, 76, 62, 0.12);
--color-error-lighter: rgba(199, 76, 62, 0.06);

/* New: Colors used but not defined - NEEDS REVIEW */
--color-red-alternative: #ef4444;        /* Used in Inicio.css - differs from error */
--color-red-gradient-light: #ff7f7f;     /* Used in progress bars */
--color-red-gradient-dark: #e46060;      /* Used in progress bars */

/* New: Unknown teal/custom colors - NEEDS REVIEW */
--color-teal-custom: rgba(56, 178, 172, 1);
--color-teal-light: rgba(208, 234, 224, 1);
--color-teal-custom-alt: rgba(141, 203, 184, 1);

/* New: Unknown blue/neutral - NEEDS REVIEW */
--color-neutral-dark-blue: rgba(16, 42, 67, 1);
--color-neutral-dark-green: rgba(15, 31, 26, 1);
--color-gray-md: #d1d5db;

/* New: Light backgrounds for notifications */
--color-background-success-light: #f7fcf6;
--color-background-error-light: #fff4f4;
--color-background-neutral-light: rgba(250, 249, 244, 0.95);
```

---

## 6. Refactoring Priority Roadmap

### Phase 1: HIGH PRIORITY (🔴)
1. **App.css** - Fix body gradient and alert gradients
2. **Inicio.css** - Fix notification backgrounds and inconsistent reds
3. **PainelOrcamento.css** - Fix progress bar colors
4. **SimuladorDepositos.css** - Review teal colors
5. **ListaDespesas.css** - Fix error color inconsistency

**Impact:** Fixes visual inconsistencies with red/error color system

### Phase 2: MEDIUM PRIORITY (🟡)
1. All opacity variants of primary colors → Create new opacity variables
2. All shadows → Use shadow variable system (already defined)
3. Navigation, Forms, Popups → Replace with variables

**Impact:** Centralizes color management and improves maintainability

### Phase 3: REVIEW & ALIGNMENT (⚠️)
1. **Determine if these colors are intentional:**
   - `#ef4444` red (vs `#c74c3e` error)
   - Teal colors (56, 178, 172 and variants)
   - Blue-ish grays (16, 42, 67)
   
2. **If intentional:** Define them in App.css properly
3. **If unintentional:** Replace with existing system colors

---

## 7. Summary of Unique Hardcoded Colors

Total unique hardcoded color values:
- ✓ **13 colors** map to existing CSS variables
- ⚠️ **17 colors** need review/new variables

### Already in System (can use `var()`)
- `#2d9057`, `#1f5540`, `#52b788` (greens)
- `#f5f0e8`, `#faf8f5`, `#ffffff` (surfaces)
- `#1a1a1a`, `#5a5450` (text)
- `#c74c3e`, `#a03a2f` (errors)
- All opacity versions of above

### NOT in System (Need Adding/Review)
- `#ef4444` / `rgb(239, 68, 68)` - Red alternative
- `#ff7f7f`, `#e46060` - Red gradients
- `#f7fcf6`, `#fff4f4` - Notification backgrounds
- `#d1d5db` - Gray border
- `rgba(56, 178, 172, X)` - Teal
- `rgba(208, 234, 224, X)` - Light teal
- `rgba(141, 203, 184, X)` - Teal alt
- `rgba(16, 42, 67, X)` - Blue-gray
- `rgba(15, 31, 26, X)` - Dark green-gray
- Other custom gradients and opacity values

---

## 8. Quick Reference: Color Replacement Strategy

| Pattern | Replace With | Example |
|---------|--------------|---------|
| `rgba(45, 144, 87, X)` | `rgba(var(--color-green-primary-rgb), X)` or `hsla(var(--color-green-primary-hsl), X%)` | `rgba(var(--color-green-primary-rgb), 0.12)` |
| `#2d9057` | `var(--color-green-primary)` | — |
| `#f5f0e8` | `var(--color-surface)` | — |
| `rgba(199, 76, 62, X)` | `rgba(var(--color-error-rgb), X)` | — |
| Non-system colors | Create new variables first | ⚠️ Needs decision |

---

## Recommendation

1. **First:** Add RGB variants of existing colors to App.css for opacity control
2. **Second:** Audit "non-system" colors with design team
3. **Third:** Replace hardcoded values systematically per priority

This will ensure consistency, maintainability, and correct visual hierarchy.
