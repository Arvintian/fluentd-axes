package ui

import (
	"context"
	"github.com/gorilla/mux"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
)

var (
	router *mux.Router
	srv    *http.Server
)

func staticPath() string {
	prefix := os.Getenv("STATICPATH")
	if prefix == "" {
		return "/fluentd/static"
	}
	return prefix
}

func StartUIServer() {
	go func() {
		router = mux.NewRouter()
		backend, _ := url.Parse("http://localhost:5000")
		router.PathPrefix("/v1").Handler(httputil.NewSingleHostReverseProxy(backend))
		router.PathPrefix("/").Handler(http.FileServer(http.Dir(staticPath())))
		srv = &http.Server{
			Addr:    "0.0.0.0:8000",
			Handler: router,
		}
		if err := srv.ListenAndServe(); err != http.ErrServerClosed {
			log.Printf("HTTP server ListenAndServe: %v", err)
		}
	}()
	log.Printf("UI Running on  http://0.0.0.0:8000/")
}

func KillUIServer() error {
	return srv.Shutdown(context.Background())
}
