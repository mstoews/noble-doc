---
title: OpenAPI and Swagger Documentation
date: 2025-06-04    
---

Okay, here's how you would add Swagger (OpenAPI) annotations to your Go Gin handler using the popular `swaggo/swag` library.

First, you'll need to ensure `swaggo/swag` and its CLI tool `swag` are installed.
```bash
go get -u github.com/swaggo/swag/cmd/swag
go get -u github.com/swaggo/gin-swagger
go get -u github.com/alecthomas/template # dependency for swag
```

Next, let's define the `ErrorResponse` and assume a structure for what `server.store.GetAccount` might return (e.g., `db.Account`).

```go
package main // Or your relevant package

import (
	"net/http"
	// "your_project_path/db" // Make sure to import your db package
	"github.com/gin-gonic/gin"
	// For swagger docs generation (if you integrate it into your main.go)
	// _ "your_project_path/docs" // If swag init generates docs here
	// ginSwagger "github.com/swaggo/gin-swagger"
	// swaggerFiles "github.com/swaggo/files"
)

// --- Mocking necessary types that would typically be in other packages ---
// This 'db' package mock is just for this example to be self-contained.
// In your actual project, these would be in your 'db' package.
// START MOCK DB PACKAGE
package db {
// GetAccountParams is the input for GetAccount endpoint.
// Adding 'binding' for Gin validation and 'example' for Swagger.
type GetAccountParams struct {
    Account int32 `json:"account" binding:"required" example:"12345"` 
    Child   int32 `json:"child" binding:"required" example:"67890"`
    }

// Account represents the structure of an account returned by the store.
// This is an assumed structure for glCreateAccount.
// Replace with your actual db.Account or DTO structure.
type Account struct {
    ID            int32   `json:"id" example:"1"`
    AccountNumber int32   `json:"account_number" example:"12345"`
    ChildNumber   int32   `json:"child_number" example:"67890"`
    AccountHolder string  `json:"account_holder" example:"John Doe"`
    Balance       float64 `json:"balance" example:"1500.75"`
    Currency      string  `json:"currency" example:"USD"`
 }
} 

// Server struct (assuming you have one)
type Server struct {
	store Store // Your database store/interface
	// router *gin.Engine // if you store router here
}

// Store interface (mocking the GetAccount method signature)
type Store interface {
	GetAccount(ctx *gin.Context, arg db.GetAccountParams) (db.Account, error)
}

// ErrorResponse is the standard structure for API error responses.
// It's good practice to define this once and reuse it.
type ErrorResponse struct {
	Error string `json:"error" example:"Error message describing the issue"`
}

// errorResponse is a helper function to create a standardized error response.
func errorResponse(err error) ErrorResponse {
	return ErrorResponse{Error: err.Error()}
}

// @Summary      Get Account Details
// @Description  Retrieves account details based on account and child identifiers provided in the request body.
// @Description  Note: Using POST for "get" semantics here because parameters are in the JSON body.
// @Tags         Accounts
// @Accept       json
// @Produce      json
// @Param        request body db.GetAccountParams true "Account and Child Identifiers"
// @Success      200  {object}  db.Account "Successfully retrieved account details"
// @Failure      400  {object}  ErrorResponse "Bad Request: Invalid input parameters"
// @Failure      500  {object}  ErrorResponse "Internal Server Error: Failed to retrieve account"
// @Router       /account [post]
func (server *Server) GetAccount(ctx *gin.Context) {
	var req db.GetAccountParams // This 'db' prefix is crucial
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, errorResponse(err))
		return
	}

	// glCreateAccount, err := server.store.GetAccount(ctx, req)
	// For the sake of this example, let's mock the call to server.store.GetAccount
	// In a real scenario, this would be your actual database call.
	var glCreateAccount db.Account
	var err error
	if req.Account == 12345 && req.Child == 67890 { // Mock success
		glCreateAccount = db.Account{
			ID:            1,
			AccountNumber: req.Account,
			ChildNumber:   req.Child,
			AccountHolder: "Mock User",
			Balance:       1000.00,
			Currency:      "USD",
		}
	} else { // Mock error (e.g. account not found, which might be a 404 or 500 depending on design)
		// For simplicity, treating it as an internal error that GetAccount might return.
		// A specific "not found" error might yield a http.StatusNotFound.
		err = http.ErrAbortHandler // Using a generic error for example
	}
	// --- End Mocked call ---

	if err != nil {
		// Consider more specific error handling, e.g., if err is sql.ErrNoRows, return 404
		ctx.JSON(http.StatusInternalServerError, errorResponse(err))
		return
	}
	ctx.JSON(http.StatusOK, glCreateAccount)
}

// Example main function to show how to set up Gin and Swagger
func main() {
	 router := gin.Default()
	
	 // Mock store and server
	 mockStore := &mockStoreImplementation{}
	 server := &Server{store: mockStore}
	
	 // Your API route
	 router.POST("/account", server.GetAccount)
	
	 // Swagger endpoint
	 // Make sure your main.go or the file passed to `swag init -g <file>.go`
	 // has a General API annotation block like:
	 // @title Your API Title
	 // @version 1.0
	 // @description This is a sample server for your API.
	 // @termsOfService http://swagger.io/terms/
	 // @contact.name API Support
	 // @contact.url http://www.swagger.io/support
	 // @contact.email support@swagger.io
	 // @license.name Apache 2.0
	 // @license.url http://www.apache.org/licenses/LICENSE-2.0.html
	 // @host localhost:8080
	 // @BasePath /api/v1  (if you have a base path)
	 //
	 // Then run: swag init -g your_main_file.go --parseDependency --parseInternal
	 // The --parseDependency and --parseInternal flags help swag find types in other packages.
	 //
	 // Import your docs package (usually generated in a 'docs' folder)
	 // _ "your_project_path/docs"
	 //
	 // router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	
	 // log.Fatal(router.Run(":8080"))

	// This main is just for context. The core request is the Swagger comments.
	println("Swagger annotations added above GetAccount function.")
	println("Ensure db.GetAccountParams and db.Account are correctly defined and accessible.")
	println("Run 'swag init' to generate documentation.")
}

// Mock Store Implementation for the main function example
// type mockStoreImplementation struct{}
func (m *mockStoreImplementation) GetAccount(ctx *gin.Context, arg db.GetAccountParams) (db.Account, error) {
 	if arg.Account == 12345 && arg.Child == 67890 {
 		return db.Account{
 			ID:            1,
 			AccountNumber: arg.Account,
 			ChildNumber:   arg.Child,
 			AccountHolder: "Mock User from Store",
 			Balance:       2500.50,
 			Currency:      "EUR",
 		}, nil
 	}
 	return db.Account{}, errors.New("mock store: account not found or error")
 }

```

