const express = require('express');
const { send } = require('express/lib/response');
const app = express()
const port = 3000
const fetch = require('node-fetch');

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

const sendTemplates = ( { _req, res, templates, data } ) => {

    // filter out duplicate templates
    const uniqueTemplates = [...new Set(templates)];

    res.send(`
        <h2>URI</h2>
        <pre>${JSON.stringify(data?.data?.node?.uri ?? 'unknown', null, 2)}</pre>
        <h2>Templates</h2>
        <pre>${JSON.stringify(uniqueTemplates,null,2)}</pre>
        <h2>Node By Uri</h2>
        <pre>${JSON.stringify(data,null,2)}</pre>
    `)
}

const trimmedUri = (uri) => {
    if (uri.charAt(0) == "/") uri = uri.substr(1);
    if (uri.charAt(uri.length - 1) == "/") uri = uri.substr(0, uri.length - 1);
    return uri;
}

const getPageTemplates = (templates, node) => {

    const typeName = node?.contentType?.node?.name ?? 'page';

    templates.unshift('singular.js');
    templates.unshift('page.js');
    if ( node?.databaseId ) {
        templates.unshift( `${typeName}-${node.databaseId}.js (page-databasId)` );
    }
    if ( node?.slug ) {
        templates.unshift( `${typeName}-${node.slug}.js (page-slug)` );
    }
    if ( node?.template?.templateName) {
        templates.unshift(`template-${node.template.templateName}.js (custom-template)`);
    }

    return templates;
}

app.get('/*', async (req, res) => {

    const uri = '' === req.params['0'] ? '/' : req.params['0'];
    console.log( uri )
    const data = await getNodeByUri( uri );
    const node = data.data.node ?? null;

    let templates = ['index.js'];

    // If there is no node, 404, dawg
    // This is probably where resolving to other things like favicon, etc also need to be handled?
    // Like if there's no WordPress node, what if the url is for a static file, etc?
    if ( null === node ) {
        templates.unshift('404.js');
        return sendTemplates( { _req: req, res, templates, data } );
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

        return sendTemplates({ req, res, templates, data });
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
        return sendTemplates({ req, res, templates, data });
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

        return sendTemplates({ req, res, templates, data });
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

        return sendTemplates({ req, res, templates, data });
    }

    switch ( node.__typename ) {
        case 'ContentType':
            templates.unshift('archive.js');
            break;
        case 'User':
            templates.unshift('author.js');
            break;
    }

    return sendTemplates( { req, res, templates, data } );
    
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})