type Props = {
  heading: string
  body: string
}

/** Intro block for Deities timetable — visually distinct from story & schedule */
export function AboutDailyWorship({ heading, body }: Props) {
  return (
    <section
      className="mt-10 overflow-hidden rounded-3xl border border-maroon-900/12 bg-white shadow-card sm:mt-12"
      aria-labelledby="daily-worship-heading"
    >
      <div className="grid md:grid-cols-[minmax(0,11rem)_1fr]">
        <div className="flex flex-col items-center justify-center bg-maroon-900 px-6 py-8 text-center md:py-10">
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-gold-400/50 bg-maroon-800"
            aria-hidden
          >
            <span className="font-display text-2xl text-gold-300">ॐ</span>
          </div>
          <p className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold-200">Temple seva</p>
        </div>
        <div className="border-t border-maroon-900/8 p-6 md:border-l md:border-t-0 md:p-8">
          <h3 id="daily-worship-heading" className="font-display text-2xl text-maroon-900 md:text-3xl">
            {heading}
          </h3>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-maroon-800 md:text-lg">{body}</p>
        </div>
      </div>
    </section>
  )
}
