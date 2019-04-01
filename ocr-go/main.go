package main

import (
	"bufio"
	"fmt"
	"log"
	"os"
	"os/exec"
)

func main() {
	id := 5
	recipes, err := ListRecipes(id)
	if err != nil {
		fmt.Printf("error loading recipes %v\n", err.Error())
		return
	}
	if len(recipes) == 0 {
		fmt.Printf("User %d has no recipes.\n", id)
		return
	}
	current := recipes[len(recipes)-1].Key
	fmt.Printf("fetching %v\n", *current)

	// download file
	err = Download(current)
	if err != nil {
		log.Fatalf("error downloading recipe %v", err.Error())
	}

	// move file

	// opening file...

	// pausing and wait for user input to continue
	reader := bufio.NewReader(os.Stdin)
	fmt.Print("waiting to continue ['n' to quit]...\n")
	text, _ := reader.ReadString('\n')
	if text == "n" {
		fmt.Println("quiting...")
		return
	}

	// run the OCR
	fmt.Println("running ocr")
	// TODO: Move to golang
	cmd := fmt.Sprintf("yarn ocr %s", file.Name())
	out, err := exec.Command("sh", "-c", cmd).Output()
	if err != nil {
		log.Fatalf("ocr failed %v", err.Error())
	}

	// copy the template and open both in vim

	// Wait for the markdown to be finished...
	// next execution?
	// run `yarn transpile`
	//
	// run yarn post, upload to the user who we first did this for.
	// move file out

}

// Open file in the default viewer
func Open(f *os.File) {
	exec.Command("open", f.Name())
}
