import FeatureCard from "./FeatureCard"
import { Lock, Link2, Users, QrCode, Eye, Shield } from "lucide-react"

const Page = () => {
  return (
    <div>
      {/* ... existing code ... */}

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <FeatureCard
          icon={Lock}
          title="End-to-End Encryption"
          description="Your private content is encrypted client-side. Only you and your friends can decrypt it."
        />
        <FeatureCard
          icon={Link2}
          title="Smart Link Blocks"
          description="Organize your links with beautiful templates and control who can see each one."
        />
        <FeatureCard
          icon={Users}
          title="Friend Network"
          description="Connect with friends to share private content and stay in touch."
        />
        <FeatureCard
          icon={QrCode}
          title="QR Code Sharing"
          description="Generate QR codes for easy profile sharing at events and meetups."
        />
        <FeatureCard
          icon={Eye}
          title="Visibility Control"
          description="Set content as public, private, or friends-only with granular permissions."
        />
        <FeatureCard
          icon={Shield}
          title="Privacy First"
          description="Zero-knowledge architecture ensures your data stays yours."
        />
      </div>

      {/* ... existing code ... */}
    </div>
  )
}

export default Page
