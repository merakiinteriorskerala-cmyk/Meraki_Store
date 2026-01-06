import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us - Meraki Interior Factory",
  description: "Precision Manufacturing Solutions for Interior Professionals",
}

export default function AboutPage() {
  return (
    <div className="content-container py-12">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold">About Meraki Interior Factory</h1>
        <p className="text-lg text-ui-fg-subtle leading-relaxed">
          Meraki Interior Factory provides advanced factory-level interior manufacturing services with a focus on accuracy, consistency, and timely delivery. We partner with interior designers and contractors, carpenters, modular kitchen dealers, builders, and furniture manufacturers to deliver high-quality interior components.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="bg-ui-bg-subtle p-8 rounded-lg border border-ui-border-base">
            <h3 className="text-xl font-semibold mb-4">Our Commitment</h3>
            <p className="text-ui-fg-subtle">
              We are dedicated to providing precision manufacturing solutions that empower interior professionals. From custom panel manufacturing to bulk project support, we ensure that every component meets the highest standards of quality and durability.
            </p>
          </div>
          <div className="bg-ui-bg-subtle p-8 rounded-lg border border-ui-border-base">
            <h3 className="text-xl font-semibold mb-4">Why Partner With Us?</h3>
            <ul className="list-disc list-inside text-ui-fg-subtle space-y-2">
              <li>Advanced Machinery & Technology</li>
              <li>Consistent Factory-Level Quality</li>
              <li>Precision Manufacturing</li>
              <li>Customization per Requirement</li>
              <li>Reliable Support for Professionals</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-24 border-t border-ui-border-base pt-16 text-center">
        <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
        <p className="text-lg text-ui-fg-subtle mb-12 max-w-2xl mx-auto">
          Looking for a Reliable Interior Factory Partner? Contact us today to discuss your requirements and get a customized manufacturing solution.
        </p>

        <div className="bg-ui-bg-subtle p-8 rounded-lg border border-ui-border-base flex flex-col gap-8 text-left max-w-3xl mx-auto">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold text-ui-fg-base">Meraki Interior Factory</h3>
            <p className="text-ui-fg-subtle">
              8/244-F, Alumkunnu, Chottupara, Kilannur,<br />
              Thrissur, Kerala - 680 581
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm uppercase tracking-wider text-ui-fg-muted mb-2">Phone</h3>
              <p className="text-lg font-medium text-ui-fg-base">+91 90726 06032</p>
            </div>
            <div>
              <h3 className="text-sm uppercase tracking-wider text-ui-fg-muted mb-2">Email</h3>
              <p className="text-lg font-medium text-ui-fg-base">merakiinteriorskerala@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}