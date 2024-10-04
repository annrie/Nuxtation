import { SameAs, SiteDescription, SiteImage, SiteLanguage, SiteLogo, MySite, SiteName, ogTitle, twitterDescription, twitterCard, twitterImage, twitterSite, appleMobileWebAppStatusBarStyle } from '~/logic'

export function useSiteMeta() {
  return {
    name: SiteName,
    description: SiteDescription,
    sameAs: SameAs,
    image: SiteImage,
    logo: SiteLogo,
    lang: SiteLanguage,
    host: SiteUrl,
  }
}