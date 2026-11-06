import {
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Github,
  Youtube,
  Music,
  Mail,
  Phone,
  MapPin,
  Globe,
  ShoppingBag,
  Camera,
  Video,
  MessageCircle,
  LinkIcon,
  type LucideIcon,
} from "lucide-react"

export interface SocialPlatform {
  name: string
  icon: LucideIcon
  color: string
  pattern: RegExp
}

export const socialPlatforms: SocialPlatform[] = [
  {
    name: "Facebook",
    icon: Facebook,
    color: "#1877F2",
    pattern: /facebook\.com|fb\.com|fb\.me/i,
  },
  {
    name: "Instagram",
    icon: Instagram,
    color: "#E4405F",
    pattern: /instagram\.com|instagr\.am/i,
  },
  {
    name: "Twitter",
    icon: Twitter,
    color: "#1DA1F2",
    pattern: /twitter\.com|x\.com/i,
  },
  {
    name: "LinkedIn",
    icon: Linkedin,
    color: "#0A66C2",
    pattern: /linkedin\.com/i,
  },
  {
    name: "GitHub",
    icon: Github,
    color: "#181717",
    pattern: /github\.com/i,
  },
  {
    name: "YouTube",
    icon: Youtube,
    color: "#FF0000",
    pattern: /youtube\.com|youtu\.be/i,
  },
  {
    name: "TikTok",
    icon: Music,
    color: "#000000",
    pattern: /tiktok\.com/i,
  },
  {
    name: "Spotify",
    icon: Music,
    color: "#1DB954",
    pattern: /spotify\.com/i,
  },
  {
    name: "WhatsApp",
    icon: MessageCircle,
    color: "#25D366",
    pattern: /whatsapp\.com|wa\.me/i,
  },
  {
    name: "Telegram",
    icon: MessageCircle,
    color: "#0088CC",
    pattern: /telegram\.org|t\.me/i,
  },
  {
    name: "Discord",
    icon: MessageCircle,
    color: "#5865F2",
    pattern: /discord\.gg|discord\.com/i,
  },
  {
    name: "Twitch",
    icon: Video,
    color: "#9146FF",
    pattern: /twitch\.tv/i,
  },
  {
    name: "Pinterest",
    icon: Camera,
    color: "#E60023",
    pattern: /pinterest\.com|pin\.it/i,
  },
  {
    name: "Snapchat",
    icon: Camera,
    color: "#FFFC00",
    pattern: /snapchat\.com/i,
  },
  {
    name: "Shop",
    icon: ShoppingBag,
    color: "#5C6BC0",
    pattern: /shop|store|etsy\.com|shopify\.com/i,
  },
]

export const contactIcons = {
  email: Mail,
  phone: Phone,
  location: MapPin,
  website: Globe,
  link: LinkIcon,
}

export function detectSocialPlatform(url: string | null): SocialPlatform | null {
  if (!url) return null

  for (const platform of socialPlatforms) {
    if (platform.pattern.test(url)) {
      return platform
    }
  }

  return null
}

export function getIconForLink(
  url: string | null,
  type: string,
): {
  icon: LucideIcon
  color: string
  name: string
} {
  // Check for social platforms first
  const social = detectSocialPlatform(url)
  if (social) {
    return { icon: social.icon, color: social.color, name: social.name }
  }

  // Check for contact types
  if (url?.startsWith("mailto:")) {
    return { icon: contactIcons.email, color: "#EA4335", name: "Email" }
  }
  if (url?.startsWith("tel:")) {
    return { icon: contactIcons.phone, color: "#34A853", name: "Phone" }
  }

  // Default based on type
  return { icon: LinkIcon, color: "#6B7280", name: "Link" }
}
