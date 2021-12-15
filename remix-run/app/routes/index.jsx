import { useLoaderData } from "remix";

const SEED_QUERY = `
  query GetNodeByUri($uri:String!){
    node: nodeByUri(uri: $uri) {
      ...NodeByUri
    }
  }
  
  fragment NodeByUri on UniformResourceIdentifiable {
    __typename
    uri
    id
    ...DatabaseIdentifier
    ...ContentType
    ...User
    ...TermNode
    ...ContentNode
    ...MediaItem
  }

  fragment DatabaseIdentifier on DatabaseIdentifier {
    databaseId
  }

  fragment MediaItem on MediaItem {
    id
    mimeType
  }
  
  fragment ContentType on ContentType {
    name
    isFrontPage
    isPostsPage
  }
  
  fragment TermNode on TermNode {
    isTermNode
    slug
    taxonomyName
  }
  
  fragment ContentNode on ContentNode {
    isContentNode
    slug
    contentType {
      node {
        name
      }
    }
    template {
      templateName
    }
  }
  
  fragment User on User {
    nicename
    databaseId
  }
`;

const getNodeByUri = async (uri) => {

    console.log( { uri })

    if ( uri === '' ) {
        uri = '/'
    }

    return await fetch('https://demo.wpgraphql.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: SEED_QUERY,
            variables: {
                uri,
            }
        })
    }).then(res=> res.json()).then(data => {
        console.log(data)
        return data
    })
}

export let loader = async ( props ) => {
    console.log("loader", props );
    const { params } = props;
    const uri = params['*'] ?? null;
    const data = await getNodeByUri(uri);

    
    return { params, data }
}

const trimmedUri = (uri) => {
    if (uri.charAt(0) == "/") uri = uri.substr(1);
    if (uri.charAt(uri.length - 1) == "/") uri = uri.substr(0, uri.length - 1);
    return uri;
}

const getTemplatesFromNode = (node, uri) => {

    let templates = ['index.js'];

    // If there is no node, 404, dawg
    // This is probably where resolving to other things like favicon, etc also need to be handled?
    // Like if there's no WordPress node, what if the url is for a static file, etc?
    if ( null === node ) {
        templates.unshift('404.js');
        return templates;
    }

    // If the uri is the front page, resolve the front page template
    if ( '/' === uri ) {
        if ( 'Page' !== node.__typename ) {

            if ( node.isPostsPage ) {
                templates.unshift('home.js');
            }
            templates.unshift('front-page.js');

            
        } else if ( 'Page' === node.__typename ) {
            // resolve page
            templates = getPageTemplates(templates, node);
            templates.unshift('front-page.js');
        }
        
        console.log( `resolve front page` ) 

        return templates;
    }

    // If the uri resolves to a node, but the node.uri is different, 
    // redirect to the node.uri
    if ( node?.uri && trimmedUri(uri) !== trimmedUri(node.uri) ) {

        console.log({
            uri,
            trimmedUri: trimmedUri(uri),
            trimmedNodeUri: trimmedUri(node.uri),
        })

        // 
        res.status(301).redirect(node.uri);
    }
    
    if ( 'User' === node?.__typename) {
        templates.unshift('archive.js');
        templates.unshift('author.js');
        if (node?.databaseId) {
            templates.unshift(`author-${node.databaseId}.js`);
        }
        if (node?.nicename) {
            templates.unshift(`author-${node.nicename}.js`);
        }
        return templates;
    }

    // If the uri is a ContentNode, resolve the template
    if ( node && node.isContentNode ) {

        const typeName = node?.contentType?.node?.name ?? 'page';
        
        templates.unshift(`singular.js`);

        switch( typeName ) {
            case 'page':
                templates = getPageTemplates( templates, node );
                break;
            case 'post':
                templates.unshift('single.js');
                templates.unshift(`single-${typeName}.js`);
                if ( node?.template?.templateName) {
                    templates.unshift(`template-${node.template.templateName}.js (custom-template)`);
                }
                break;
            case 'attachment':
                templates.unshift('single.js');
                templates.unshift('attachment.js');

                const mime = node?.mimeType.split("\/") ?? [];
                const type = mime[0] ?? null;
                const subType = mime[1] ?? null;

                if ( type ) {
                    templates.unshift(`attachment-${type}.js`);
                }

                if (subType) {
                    templates.unshift(`attachment-${subType}.js`);
                }

                if (type && subType) {
                    templates.unshift(`attachment-${type}-${subType}.js`);
                }

            default:
                templates.unshift('single.js');
                templates.unshift(`single-${typeName}.js`);
                if ( node?.slug ) {
                    templates.unshift( `single-${typeName}-${node.slug}.js (page-slug)` );
                }
                break;
        
        }

        return templates;
    }

    if ( node && node.isTermNode ) {

        templates.unshift('archive.js');

        switch( node.taxonomyName ) {
            case 'tag':
                templates.unshift('tag.js');
                if ( node?.databaseId) {
                    templates.unshift(`tag-${node.databaseId}.js (tag-databaseId)`);
                }
                if ( node?.slug) {
                    templates.unshift(`tag-${node.slug}.js (tag-slug)`);
                }
                break;
            case 'category':
                templates.unshift('category.js');
                if ( node?.databaseId) {
                    templates.unshift(`category-${node.databaseId}.js (category-databaseId)`);
                }
                if ( node?.slug) {
                    templates.unshift(`category-${node.slug}.js (category-slug)`);
                }
                break;
            default:
                templates.unshift('taxonomy.js');
                templates.unshift(`taxonomy-${node.taxonomyName}.js`);
                if ( node?.databaseId) {
                    templates.unshift(`taxonomy-${node.taxonomyName}-${node.databaseId}.js (taxonomy-databaseId)`);
                }
                break;
        }

        return templates;
    }

    switch ( node.__typename ) {
        case 'ContentType':
            templates.unshift('archive.js');
            break;
        case 'User':
            templates.unshift('author.js');
            break;
    }

    return templates;

}

