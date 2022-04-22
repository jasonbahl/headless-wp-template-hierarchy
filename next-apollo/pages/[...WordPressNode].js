import { gql } from '@apollo/client'
import { initializeApollo } from 'lib/data/apollo'
import { wordPressServerSideProps, WordPressNode } from 'wp-next'

export default WordPressNode


// To use SSR (Server Side Rendering) instead of SSG (Static Site Generation)
// use the following, instead of `getStaticPaths` and `getStaticProps`
// 
export async function getServerSideProps(context) {
 return await wordPressServerSideProps(context)
}

// export async function getStaticProps(context) {  
//   return await wordPressServerSideProps(context)
// }

// const CONTENT_TYPES_QUERY = gql`
//   query GetContentTypes {
//     contentTypes(first:100) {
//       nodes {
//         id
//         name
//         archivePath
//       }
//     }
//   }
//   `

// const TAXONOMY_QUERY = gql`
// query GetTaxonomies {
//   taxonomies(first:100) {
//     nodes {
//       id
//       name
//       archivePath
//     }
//   }
// }
// `

// export async function getStaticPaths() {

//   const apolloClient = initializeApollo()
//   let paths = [];
//   const contentTypes = await apolloClient.query({ query: CONTENT_TYPES_QUERY })
//   contentTypes?.data?.contentTypes.nodes.map((contentType) => {
//     paths.push( contentType.archivePath )
//   })

//   const taxonomies = await apolloClient.query({ query: TAXONOMY_QUERY })
//   taxonomies?.data?.taxonomies.nodes.map((taxonomy) => {
//     paths.push( {
//       params: {
//         path: taxonomy.archivePath }
//       }
//     )
//   })

//   console.log('paths', paths.filter(path => {
//     return path && path !== '/'
//   }))
  
//   return {
//     paths: paths,
//     fallback: 'blocking',
//   }
// }