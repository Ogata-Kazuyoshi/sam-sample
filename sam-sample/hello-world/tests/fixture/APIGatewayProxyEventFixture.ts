import {APIGatewayProxyEvent} from "aws-lambda";

export class APIGatewayProxyEventFixture {
    static build(overrides: Partial<APIGatewayProxyEvent> = {}): APIGatewayProxyEvent {
        return {
            httpMethod: 'get',
            body: null,
            headers: {},
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/test',
            pathParameters: null,
            queryStringParameters: null,
            requestContext: {
                accountId: 'test',
                apiId: 'test',
                authorizer: {},
                httpMethod: 'get',
                identity: {
                    accessKey: '',
                    accountId: '',
                    apiKey: '',
                    apiKeyId: '',
                    caller: '',
                    clientCert: {
                        clientCertPem: '',
                        issuerDN: '',
                        serialNumber: '',
                        subjectDN: '',
                        validity: { notAfter: '', notBefore: '' },
                    },
                    cognitoAuthenticationProvider: '',
                    cognitoAuthenticationType: '',
                    cognitoIdentityId: '',
                    cognitoIdentityPoolId: '',
                    principalOrgId: '',
                    sourceIp: '',
                    user: '',
                    userAgent: '',
                    userArn: '',
                },
                path: '/test',
                protocol: 'HTTP/1.1',
                requestId: 'test',
                requestTimeEpoch: 0,
                resourceId: 'test',
                resourcePath: '/test',
                stage: 'test',
            },
            resource: '',
            stageVariables: {},
            ...overrides,
        }
    }
}