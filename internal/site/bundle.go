package site

import (
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/evanw/esbuild/pkg/api"
)

func bundleScript(entry string, define map[string]string) (string, error) {
	result := api.Build(api.BuildOptions{
		EntryPoints:       []string{entry},
		Bundle:            true,
		Write:             false,
		Format:            api.FormatIIFE,
		Target:            api.ES2022,
		MinifyWhitespace:  true,
		MinifyIdentifiers: true,
		MinifySyntax:      true,
		LegalComments:     api.LegalCommentsNone,
		Define:            define,
	})
	if err := messagesError(result.Errors); err != nil {
		return "", fmt.Errorf("%s: %w", entry, err)
	}
	script := strings.TrimSpace(string(result.OutputFiles[0].Contents))
	if strings.Contains(strings.ToLower(script), "</script") {
		return "", fmt.Errorf("%s: output contains </script and cannot be inlined", entry)
	}
	return script, nil
}

func minifyCSS(paths ...string) (string, error) {
	var source strings.Builder
	for _, path := range paths {
		raw, err := os.ReadFile(path)
		if err != nil {
			return "", err
		}
		source.Write(raw)
		source.WriteByte('\n')
	}
	result := api.Transform(source.String(), api.TransformOptions{
		Loader:           api.LoaderCSS,
		MinifyWhitespace: true,
		MinifySyntax:     true,
	})
	if err := messagesError(result.Errors); err != nil {
		return "", fmt.Errorf("styles: %w", err)
	}
	css := strings.TrimSpace(string(result.Code))
	if strings.Contains(strings.ToLower(css), "</style") {
		return "", errors.New("styles contain </style and cannot be inlined")
	}
	return css, nil
}

func messagesError(messages []api.Message) error {
	var problems []error
	for _, message := range messages {
		if message.Location != nil {
			problems = append(problems, fmt.Errorf("%s:%d:%d: %s", message.Location.File, message.Location.Line, message.Location.Column, message.Text))
		} else {
			problems = append(problems, errors.New(message.Text))
		}
	}
	return errors.Join(problems...)
}
