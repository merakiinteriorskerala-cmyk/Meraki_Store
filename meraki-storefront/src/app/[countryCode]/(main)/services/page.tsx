import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services - Meraki Interior Factory",
  description: "Factory-level interior manufacturing services: Cutting, Edge Banding, Lamination, and more.",
}

export default function ServicesPage() {
  const services = [
    {
      title: "Panel Saw Cutting Services",
      description: "High-precision cutting for interior panels and modular components.",
      features: [
        "Custom sizes as per design drawings",
        "High accuracy and clean finish",
        "Ideal for kitchens, wardrobes, cabinets & furniture",
        "Suitable for bulk and repeat production",
      ],
    },
    {
      title: "Laminate Pressing Services",
      description: "Professional lamination pressing for durable and smooth finishes.",
      features: [
        "Cold press lamination",
        "Single-side and double-side lamination",
        "Strong bonding with uniform surface finish",
        "Suitable for Plywood, MDF & Other Boards",
      ],
    },
    {
      title: "Edge Banding Services",
      description: "Automatic edge banding for a premium and long-lasting finish.",
      features: [
        "PVC and Acrylic edge banding",
        "Seamless, chip-free edges",
        "Multiple thickness options available",
        "Improves durability and appearance",
      ],
    },
    {
      title: "Drilling & Grooving",
      description: "Precision drilling and grooving for easy modular assembly.",
      features: [
        "Hinge cup drilling",
        "Shelf pin holes",
        "Drawer channel grooves",
        "Accurate alignment for fast installation",
      ],
    },
    {
      title: "Custom Panel Manufacturing",
      description: "Factory-made panels tailored to your exact requirements.",
      features: [
        "Cut, laminated, edge-banded panels",
        "Custom sizes, finishes & specifications",
        "Ready-to-install interior components",
      ],
    },
    {
      title: "Bulk & Project Manufacturing",
      description: "Reliable production support for large interior projects.",
      features: [
        "High-volume manufacturing capability",
        "Consistent quality across batches",
        "Suitable for builders, showrooms & modular brands",
        "Time-bound production & delivery",
      ],
    },
    {
      title: "Quality Inspection & Finishing",
      description: "Every panel goes through quality checks before dispatch.",
      features: [
        "Surface finish inspection",
        "Edge quality verification",
        "Safe packaging for transport",
      ],
    },
  ]

  const whoWeServe = [
    "Interior Designers",
    "Carpenters",
    "Modular Kitchen Dealers",
    "Builders & Developers",
    "Furniture Manufacturers",
  ]

  const whyChooseUs = [
    "Advanced Machinery",
    "Consistent factory-level quality",
    "Precision manufacturing",
    "Customization as per requirement",
    "Reliable partner for interior professionals",
  ]

  return (
    <div className="content-container py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Our Factory Services</h1>
        <p className="text-lg text-ui-fg-subtle max-w-2xl mx-auto">
          Precision Manufacturing Solutions for Interior Professionals. We provide advanced factory-level services with a focus on accuracy, consistency, and timely delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
        {services.map((service, index) => (
          <div key={index} className="bg-ui-bg-subtle p-8 rounded-lg border border-ui-border-base hover:shadow-md transition-shadow">
            <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
            <p className="text-ui-fg-base mb-6 font-medium">{service.description}</p>
            <ul className="space-y-2">
              {service.features.map((feature, idx) => (
                <li key={idx} className="flex items-start text-sm text-ui-fg-subtle">
                  <span className="mr-2 text-ui-fg-base">•</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24">
        <div>
          <h2 className="text-3xl font-bold mb-8">Who We Serve</h2>
          <ul className="grid grid-cols-1 gap-4">
            {whoWeServe.map((item, index) => (
              <li key={index} className="flex items-center p-4 bg-ui-bg-subtle rounded-md border border-ui-border-base">
                <span className="w-2 h-2 bg-neutral-900 rounded-full mr-4"></span>
                <span className="text-lg font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-8">Why Choose Us</h2>
          <ul className="grid grid-cols-1 gap-4">
            {whyChooseUs.map((item, index) => (
              <li key={index} className="flex items-center p-4 bg-ui-bg-subtle rounded-md border border-ui-border-base">
                <span className="w-2 h-2 bg-neutral-900 rounded-full mr-4"></span>
                <span className="text-lg font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}