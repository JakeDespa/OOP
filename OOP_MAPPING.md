# OOP Mapping Table: From UML to UI

This table shows the exact mapping from the original UML diagram methods to the implemented classes and front-end handlers.

| UML Class      | UML Method        | Back-End Class & Method                               | API Endpoint (Class-Based Route)           | Front-End Class & Method                               |
|----------------|-------------------|-------------------------------------------------------|--------------------------------------------|--------------------------------------------------------|
| **User**       | `register()`      | `AuthService.register()`                              | `POST /api/auth/register`                  | `RegisterPage.handleSubmit()` -> `ApiClient.register()`  |
| **User**       | `login()`         | `AuthService.login()`                                 | `POST /api/auth/login`                     | `LoginPage.handleSubmit()` -> `ApiClient.login()`      |
| **User**       | `logout()`        | `AuthController.logout()` (Client-side deletion)      | `POST /api/auth/logout`                    | `Dashboard.handleLogout()` -> `ApiClient.logout()`     |
| **User**       | `updateProfile()` | `UserService.updateProfile()`                         | `PUT /api/users/profile`                   | `ProfilePage.handleSubmit()` -> `ApiClient.updateUser()` (Future implementation) |
| **User**       | `viewTasks()`     | `TaskService.getTasksForUser()`                       | `GET /api/tasks`                           | `TaskManager.loadTasks()` -> `ApiClient.getTasks()`      |
| **Task**       | `createTask()`    | `TaskService.createTask()`                            | `POST /api/tasks`                          | `TaskManager.handleSubmit()` -> `ApiClient.createTask()` |
| **Task**       | `editTask()`      | `TaskService.editTask()`                              | `PUT /api/tasks/:id`                       | `TaskManager.handleSubmit()` -> `ApiClient.updateTask()` |
| **Task**       | `deleteTask()`    | `TaskService.deleteTask()`                            | `DELETE /api/tasks/:id`                    | `TaskManager.handleDelete()` -> `ApiClient.deleteTask()` |
| **Task**       | `setDueDate()`    | `TaskService.setDueDate()`                            | `PATCH /api/tasks/:id/duedate`             | (Handled within `editTask` UI)                         |

| **Task**       | `markComplete()`  | `TaskService.markComplete()`                          | `PATCH /api/tasks/:id/complete`            | (Handled within `editTask` UI)                         |
| **Category**   | `addCategory()`   | `CategoryService.addCategory()`                       | `POST /api/categories`                     | `CategoryManager.handleSubmit()` -> `ApiClient.createCategory()` (Future implementation) |
| **Category**   | `editCategory()`  | `CategoryService.editCategory()`                      | `PUT /api/categories/:id`                  | `CategoryManager.handleSubmit()` -> `ApiClient.updateCategory()` (Future implementation) |
| **Category**   | `deleteCategory()`| `CategoryService.deleteCategory()`                    | `DELETE /api/categories/:id`               | `CategoryManager.handleDelete()` -> `ApiClient.deleteCategory()` (Future implementation) |
| **Tag**        | `addTag()`        | `TagService.addTag()`                                 | `POST /api/tags`                           | `TagManager.handleSubmit()` -> `ApiClient.createTag()` (Future implementation) |
| **Tag**        | `removeTag()`     | `TagService.removeTag()`                              | `DELETE /api/tags/:id`                     | `TagManager.handleDelete()` -> `ApiClient.deleteTag()` (Future implementation) |
| **TaskMateSystem** | `authenticateUser()` | `AuthMiddleware.authenticateToken()`           | (Applied to all protected routes)          | (Handled by `ApiClient` interceptor)                   |
| **TaskMateSystem** | `manageTasks()`      | `TaskRoutes` class in `task.routes.ts`          | `.../api/tasks/...`                        | `TaskManager` component                                |
| **TaskMateSystem** | `manageCategories()` | `CategoryRoutes` class in `category.routes.ts`  | `.../api/categories/...`                   | `CategoryManager` component (Future implementation)    |
| **TaskMateSystem** | `generateReports()`  | `TaskMateSystem.generateReports()`              | `GET /api/reports/cost`                    | (Not implemented in UI)                                |
| **TaskMateSystem** | `calculateCost()`    | `Billing.calculateCost()`                       | (Accessed via `generateReports`)           | (Not implemented in UI)                                |
| **TaskMateSystem** | `generateQRCode()`   | `QRCodeGenerator.generateQRCode()`              | `GET /api/tasks/:id/qrcode`                | `TaskManager.handleShowQRCode()` -> `ApiClient.getTaskQRCode()` |
| **TaskMateSystem** | `updateStatus()`     | `TaskService.markComplete()`                    | `PATCH /api/tasks/:id/complete`            | (Handled within `editTask` UI)                         |
