'use client'

import ServiceCard from "./service-card"
import AnimatedServiceCard from "./animated-service-card"
import { useState } from "react"


const services = [
  {
    title: "Panel Saw Cutting Services",
    description: "High-precision cutting for interior panels and modular components.",
    features: [
      "Custom sizes as per design drawings",
      "High accuracy and clean finish",
      "Ideal for kitchens & wardrobes",
      "Suitable for bulk production",
    ],
    imageSrc: "/images/precision_cutting.png",
  },
  {
    title: "Laminate Pressing Services",
    description: "Professional lamination pressing for durable and smooth finishes.",
    features: [
      "Cold press lamination",
      "Single & double-side options",
      "Strong bonding & uniform finish",
      "For Plywood, MDF & Boards",
    ],
    imageSrc: "/images/lamination.png",
  },
  {
    title: "Edge Banding Services",
    description: "Automatic edge banding for a premium and long-lasting finish.",
    features: [
      "PVC and Acrylic edge banding",
      "Seamless, chip-free edges",
      "Multiple thickness options",
      "Enhanced durability",
    ],
    imageSrc: "/images/edge_banding.png",
  },
  {
    title: "Drilling & Grooving",
    description: "Precision drilling and grooving for easy modular assembly.",
    features: [
      "Hinge cup drilling",
      "Shelf pin holes",
      "Drawer channel grooves",
      "Fast installation alignment",
    ],
    imageSrc: "/images/drilling&grooving.png",
  },
  {
    title: "Custom Panel Manufacturing",
    description: "Factory-made panels tailored to your exact requirements.",
    features: [
      "Cut, laminated, edge-banded",
      "Custom sizes & finishes",
      "Ready-to-install components",
    ],
    imageSrc: "/images/custom_panel_manufacturing.png",
  },
  {
    title: "Bulk & Project Manufacturing",
    description: "Reliable production support for large interior projects.",
    features: [
      "High-volume capability",
      "Consistent batch quality",
      "For builders & showrooms",
      "Time-bound delivery",
    ],
    imageSrc: "/images/bulk.png",
  },
  {
    title: "Quality Inspection & Finishing",
    description: "Every panel goes through quality checks before dispatch.",
    features: [
      "Surface finish inspection",
      "Edge quality verification",
      "Safe packaging for transport",
    ],
    imageSrc: "/images/inspection.png",
  },
]

const Services = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const submitQuote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSending(true)
    setStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/custom-quote", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(form),
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(text || "Request failed")
      }

      setStatus("success")
      setForm({ name: "", email: "", phone: "", message: "" })
    } catch (error) {
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Request failed")
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section id="services" className="py-32 bg-white relative overflow-hidden">
      {/* SaaS-style Dot Pattern Background */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      <div className="content-container relative z-10">
        {/* Minimal Header */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs font-medium text-neutral-600 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-500"></span>
            </span>
            OUR EXPERTISE
          </div>
          
          <h2 className="text-4xl md:text-5xl font-sans font-bold mb-6 text-neutral-900 tracking-tight">
            Precision Manufacturing
            <span className="text-neutral-400 block mt-2">At Industrial Scale</span>
          </h2>
          
          <p className="text-lg text-neutral-500 font-light leading-relaxed">
            Advanced factory-level services designed for interior professionals. 
            Experience consistency, accuracy, and speed with our automated production lines.
          </p>
        </div>
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          {services.map((service, index) => (
            <AnimatedServiceCard key={index} service={service} index={index} />
          ))}
        </div>
        
        {/* Minimal CTA Section */}
        <div className="mt-32 pt-16 border-t border-neutral-100">
          <div className="flex flex-col items-center text-center">
            <h3 className="text-2xl font-semibold text-neutral-900 mb-4">
              Ready to start your production?
            </h3>
            <p className="text-neutral-500 mb-8 max-w-lg">
              Join hundreds of interior designers and contractors who trust Meraki for their manufacturing needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setIsOpen(true)}
                className="px-6 py-3 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-all shadow-sm hover:shadow-md active:transform active:scale-95"
              >
                Get a Custom Quote
              </button>
            </div>

            {isOpen && (
              <form
                onSubmit={submitQuote}
                className="mt-8 w-full max-w-2xl rounded-2xl border border-neutral-200 bg-white p-6 text-left shadow-sm"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                    placeholder="Full name"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    required
                  />
                  <input
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                    placeholder="Email address"
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    required
                  />
                  <input
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                    placeholder="Phone"
                    value={form.phone}
                    onChange={(event) => updateField("phone", event.target.value)}
                  />
                </div>
                <textarea
                  className="mt-4 w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm"
                  placeholder="Tell us about your requirement"
                  rows={4}
                  value={form.message}
                  onChange={(event) => updateField("message", event.target.value)}
                  required
                />
                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="px-5 py-2.5 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-all disabled:opacity-60"
                  >
                    {isSending ? "Sending..." : "Send request"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-5 py-2.5 text-sm font-medium text-neutral-600"
                  >
                    Close
                  </button>
                </div>
                {status === "success" && (
                  <p className="mt-3 text-sm text-green-700">
                    Thanks. We received your request and will contact you soon.
                  </p>
                )}
                {status === "error" && (
                  <p className="mt-3 text-sm text-red-600">
                    {errorMessage || "Unable to send request."}
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services