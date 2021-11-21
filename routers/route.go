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

	v2.OPTIONS("/register", handlers.HandlePreflight)
	v2.POST("/login", handlers.LoginV2)
	v2.POST("/register", handlers.RegisterV2)
	v2.Use(AuthRequired())
	{
		v2.GET("/users/me", handlers.Me)
		v2.POST("/logout", handlers.LogoutV2)
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
