import type { FestivalMeta } from '@/content/festivalCatalog'

export type FestivalHeroIntrinsicLayout = {
  type: 'intrinsic'
  width: number
  height: number
}

export type FestivalHeroLandscapeLayout = {
  type: 'landscape'
}

export type FestivalHeroLayout = FestivalHeroIntrinsicLayout | FestivalHeroLandscapeLayout

/** Hero sizing from real image dimensions — full photo visible, balanced width & height. */
export function getFestivalHeroLayout(meta: FestivalMeta): FestivalHeroLayout {
  if (meta.heroIntrinsicSize) {
    return {
      type: 'intrinsic',
      width: meta.heroIntrinsicSize.width,
      height: meta.heroIntrinsicSize.height,
    }
  }
  return { type: 'landscape' }
}
