import { wordPressServerSideProps, WordPressNode } from 'wp-next'

export default WordPressNode


// To use SSR (Server Side Rendering) instead of SSG (Static Site Generation)
// use the following, instead of `getStaticPaths` and `getStaticProps`
// 
// export async function getStaticProps(context) {
//  return await wordPressServerSideProps(context)
// }

export async function getStaticProps(context) {  
  return await wordPressServerSideProps(context)
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: 'blocking',
  }
}