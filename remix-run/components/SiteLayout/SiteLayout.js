import SiteHeader from '../SiteHeader/SiteHeader'

const SiteLayout = ({ children }) => {
  return (
    <>
      <SiteHeader />
      {children}
    </>
  )
}

export default SiteLayout
