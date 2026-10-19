package site

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io/fs"
	"os"
	"path/filepath"
)

type Options struct {
	Analytics bool
}

func Build(siteDir, outDir string, options Options) error {
	content, err := Load(filepath.Join(siteDir, "content.json"))
	if err != nil {
		return err
	}
	css, err := minifyCSS(filepath.Join(siteDir, "styles", "daylight.css"), filepath.Join(siteDir, "styles", "panel.css"))
	if err != nil {
		return err
	}
	place, err := json.Marshal(content.Place)
	if err != nil {
		return err
	}
	headScript, err := bundleScript(filepath.Join(siteDir, "scripts", "head.ts"), map[string]string{"PLACE": string(place)})
	if err != nil {
		return err
	}
	pageScript, err := bundleScript(filepath.Join(siteDir, "scripts", "main.ts"), nil)
	if err != nil {
		return err
	}
	jsonLD, err := personJSONLD(content)
	if err != nil {
		return err
	}

	pageURL := content.Site.URL + "/"
	var page bytes.Buffer
	err = renderPage(&page, filepath.Join(siteDir, "templates"), pageView{
		Content:    content,
		CurrentJob: content.CurrentJob(),
		PageURL:    pageURL,
		ImageURL:   pageURL + content.Site.Image.Path,
		CSS:        template.CSS(css),
		HeadScript: template.JS(headScript),
		PageScript: template.JS(pageScript),
		JSONLD:     jsonLD,
		Panels:     panelViews(content),
		Analytics:  options.Analytics,
	})
	if err != nil {
		return fmt.Errorf("rendering the page: %w", err)
	}

	if err := os.RemoveAll(outDir); err != nil {
		return err
	}
	if err := copyDir(filepath.Join(siteDir, "public"), outDir); err != nil {
		return err
	}
	files := map[string]string{
		"index.html":  page.String(),
		"robots.txt":  fmt.Sprintf("User-agent: *\nAllow: /\n\nSitemap: %ssitemap.xml\n", pageURL),
		"sitemap.xml": fmt.Sprintf("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"><url><loc>%s</loc></url></urlset>\n", pageURL),
	}
	for name, body := range files {
		if err := os.WriteFile(filepath.Join(outDir, name), []byte(body), 0o644); err != nil {
			return err
		}
	}
	return nil
}

func copyDir(from, to string) error {
	return filepath.WalkDir(from, func(path string, entry fs.DirEntry, err error) error {
		if err != nil {
			return err
		}
		target := filepath.Join(to, path[len(from):])
		if entry.IsDir() {
			return os.MkdirAll(target, 0o755)
		}
		raw, err := os.ReadFile(path)
		if err != nil {
			return err
		}
		return os.WriteFile(target, raw, 0o644)
	})
}
