package main

import (
	"fmt"
	"runtime"
	"time"
)

func main() {
	fmt.Print("Go runs on ")

	switch os := runtime.GOOS; os {
	case "darwin":
		fmt.Println("OS X.")
	case "linux":
		fmt.Println("Linux.")
	default:
		fmt.Printf("%s.", os)
	}

	switch os := runtime.GOOS; os {
	case "darwin":
		fmt.Println("OS X.")
		fallthrough
	case "linux":
		fmt.Println("Linux.")
		fallthrough
	default:
		fmt.Printf("%s.\n", os)
	}

	//Switch without a condition is the same as switch true.
	//This construct can be a clean way to write long if-then-else chains.
	t := time.Now()
	switch {
	case t.Hour() < 12:
		fmt.Println("Good morning!")
	case t.Hour() < 17:
		fmt.Println("Good afternoon.")
	default:
		fmt.Println("Good evening.")
	}
}
