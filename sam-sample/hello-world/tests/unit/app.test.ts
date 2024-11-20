import {APIGatewayProxyResult} from 'aws-lambda';
import {lambdaHandler} from '../../app';
import {describe, expect, it} from '@jest/globals';
import {APIGatewayProxyEventFixture} from "../fixture/APIGatewayProxyEventFixture";

describe('app.tsのテスト', function () {
    it('verifies successful response', async () => {
        const dummyEvent = APIGatewayProxyEventFixture.build()
        const result: APIGatewayProxyResult = await lambdaHandler(dummyEvent);

        expect(result.statusCode).toEqual(200);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 'hello world',
            }),
        );
    });
});
