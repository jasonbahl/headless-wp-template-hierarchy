import { gql } from '@apollo/client'
import { Link } from "@remix-run/react";

export const PostPreviewFragment = gql`
  fragment PostPreview on Post {
    id
    title
    uri
    categories {
      nodes {
        id
        name
        uri
      }
    }
    excerpt: content
    date
    author {
      node {
        id
        name
        uri
        avatar {
          url
        }
      }
    }
  }
`

const PostPreview = ({ post }) => {
  if (!post) {
    return null
  }

  const paragraphs = post?.excerpt ? post.excerpt.split('</p>') : null
  const excerpt = paragraphs ? paragraphs[0] + '</p>' : null
  const date = post?.date
    ? new Date(post.date).toLocaleDateString('en-us', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <article className="space-y-2 xl:grid xl:grid-cols-4 xl:items-baseline xl:space-y-0">
      <dl>
        <dt className="sr-only">Published on</dt>
        <dd className="text-base font-medium leading-6 text-gray-500 dark:text-gray-400">
          <time dateTime={post.date}>{date}</time>
        </dd>
      </dl>
      <div className="space-y-5 xl:col-span-3">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold leading-8 tracking-tight">
              <Link to={post.uri} className="text-gray-900 dark:text-gray-100">
                {post.title}
              </Link>
            </h2>
            <div className="flex flex-wrap">
              {post?.categories?.nodes?.map((category, i) => (
                <Link key={i} to={category.uri} className="mr-3 text-sm font-medium uppercase text-sky-500 dark:text-sky-300 hover:text-primary-600 dark:hover:text-sky-400">
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <div
            className="prose dark:prose-dark max-w-none text-gray-500 dark:text-gray-400"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
        </div>
        <div className="text-base font-medium leading-6">
          <Link to={post.uri} className="group inline-flex items-center h-9 rounded-full text-sm font-semibold whitespace-nowrap px-5 py-2 focus:outline-none focus:ring-2 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900 focus:ring-slate-500 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 dark:hover:text-white dark:focus:ring-slate-500">
              Read more →
          </Link>
        </div>
      </div>
    </article>

  )
}

export default PostPreview
