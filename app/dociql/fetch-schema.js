const graphql = require('graphql')
const request = require("sync-request")

const converter = require('graphql-2-json-schema');

module.exports = function (graphUrl) {

    const requestBody = {
        query: graphql.introspectionQuery
    };

    const responseBody = request("POST", graphUrl, {
        json: requestBody
    }).getBody('utf8');

    const introspectionResponse = JSON.parse(responseBody);
    const mutations = introspectionResponse.data.__schema.types.filter(a => a.name === 'Mutation')[0];
    const queries = introspectionResponse.data.__schema.types.filter(a => a.name === 'Query')[0];
    const jsonSchema = converter.fromIntrospectionQuery(introspectionResponse.data);
    const graphQLSchema = graphql.buildClientSchema(introspectionResponse.data, { assumeValid: true });

    return {
        jsonSchema,
        graphQLSchema,
        queries,
        mutations
    }
}