export default function Uri() {

    const { params, data } = useLoaderData();
    const uri = params['*'] ?? null;
    const node = data?.data?.node ?? null;
    const templates = getTemplatesFromNode(node, uri);
    const uniqueTemplates = [...new Set(templates)];

    return (
        <div>
            <h2>URI</h2>
            <pre>{JSON.stringify(data?.data?.node?.uri ?? 'unknown', null, 2)}</pre>
            <h2>Templates</h2>
            <pre>{JSON.stringify(uniqueTemplates,null,2)}</pre>

            <h3>So, here's the problem...</h3>
            <p>We now know the template hierarchy to fallback to, but we're not allowed to do dynamic imports in React.</p>

            <p>We can't say <pre>import("./templates/" + templateName + ".js")</pre> because that's not allowed in React. (as far as I know/)</p>

            <p>Gatsby and Express can do this because it's happening in the Node layer, not the React Layer.</p>

            <p>We can see this in action [here](https://github.com/wp-graphql/wpgraphql.com/blob/master/gatsby-node.js#L58), where the template is
            decided based on information from the queried node.</p>

            <p>We can have a predictable fallback pattern, where a default template will be used if it exists,
            but more specific templates will be used if they exist.</p>

            <p>Also, if no  WordPress node is found, I want to be able to fall-back to other Remix routing conventions, and I'm not sure how to do that?</p>

            <p>Like, in my mind it would be nice to be able to do something like:</p>

            <ul>
                <li>If there's a file route, use it</li>
                <li>If not, query a node from WordPress</li>
                <li>If there's a WordPress node, determine the template to use using the template hierarchy logic</li>
                <li>If there's no WordPress node, fallback to other remix defaults, like 404, or whatever (maybe some convetion to let other data sources check for nodes?)</li>
            </ul>

            <h2>Node By Uri</h2>
            <pre>{JSON.stringify(data,null,2)}</pre>
        </div>
    );
}
