const { getIntrospectionQuery, buildClientSchema } = require('graphql')
const request = require("sync-request")

const converter = require('graphql-2-json-schema');

module.exports = function (graphUrl, authHeader) { 
    const requestBody = {
        operationName: "IntrospectionQuery",
        query: getIntrospectionQuery()
    };

    const headers = authHeader ? Object.fromEntries([authHeader.split(":")]) : {};

    const responseBody = request("POST", graphUrl, {
        headers,
        json: requestBody
    }).getBody('utf8');

    const introspectionResponse = JSON.parse(responseBody);   

    const graphQLSchema = buildClientSchema(introspectionResponse.data);
    const jsonSchema = converter.fromIntrospectionQuery(introspectionResponse.data);

    return {
        jsonSchema,
        graphQLSchema
    }
}
