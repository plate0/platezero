package main

import (
	"os"
	"os/exec"
	"path/filepath"
)

var images = map[string]bool{
	"png":  true,
	"jpg":  true,
	"jpeg": true,
	"gif":  true,
}

// IsPicture checks if the file is an image supported by Google Vision
// Note that pdf's are _not_, so we need to convert them to
// jpg
func IsPicture(file *os.File) bool {
	ext := filepath.Ext(file.Name())
	_, ok := images[ext]
	return ok
}

// Convert a file from name to `name.jpg`
func Convert(name string) error {
	ext := filepath.Ext(file.Name())
	cmd := exec.Command("convert", "-density", "600", name, next).CombinedOutput()

}
