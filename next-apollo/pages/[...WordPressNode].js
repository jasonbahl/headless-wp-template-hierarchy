import { gql } from '@apollo/client'
import { wordPressServerSideProps, WordPressNode } from 'wp-next'

// const templates = {
//     'singular': {
//         query: gql`{__typename}`,
//         component: props => {
//             return (
//                 <>
//                     <h2>This is my custom singular template</h2>
//                     <pre>{JSON.stringify(props, null, 2)}</pre>
//                 </>
//             )
//         }
//     }
// }


const WordPressNodeTemplate = props => {
    return <WordPressNode templates={{}} {...props} />
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