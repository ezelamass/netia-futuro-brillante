

# Plan: Terms & Privacy Checkboxes on Register Page

## What to do

1. **Copy PDFs to `/public`**
   - `user-uploads://Politica_de_Privacidad_NETIA.pdf` → `public/Politica_de_Privacidad_NETIA.pdf`
   - `user-uploads://TERMINOS_Y_CONDICIONES.pdf` → `public/TERMINOS_Y_CONDICIONES.pdf`

2. **Modify `src/pages/Register.tsx`**
   - Add two boolean states: `acceptedTerms` and `acceptedPrivacy`
   - Add two checkbox rows below the role selector, each with:
     - A `Checkbox` component
     - Label text with a download link (`<a href="/TERMINOS_Y_CONDICIONES.pdf" target="_blank" download>`) styled as an underlined white link
   - First checkbox: "Acepto los **Términos y Condiciones**" (link downloads the PDF)
   - Second checkbox: "Acepto la **Política de Privacidad**" (link downloads the PDF)
   - Disable the "Crear cuenta" button unless both checkboxes are checked (`disabled={isLoading || !acceptedTerms || !acceptedPrivacy}`)
   - Import `Checkbox` from `@/components/ui/checkbox`

## Files

| Action | File |
|--------|------|
| Copy | `public/Politica_de_Privacidad_NETIA.pdf` |
| Copy | `public/TERMINOS_Y_CONDICIONES.pdf` |
| Modify | `src/pages/Register.tsx` — add states, checkboxes, download links, disable button |