**Explanation of Swagger Annotations:**

	*   `// @Summary Get Account Details`: A short summary of what the endpoint does.
	*   `// @Description Retrieves account details...`: A more detailed description.
	*   `// @Tags Accounts`: Groups this endpoint under the "Accounts" tag in the Swagger UI.
	*   `// @Accept json`: Specifies that this endpoint accepts JSON request bodies.
	*   `// @Produce json`: Specifies that this endpoint produces JSON responses.
	*   `// @Param request body db.GetAccountParams true "Account and Child Identifiers"`:
    *   `request`: The name of the parameter (can be anything, "request" or "body" is common for body params).
    *   `body`: Indicates the parameter is in the request body.
    *   `db.GetAccountParams`: The Go type of the request body. `swag` will parse this struct to generate the schema. **Crucially**, if `GetAccountParams` is in the `db` package, you *must* use `db.GetAccountParams`.
    *   `true`: Indicates the parameter is required.
    *   `"Account and Child Identifiers"`: A description for this parameter.
	*   `// @Success 200 {object} db.Account "Successfully retrieved account details"`:
    *   `200`: The HTTP status code for a successful response.
    *   `{object}`: Indicates the response body is an object.
    *   `db.Account`: The Go type of the successful response body. `swag` will parse this. (I've assumed a `db.Account` struct; replace this with the actual type of `glCreateAccount`).
    *   `"Successfully retrieved account details"`: Description for this response.
	*   `// @Failure 400 {object} ErrorResponse "Bad Request: Invalid input parameters"`:
    *   `400`: HTTP status code for a client error (e.g., validation).
    *   `{object} ErrorResponse`: The Go type for this error response.
    *   `"Bad Request..."`: Description.
	*   `// @Failure 500 {object} ErrorResponse "Internal Server Error: Failed to retrieve account"`:
    *   `500`: HTTP status code for a server error.
    *   `{object} ErrorResponse`: The Go type for this error response.
    *   `"Internal Server Error..."`: Description.
	*   `// @Router /account [post]`:
    *   `/account`: The API path.
    *   `[post]`: The HTTP method. I've used `POST` because `ctx.ShouldBindJSON(&req)` is typically used for request bodies, which are common with POST, PUT, PATCH. If this were a GET request, parameters would usually be in the query string or path.

**To Generate Swagger Docs:**

1.  **Make sure your `db.GetAccountParams` and the return type (e.g., `db.Account`) are defined** in a way that `swag` can parse them. If they are in a different package (like `db`), `swag` needs to be able to find and parse that package.
2.  **Add General API Information:** In your `main.go` (or the entry point file you pass to `swag init`), add general API info:
    ```go
    // main.go
    package main

    // @title           Your API Title
    // @version         1.0
    // @description     This is a sample server for your API.
    // @termsOfService  http://swagger.io/terms/

    // @contact.name   API Support
    // @contact.url    http://www.yourdomain.com/support
    // @contact.email  support@yourdomain.com

    // @license.name  Apache 2.0
    // @license.url   http://www.apache.org/licenses/LICENSE-2.0.html

    // @host      localhost:8080
    // @BasePath  /api/v1  // Optional: if your routes are prefixed

    import (
    	// ... your other imports
    	// _ "your_project_path/docs" // This will be created by swag init
    	// ginSwagger "github.com/swaggo/gin-swagger"
    	// swaggerFiles "github.com/swaggo/files"
    )

    func main() {
    	// ... your gin router setup ...
    	// router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
    	// router.Run()
    }
    ```
3.  **Run `swag init`:**
    Navigate to your project's root directory in the terminal and run:
    ```bash
    swag init -g main.go --parseDependency --parseInternal
    ```
    *   `-g main.go`: Specifies the entry point of your application (or the file containing the general API annotations).
    *   `--parseDependency`: Tells swag to parse external dependencies (like your `db` package if it's a separate module).
    *   `--parseInternal`: Tells swag to parse internal packages (subdirectories within your module).
    This will generate a `docs` folder containing `docs.go`, `swagger.json`, and `swagger.yaml`.
4.  **Serve Swagger UI:**
    In your `main.go` (or wherever you set up your Gin router), add the handler for Swagger UI:
    ```go
    import (
    	// ...
    	_ "your_project_path/docs" // Import the generated docs
    	ginSwagger "github.com/swaggo/gin-swagger"
    	swaggerFiles "github.com/swaggo/files"
    )

    func main() {
    	router := gin.Default()
        // ... your server setup from the example ...
        mockStore := &mockStoreImplementation{} // You'd need to define this or use your real store
        server := &Server{store: mockStore}

    	// Your API route
    	router.POST("/account", server.GetAccount) // Assuming no /api/v1 base path from @BasePath for this route

    	// Swagger UI endpoint (e.g., http://localhost:8080/swagger/index.html)
    	// If you used @BasePath /api/v1, then Swagger UI might be at /api/v1/swagger/index.html
    	// or you might serve it from the root /swagger/index.html regardless.
    	// The URL depends on how you register ginSwagger.
    	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

    	router.Run(":8080")
    }
    ```

Now, when you run your application and go to `/swagger/index.html` (or the appropriate path), you should see the API documentation. Remember to replace placeholder types like `db.Account` with your actual data structures.

