import HomepageCta from '../components/HomepageCta/HomepageCta'
import HomepageFeatures from '../components/HomepageFeatures/HomepageFeatures'
import HomepageFrameworks from '../components/HomepageFrameworks/HomepageFrameworks'
import HomepageHero from '../components/HomepageHero/HomepageHero'
import HomePageTrust from '../components/HomepageTrust/HomepageTrust'
import SiteLayout from '../components/SiteLayout/SiteLayout'
import SiteFooter from '../components/SiteFooter/SiteFooter'

const Home = () => {
  return (
    <SiteLayout>
      <HomepageHero />
      <HomepageFrameworks />
      <HomepageFeatures />
      <HomePageTrust />
      <HomepageCta />
      <SiteFooter />
    </SiteLayout>
  )
}

export default Home

Home.layoutProps = {
  meta: {
    title: 'WPGraphQL - The GraphQL API for WordPress',
  },
}
