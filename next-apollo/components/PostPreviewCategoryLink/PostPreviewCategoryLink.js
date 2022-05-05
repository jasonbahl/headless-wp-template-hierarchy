import { gql } from "@apollo/client"
import { Link } from "react-scroll"

export const PostPreviewCategoryLinkFragment = gql`
fragment PostPreviewCategoryLink on Category {
    id
    name
    uri
}
`

const PostPreviewCategoryLink = ({ category }) => {

    return ( 
        <Link href={category.uri}>
            <a className="mr-3 text-sm font-medium uppercase text-sky-500 dark:text-sky-300 hover:text-primary-600 dark:hover:text-sky-400">
            {category.name}
            </a>
        </Link>
    )
}

export default PostPreviewCategoryLink