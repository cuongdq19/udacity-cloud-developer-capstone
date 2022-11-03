import { TodosAccess } from '../dataLayer/todosAcess'
import { getAttachmentUrl } from '../dataLayer/attachmentUtils'
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoUpdate } from '../models/TodoUpdate'

// TODO: Implement businessLogic
const todoAccess = new TodosAccess()

const logger = createLogger('Todos')

// TODO: Implement businessLogic
export async function getUserTodos(userId: string): Promise<TodoItem[]> {
  try {
    const result = await todoAccess.getAllTodos(userId)
    return result
  } catch (error) {
    throw error.message
  }
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info('Creating todo ...')
  const todoId = uuid.v4()
  try {
    const todoItem: TodoItem = {
      todoId,
      userId,
      createdAt: new Date().toISOString(),
      done: false,
      attachmentUrl: null,
      ...createTodoRequest
    }

    await todoAccess.createTodo(todoItem)
    return todoItem
  } catch (error) {
    logger.error('Created todo failed ...')

    throw error.message
  }
}

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  todoId: string,
  userId: string
): Promise<TodoItem> {
  try {
    logger.info(`Updating todo with ID ${todoId}`)
    const item = await todoAccess.updateTodo(
      updateTodoRequest as TodoUpdate,
      todoId,
      userId
    )

    return item
  } catch (error) {
    logger.error(`Updating todo with ID ${todoId} failed`)

    throw error.message
  }
}

export async function deleteTodo(todoId: string, userId: string) {
  try {
    logger.info(`Deleting todo with ID ${todoId}`)

    const item = await todoAccess.deleteTodo(todoId, userId)
    return item
  } catch (error) {
    logger.error(`Deleting todo with ID ${todoId} failed`)

    throw error.message
  }
}

export async function generateSignedUrl(attachmentId: string): Promise<string> {
  try {
    logger.info(`GenerateSignedUrl: ${attachmentId}`)

    const uploadUrl = getAttachmentUrl(attachmentId)

    return uploadUrl
  } catch (error) {
    logger.error(`GenerateSignedUrl: ${attachmentId} failed`)

    throw error.message
  }
}

export async function updateAttachmentUrl(
  userId: string,
  todoId: string,
  attachmentId: string
): Promise<void> {
  try {
    const attachmentUrl = getAttachmentUrl(attachmentId)
    await todoAccess.updateTodoItemAttachment(userId, todoId, attachmentUrl)

    logger.info('Attachment URL Updated Successfully', {
      userId,
      todoId
    })
    return
  } catch (error) {
    logger.error(`Error Updating Attachment URL: ${error}`)
    throw error.message
  }
}
