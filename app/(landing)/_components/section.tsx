import { SectionHeader } from './section-header'

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <section className="flex flex-col space-y-6 pb-6">
      <SectionHeader title={title} />
      {children}
    </section>
  )
}

export { Section }
