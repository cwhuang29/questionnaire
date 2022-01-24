package routers

import (
	"net/http"

	"github.com/cwhuang29/questionnaire/config"
	"github.com/cwhuang29/questionnaire/handlers"
	"github.com/gin-gonic/gin"
)

var (
	router = gin.Default() // Creates a gin router with default middleware: logger and recovery (crash-free) middleware
	// htmlFiles = []string{"public/views/about.html", "public/views/home.html"}
)

func loadAssets() {
	// router.Static("/upload/images", "public/upload/images") // Static serves files from the given file system root. Internally a http.FileServer is used
	// router.Static("/js", "public/js")
	// router.Static("/css", "public/css")
	// router.Static("/assets", "public/assets")
	// router.StaticFile("/favicon.ico", "public/assets/favicon-64.ico") // StaticFile registers a single route in order to serve a single file of the local filesystem
	// router.LoadHTMLFiles(htmlFiles...)                                // router.LoadHTMLGlob("public/*")
}

func injectRoutesV2() {
	v2 := router.Group("/v2")

	v2.Use(AllowCORS())
	{
		v2.OPTIONS("/login", handlers.HandlePreflight)
		v2.OPTIONS("/register", handlers.HandlePreflight)
		v2.OPTIONS("/users/me", handlers.HandlePreflight)
		v2.OPTIONS("/forms", handlers.HandlePreflight)
		v2.OPTIONS("/forms/todo", handlers.HandlePreflight)
		v2.OPTIONS("/forms/:formId", handlers.HandlePreflight)
		v2.OPTIONS("/forms/answer/:formId", handlers.HandlePreflight)
		v2.OPTIONS("/forms/email/*formId", handlers.HandlePreflight)
		v2.OPTIONS("/forms/status/*formId", handlers.HandlePreflight)
		v2.OPTIONS("/create/form", handlers.HandlePreflight)
		v2.OPTIONS("/update/form/*formId", handlers.HandlePreflight)

		v2.POST("/login", handlers.LoginV2)

		v2.POST("/register", handlers.RegisterV2)
		v2.Use(AuthRequired())
		{
			v2.GET("/users/me", handlers.Me)
			v2.POST("/logout", handlers.LogoutV2)
			v2.GET("/forms/todo", handlers.GetTodoForms)
			v2.GET("/forms/answer/:formId", handlers.GetAnswerForm)
			v2.POST("/forms/answer/:formId", handlers.MarkAnswerForm)

			v2.Use(AdminRequired())
			{
				v2.GET("/forms", handlers.Forms)
				v2.GET("/forms/:formId", handlers.Forms)                // ":" is mandatory oaram
				v2.GET("/forms/status/*formId", handlers.GetFormStatus) // "*" is optional
				v2.POST("/forms/status/*formId", handlers.CreateFormStatus)
				v2.POST("/forms/email/*formId", handlers.RemindWritingForm)
				// v2.GET("/forms/:formId", func(c *gin.Context) {
				//     if strings.HasPrefix(c.Request.RequestURI, "/v2/form/status") {
				//         handlers.AssignFormToUsers(c)
				//         return
				//     } else if strings.HasPrefix(c.Request.RequestURI, "/v2/form/email") {
				//         handlers.RemindWritingForm(c)
				//         return
				//     }
				//     handlers.Forms(c)
				// })

				v2.POST("/create/form", handlers.CreateForm)
				v2.POST("/update/form/*formId", handlers.UpdateForm)
			}
		}
	}
}

func injectRoutesV1() {
	v1 := router.Group("/v1")

	admin := v1.Group("/admin") // /overview/... -> /admin/overview/...
	admin.Use(AdminRequired())
	{
		admin.GET("/overview", handlers.AdminOverview)
		admin.GET("/check-permisssion", handlers.CheckPermissionAndArticleExists)
		admin.GET("/create/article", handlers.CreateArticleView)
		admin.GET("/update/article", handlers.UpdateArticleView)

		admin.Use(CSRFProtection())
		{
			admin.POST("/create/article", handlers.CreateArticle)
			admin.PUT("/update/article", handlers.UpdateArticle)
			admin.DELETE("/delete/article", handlers.DeleteArticle)
		}
	}

	articles := v1.Group("/articles")
	{
		articles.GET("/", func(c *gin.Context) { c.Redirect(http.StatusFound, "/articles/weekly-update") })
		articles.GET("/weekly-update", handlers.Overview) // The main page
		articles.GET("/browse", handlers.Browse)
		articles.GET("/medication", handlers.Overview)
		articles.GET("/pharma", handlers.Overview)
		articles.GET("/fetch", handlers.FetchData)
		articles.GET("/tags", handlers.SearchTags)

		articles.GET("/bookmark", handlers.GetUserBookmarkedArticles)
		articles.GET("/bookmark/:articleId", handlers.Bookmark)
		articles.PUT("/bookmark/:articleId", handlers.UpdateBookmark)

		articles.GET("/like/:articleId", handlers.Like)
		articles.PUT("/like/:articleId", handlers.UpdateLike)
	}

	password := v1.Group("/password")
	{
		password.GET("/reset", handlers.PasswordResetRequest)
		password.GET("/reset/:token", handlers.PasswordResetForm)
		password.POST("/email", handlers.PasswordResetEmail)
		password.Use(CSRFProtection())
		{
			password.PUT("/reset", handlers.PasswordUpdate)
		}
	}

	v1.GET("/home", handlers.Home)
	v1.GET("/about", handlers.About)
	v1.GET("/contact-us", handlers.ContactUs)
	v1.GET("/", func(c *gin.Context) { c.Redirect(http.StatusFound, "/articles/weekly-update") })
}

func serve() {
	cfg := config.GetCopy()

	http := cfg.App.HttpPort
	https := cfg.App.HttpsPort

	if http != "" && https != "" {
		go router.Run(":" + http)
		router.RunTLS(":"+https, "./certs/server.crt", "./certs/server.key")
	} else if http != "" {
		router.Run(":" + http)
	} else if https != "" {
		router.RunTLS(":"+https, "./certs/server.crt", "./certs/server.key")
	} else {
		panic("Either app.httpPort or app.HttpsPort should be set")
	}
}

func Router() {
	// gin.SetMode(gin.ReleaseMode)
	router.MaxMultipartMemory = 16 << 20 // Set a lower memory limit for multipart forms (default is 32 MiB)

	loadAssets()
	injectRoutesV1()
	injectRoutesV2()
	serve()
}
