package site

import (
	"encoding/json"
	"html/template"
	"io"
	"net/url"
	"path/filepath"
	"strconv"
	"strings"
)

type pageView struct {
	Content
	CurrentJob Job
	PageURL    string
	ImageURL   string
	CSS        template.CSS
	HeadScript template.JS
	PageScript template.JS
	JSONLD     template.JS
	Panels     []panelView
	Analytics  bool
}

type panelView struct {
	Job
	Text         PanelText
	Position     string
	Host         string
	Previous     *Job
	Next         *Job
	ChapterViews []chapterView
}

type chapterView struct {
	Chapter
	Index   int
	ShowSun bool
}

func renderPage(w io.Writer, templatesDir string, view pageView) error {
	page, err := template.New("page.html").
		Funcs(template.FuncMap{"mark": func(name string) template.HTML { return marks[name] }}).
		ParseGlob(filepath.Join(templatesDir, "*.html"))
	if err != nil {
		return err
	}
	return page.ExecuteTemplate(w, "page.html", view)
}

func panelViews(content Content) []panelView {
	jobs := content.Jobs
	views := make([]panelView, len(jobs))
	for i, job := range jobs {
		view := panelView{
			Job:      job,
			Text:     content.Panel,
			Position: strings.NewReplacer("{n}", strconv.Itoa(i+1), "{total}", strconv.Itoa(len(jobs))).Replace(content.Panel.Position),
			Host:     hostOf(job.URL),
		}
		if i > 0 {
			view.Previous = &jobs[i-1]
		}
		if i+1 < len(jobs) {
			view.Next = &jobs[i+1]
		}
		for n, chapter := range job.Chapters {
			view.ChapterViews = append(view.ChapterViews, chapterView{
				Chapter: chapter,
				Index:   n,
				ShowSun: job.Current && n == len(job.Chapters)-1,
			})
		}
		views[i] = view
	}
	return views
}

func personJSONLD(content Content) (template.JS, error) {
	current := content.CurrentJob()
	sameAs := make([]string, len(content.Links))
	for i, link := range content.Links {
		sameAs[i] = link.URL
	}
	person := map[string]any{
		"@context": "https://schema.org",
		"@type":    "Person",
		"name":     content.Headline.Name,
		"url":      content.Site.URL,
		"jobTitle": current.Role,
		"worksFor": map[string]string{"@type": "Organization", "name": current.Company, "url": current.URL},
		"sameAs":   sameAs,
	}
	raw, err := json.Marshal(person)
	return template.JS(raw), err
}

func hostOf(raw string) string {
	parsed, err := url.Parse(raw)
	if err != nil {
		return raw
	}
	return parsed.Host
}
