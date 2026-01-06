import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog - Meraki Interior Factory",
}

export default function BlogPage() {
  return (
    <div className="content-container py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <div className="grid grid-cols-1 gap-8 max-w-2xl mx-auto">
        {[1, 2, 3].map((item) => (
          <article key={item} className="border-b border-ui-border-base pb-8">
            <h2 className="text-2xl font-semibold mb-2">Capturing the Essence of Home</h2>
            <p className="text-sm text-ui-fg-muted mb-4">June 22, 2023</p>
            <p className="text-ui-fg-subtle">
              The concept of home has evolved significantly throughout human history, shaped by cultural, technological, and societal changes...
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}