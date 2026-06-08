import { FestivalCover } from '@/components/festivals/FestivalCover'
import type { FestivalMeta } from '@/content/festivalCatalog'
import { getFestivalHeroLayout } from '@/lib/festivalHero'
import type { Festival } from '@/types'

type Props = {
  festival: Festival
  meta: FestivalMeta
}

const HERO_BG =
  'bg-gradient-to-br from-maroon-950 via-maroon-900 to-maroon-800'

export function FestivalHero({ festival, meta }: Props) {
  const layout = getFestivalHeroLayout(meta)

  if (layout.type === 'intrinsic') {
    const { width, height } = layout
    return (
      <div className={`w-full overflow-hidden ${HERO_BG}`}>
        <div
          className="relative mx-auto w-full max-h-[min(68vh,580px)] overflow-hidden"
          style={{ aspectRatio: `${width} / ${height}` }}
        >
          <FestivalCover
            festival={festival}
            fit="cover"
            wrapperClassName="absolute inset-0 h-full w-full"
            loading="eager"
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative w-full overflow-hidden ${HERO_BG} aspect-[16/10] max-h-[min(48vh,420px)] sm:aspect-[16/9] sm:max-h-[min(52vh,460px)]`}
    >
      <FestivalCover
        festival={festival}
        fit="cover"
        wrapperClassName="absolute inset-0 h-full w-full"
        loading="eager"
        sizes="100vw"
      />
    </div>
  )
}
