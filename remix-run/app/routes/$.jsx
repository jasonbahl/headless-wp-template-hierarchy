import { useQuery, gql } from '@apollo/client'
import { getTemplateForSeedNode, SEED_QUERY } from '../../wp-remix/template';
import { initApollo } from '../context/apollo'
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/server-runtime";

const GET_POSTS = gql`
{
  posts {
    nodes {
      id
      title
    }
  }
}
`

export const loader = async (props) => {
  console.log( { props })
  const { params } = props
  const apolloClient = initApollo();

  const uri = params['*'] ?? null;
  if ( ! uri ) {
    return null;
  }
  const root = await apolloClient.query({ query: SEED_QUERY, variables: { uri } } );

  const rootNode = root.data.node ?? null

  if (!rootNode) {
    // we know we can't render the component
    // so throw immediately to stop executing code
    // and show the not found page
    throw new Response("Not Found", { status: 404 });
  }

  const template = getTemplateForSeedNode(rootNode);
  const { query, variables } = template;
  const { data } = await apolloClient.query({ query, variables });

  return json({
    uri,
    params,
    rootNode,
    pageData: data,
  })
}

const Index = (props) => {

  const loaded  = useLoaderData();
  const { rootNode, pageData } = loaded;

  const template = getTemplateForSeedNode(rootNode);
  const { query, variables } = template;
  const Component = template.component ?? <h2>Fallback Template...</h2>

  const { data, loading, error } = useQuery(query, {
      variables, 
      ssr: true
  })

  return <Component error loading data={data ?? pageData } />

}

export default Index;