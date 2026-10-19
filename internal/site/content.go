package site

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"net/url"
	"os"
	"regexp"
	"strings"
)

type Content struct {
	Site        Meta       `json:"site"`
	Headline    Headline   `json:"headline"`
	Email       string     `json:"email"`
	EmailButton string     `json:"emailButton"`
	CopyEmail   string     `json:"copyEmail"`
	Copied      string     `json:"copied"`
	Links       []Link     `json:"links"`
	WorkLabel   string     `json:"workLabel"`
	Jobs        []Job      `json:"jobs"`
	Panel       PanelText  `json:"panel"`
	SunControl  SunControl `json:"sunControl"`
	Place       Place      `json:"place"`
}

type Meta struct {
	URL                string `json:"url"`
	Title              string `json:"title"`
	Description        string `json:"description"`
	Image              Image  `json:"image"`
	GoogleVerification string `json:"googleVerification,omitempty"`
	GoogleTagID        string `json:"googleTagId,omitempty"`
}

type Image struct {
	Path   string `json:"path"`
	Width  int    `json:"width"`
	Height int    `json:"height"`
	Alt    string `json:"alt"`
}

type Headline struct {
	Name string `json:"name"`
	Role string `json:"role"`
}

type Link struct {
	Label string `json:"label"`
	URL   string `json:"url"`
}

type Job struct {
	ID       string    `json:"id"`
	Company  string    `json:"company"`
	URL      string    `json:"url"`
	Mark     string    `json:"mark,omitempty"`
	Logo     string    `json:"logo,omitempty"`
	Role     string    `json:"role"`
	When     string    `json:"when"`
	Current  bool      `json:"current,omitempty"`
	Joined   string    `json:"joined,omitempty"`
	Ended    string    `json:"ended,omitempty"`
	Chapters []Chapter `json:"chapters"`
}

type Chapter struct {
	Title string   `json:"title"`
	Start string   `json:"start"`
	Note  string   `json:"note,omitempty"`
	Lines []string `json:"lines"`
}

type PanelText struct {
	Close    string `json:"close"`
	Chapters string `json:"chapters"`
	Month    string `json:"month"`
	Previous string `json:"previous"`
	Next     string `json:"next"`
	Empty    string `json:"empty"`
	Position string `json:"position"`
}

type SunControl struct {
	Hint  string `json:"hint"`
	Pin   string `json:"pin"`
	Unpin string `json:"unpin"`
}

type Place struct {
	Name             string  `json:"name"`
	Latitude         float64 `json:"latitude"`
	Longitude        float64 `json:"longitude"`
	UTCOffsetMinutes int     `json:"utcOffsetMinutes"`
}

const emDash = rune(0x2014)

var (
	idPattern        = regexp.MustCompile(`^[a-z0-9]+(-[a-z0-9]+)*$`)
	yearMonthPattern = regexp.MustCompile(`^\d{4}-(0[1-9]|1[0-2])$`)
	datePattern      = regexp.MustCompile(`^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$`)
)

func Load(path string) (Content, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return Content{}, err
	}
	var content Content
	decoder := json.NewDecoder(bytes.NewReader(raw))
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&content); err != nil {
		return Content{}, fmt.Errorf("%s: %w", path, err)
	}
	if bytes.ContainsRune(raw, emDash) {
		return Content{}, fmt.Errorf("%s: contains an em dash", path)
	}
	if err := content.validate(); err != nil {
		return Content{}, fmt.Errorf("%s: %w", path, err)
	}
	return content, nil
}

func (c Content) validate() error {
	var problems []error
	add := func(format string, args ...any) { problems = append(problems, fmt.Errorf(format, args...)) }

	if !isHTTPS(c.Site.URL) {
		add("site.url must be an https URL")
	}
	if !strings.Contains(c.Panel.Position, "{n}") || !strings.Contains(c.Panel.Position, "{total}") {
		add("panel.position needs {n} and {total}")
	}
	for _, link := range c.Links {
		if !isHTTPS(link.URL) {
			add("link %q must be an https URL", link.Label)
		}
	}

	currentJobs := 0
	seen := map[string]bool{}
	for _, job := range c.Jobs {
		if !idPattern.MatchString(job.ID) || seen[job.ID] {
			add("job id %q must be a unique lowercase slug", job.ID)
		}
		seen[job.ID] = true
		if !isHTTPS(job.URL) {
			add("job %s: url must be https", job.ID)
		}
		if (job.Mark == "") == (job.Logo == "") {
			add("job %s: needs exactly one of mark or logo", job.ID)
		}
		if job.Mark != "" && marks[job.Mark] == "" {
			add("job %s: unknown mark %q", job.ID, job.Mark)
		}
		if job.Current {
			currentJobs++
			if !datePattern.MatchString(job.Joined) {
				add("job %s: the current job needs joined as YYYY-MM-DD", job.ID)
			}
		} else if len(job.Chapters) > 0 && !yearMonthPattern.MatchString(job.Ended) {
			add("job %s: a past job with chapters needs ended as YYYY-MM", job.ID)
		}
		for i, chapter := range job.Chapters {
			if !yearMonthPattern.MatchString(chapter.Start) {
				add("job %s, chapter %q: start must be YYYY-MM", job.ID, chapter.Title)
			}
			if i > 0 && chapter.Start <= job.Chapters[i-1].Start {
				add("job %s, chapter %q: starts must increase", job.ID, chapter.Title)
			}
			if len(chapter.Lines) == 0 {
				add("job %s, chapter %q: needs at least one line", job.ID, chapter.Title)
			}
		}
	}
	if currentJobs != 1 {
		add("exactly one job must be current, found %d", currentJobs)
	}
	return errors.Join(problems...)
}

func (c Content) CurrentJob() Job {
	for _, job := range c.Jobs {
		if job.Current {
			return job
		}
	}
	return Job{}
}

func isHTTPS(raw string) bool {
	parsed, err := url.Parse(raw)
	return err == nil && parsed.Scheme == "https" && parsed.Host != ""
}
