import { gql } from '@apollo/client'
import SiteLayout from 'components/SiteLayout/SiteLayout'

const Archive = {
  name: 'Archive',
}

Archive.variables = ({ id }) => {
  return {
    id,
  }
}

Archive.query = gql`
  query GetContentType($id: ID!) {
    archive: contentType(id: $id) {
      __typename
      id
      uri
      name
      description
      graphqlPluralName
      contentNodes {
        nodes {
          __typename
          ... on ExtensionPlugin {
            id
            title
            uri
            content
            extensionFields {
              pluginHost
              pluginLink
              pluginReadmeLink
            }
          }
        }
      }
    }
  }
`

Archive.loading = () => {
  <h2>Loading...</h2>
}

Archive.error = () => {
  <h2>Error...</h2>
}

Archive.component = ({ data: { archive } }) => (
  <>
    <SiteLayout>
      <div className="divide-y divide-gray-200 dark:divide-gray-700 max-w-lg mx-auto lg:max-w-8xl">
        <div className="space-y-2 pt-6 pb-8 md:space-y-5 ">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {archive?.graphqlPluralName ?? 'Archive'}
          </h1>
          <p className="text-lg leading-7 text-gray-500 dark:text-gray-400">
            {archive?.description ?? null}
          </p>
        </div>
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {archive?.contentNodes?.nodes?.map((post) => (
            <li key={post.id} className="py-12">
              <pre>{JSON.stringify(post, null, 2)}</pre>
            </li>
          ))}
        </ul>
      </div>
    </SiteLayout>
  </>
)

export default Archive
