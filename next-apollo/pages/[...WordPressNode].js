import { wordPressServerSideProps, WordPressNode } from 'wp-next'

const WordPressNodeTemplate = props => {
    return <WordPressNode {...props} />
}

export default WordPressNodeTemplate

// export async function getServerSideProps(context) {
//  return await wordPressServerSideProps(context)
// }

export async function getStaticProps(context) {
    return await wordPressServerSideProps(context)
}

export async function getStaticPaths() {
    return {
        paths: [],
        fallback: 'blocking'
    }
}