package utils

import (
	"unicode/utf8"

	"github.com/russross/blackfriday"
)

// Each mandarin symbol takes 3 - 4 bytes.
// The following `limit` is a value to measure how many "characters" can be displayed,
// It measures not only number of characters, but also the width of each character.
// `ratio` is the width ratio of Chinese words versus English characters (varies from CSS and fonts used in frontend)
func DecodeRuneStringForFrontend(s string, limit float64, ratio float64) string {
	idx := 0

	for cnt := 0.; cnt < limit; {
		_, width := utf8.DecodeRuneInString(s[idx:])
		// fmt.Printf("%#U starts at byte position %d\n", runeValue, charWidth)

		idx += width
		if width == 1 {
			cnt += 1 // e.g. English alphabets
		} else {
			cnt += ratio
		}
	}
	return s[:idx]
}

func ParseMarkdownToHTML(s string) string {
	/*
		It is such a bad idea to self-implement markdown parser
		links := regexp.MustCompile(`\[([^\s]+)\]\(([^\s]+)\)`)
		code := regexp.MustCompile("`([^\r|\n]*)`")
		s = links.ReplaceAllString(s, `<a href="$2">$1</a>`)
		s = bold.ReplaceAllString(s, `<strong>$1</strong>`)
	*/
	byteS := blackfriday.MarkdownCommon([]byte(s))
	return string(byteS)
}

func Index(vs []string, t string) int {
	for i, v := range vs {
		if v == t {
			return i
		}
	}
	return -1
}

func Include(vs []string, t string) bool {
	return Index(vs, t) >= 0
}

func Any(vs []string, f func(string) bool) bool {
	for _, v := range vs {
		if f(v) {
			return true
		}
	}
	return false
}

func All(vs []string, f func(string) bool) bool {
	for _, v := range vs {
		if !f(v) {
			return false
		}
	}
	return true
}

func Filter(vs []string, f func(string) bool) []string {
	vsf := make([]string, 0)
	for _, v := range vs {
		if f(v) {
			vsf = append(vsf, v)
		}
	}
	return vsf
}

func Map(vs []string, f func(string) string) []string {
	vsm := make([]string, len(vs))
	for i, v := range vs {
		vsm[i] = f(v)
	}
	return vsm
}
