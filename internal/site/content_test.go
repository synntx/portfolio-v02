package site

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

const contentPath = "../../site/content.json"

func loadSiteContent(t *testing.T) Content {
	t.Helper()
	content, err := Load(contentPath)
	if err != nil {
		t.Fatalf("site content should load: %v", err)
	}
	return content
}

func withJobs(content Content, change func(jobs []Job)) Content {
	jobs := make([]Job, len(content.Jobs))
	for i, job := range content.Jobs {
		job.Chapters = append([]Chapter(nil), job.Chapters...)
		jobs[i] = job
	}
	change(jobs)
	content.Jobs = jobs
	return content
}

func TestValidateRejectsBrokenContent(t *testing.T) {
	base := loadSiteContent(t)
	cases := map[string]struct {
		content Content
		want    string
	}{
		"duplicate job id": {
			withJobs(base, func(jobs []Job) { jobs[1].ID = jobs[0].ID }),
			"unique lowercase slug",
		},
		"chapter start without a two-digit month": {
			withJobs(base, func(jobs []Job) { jobs[0].Chapters[0].Start = "2025-4" }),
			"start must be YYYY-MM",
		},
		"chapters out of order": {
			withJobs(base, func(jobs []Job) { jobs[0].Chapters[1].Start = jobs[0].Chapters[0].Start }),
			"starts must increase",
		},
		"two current jobs": {
			withJobs(base, func(jobs []Job) { jobs[1].Current, jobs[1].Joined = true, "2025-02-01" }),
			"exactly one job must be current",
		},
		"job with both a mark and a logo": {
			withJobs(base, func(jobs []Job) { jobs[0].Logo = "logos/libra.png" }),
			"exactly one of mark or logo",
		},
		"past job with chapters but no end": {
			withJobs(base, func(jobs []Job) {
				jobs[1].Chapters = []Chapter{{Title: "Intern", Start: "2025-02", Lines: []string{"Built a page."}}}
			}),
			"needs ended",
		},
		"link that is not https": {
			func() Content {
				c := base
				c.Links = []Link{{Label: "GitHub", URL: "http://github.com/synntx"}}
				return c
			}(),
			"must be an https URL",
		},
	}
	for name, tc := range cases {
		t.Run(name, func(t *testing.T) {
			err := tc.content.validate()
			if err == nil || !strings.Contains(err.Error(), tc.want) {
				t.Fatalf("want an error containing %q, got %v", tc.want, err)
			}
		})
	}
}

func TestLoadRejectsEmDash(t *testing.T) {
	raw, err := os.ReadFile(contentPath)
	if err != nil {
		t.Fatal(err)
	}
	withDash := strings.Replace(string(raw), `"workLabel": "Work"`, `"workLabel": "Work `+string(emDash)+` past"`, 1)
	path := filepath.Join(t.TempDir(), "content.json")
	if err := os.WriteFile(path, []byte(withDash), 0o644); err != nil {
		t.Fatal(err)
	}
	if _, err := Load(path); err == nil || !strings.Contains(err.Error(), "em dash") {
		t.Fatalf("want an em dash error, got %v", err)
	}
}

func TestLoadRejectsUnknownFields(t *testing.T) {
	path := filepath.Join(t.TempDir(), "content.json")
	if err := os.WriteFile(path, []byte(`{"headlin": {}}`), 0o644); err != nil {
		t.Fatal(err)
	}
	if _, err := Load(path); err == nil || !strings.Contains(err.Error(), "unknown field") {
		t.Fatalf("want an unknown field error, got %v", err)
	}
}

func TestBuildWritesThePage(t *testing.T) {
	out := t.TempDir()
	if err := Build("../../site", out, Options{}); err != nil {
		t.Fatal(err)
	}
	page, err := os.ReadFile(filepath.Join(out, "index.html"))
	if err != nil {
		t.Fatal(err)
	}
	for _, want := range []string{
		`<link rel="canonical" href="https://www.synntx.com/">`,
		`<template data-panel="libra-ai">`,
		`<template data-panel="tracks-and-towers">`,
		`window.daylight`,
	} {
		if !strings.Contains(string(page), want) {
			t.Errorf("index.html is missing %q", want)
		}
	}
	for _, analytics := range []string{"googletagmanager", "_vercel/insights"} {
		if strings.Contains(string(page), analytics) {
			t.Errorf("%s must only be in deploy builds", analytics)
		}
	}
	for _, file := range []string{"robots.txt", "sitemap.xml", "vercel.json", "fonts/inter-latin.woff2", "portrait/avatar-day-56.png"} {
		if _, err := os.Stat(filepath.Join(out, file)); err != nil {
			t.Errorf("%s was not written: %v", file, err)
		}
	}
}

func TestDeployBuildLoadsAnalytics(t *testing.T) {
	out := t.TempDir()
	if err := Build("../../site", out, Options{Analytics: true}); err != nil {
		t.Fatal(err)
	}
	page, err := os.ReadFile(filepath.Join(out, "index.html"))
	if err != nil {
		t.Fatal(err)
	}
	for _, want := range []string{"_vercel/insights/script.js", "googletagmanager.com/gtag/js"} {
		if !strings.Contains(string(page), want) {
			t.Errorf("deploy build is missing %q", want)
		}
	}
}
