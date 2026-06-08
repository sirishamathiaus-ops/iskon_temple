import { ABOUT_NAV } from '@/content/aboutPages'
import { FESTIVAL_CATALOG, FESTIVAL_NAV_ORDER } from '@/content/festivalCatalog'
import type { NavDropdownItem } from '@/components/navigation/NavDropdown'

export const ABOUT_DROPDOWN: NavDropdownItem[] = ABOUT_NAV.map((item) => ({
  label: item.label,
  to: item.path,
}))

export const FESTIVAL_DROPDOWN: NavDropdownItem[] = [
  ...FESTIVAL_NAV_ORDER.map((slug) => {
    const meta = FESTIVAL_CATALOG[slug]
    const name =
      meta?.name ??
      slug
        .replace(/-20\d{2}$/, '')
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    return {
      label: name,
      to: `/festivals/${slug}`,
    }
  }),
  { label: 'All festivals', to: '/festivals' },
]
