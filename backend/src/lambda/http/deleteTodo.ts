import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Remove a TODO item by id
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)
    const item = await deleteTodo(todoId, userId)
    return {
      statusCode: 200,
      body: JSON.stringify({
        item
      })
    }
    return undefined
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
