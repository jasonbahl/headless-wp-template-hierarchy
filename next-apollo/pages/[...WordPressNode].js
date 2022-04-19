import { wordPressServerSideProps, WordPressNode } from 'wp-next'

export default WordPressNode

export async function getServerSideProps(context) {
  return wordPressServerSideProps(context)
}