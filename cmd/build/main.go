package main

import (
	"flag"
	"log"
	"net/http"
	"sync"

	"github.com/synntx/portfolio-v02/internal/site"
)

func main() {
	siteDir := flag.String("site", "site", "folder with content.json, templates, styles, scripts and public files")
	outDir := flag.String("out", "dist", "folder the built site is written to")
	analytics := flag.Bool("analytics", false, "include Vercel and Google analytics; for deploy builds only")
	serve := flag.String("serve", "", "address to serve the site on while editing, e.g. :4321; every page load rebuilds")
	flag.Parse()

	build := func() error { return site.Build(*siteDir, *outDir, site.Options{Analytics: *analytics}) }
	if err := build(); err != nil {
		log.Fatal(err)
	}
	if *serve == "" {
		return
	}

	var building sync.RWMutex
	files := http.FileServer(http.Dir(*outDir))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/" {
			building.Lock()
			err := build()
			building.Unlock()
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
		}
		building.RLock()
		defer building.RUnlock()
		files.ServeHTTP(w, r)
	})
	log.Printf("serving %s on http://localhost%s", *outDir, *serve)
	log.Fatal(http.ListenAndServe(*serve, nil))
}
