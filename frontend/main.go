package main

import (
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.LoadHTMLGlob(filepath.Join(os.Getenv("TMPL_DIR"), "*.tmpl"))
	router.Static("/static", os.Getenv("STATIC_DIR"))
	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.tmpl", gin.H{
			"title": "Posts",
		})
	})
	router.Run(":" + os.Getenv("PORT"))
}
