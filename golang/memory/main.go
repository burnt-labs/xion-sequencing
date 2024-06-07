package main

import (
	"fmt"
	"time"
)

func producer(ch chan<- string) {
	for i := 0; i < 10; i++ {
		item := fmt.Sprintf("item %d", i)
		ch <- item
		fmt.Println("Produced", item)
		time.Sleep(1 * time.Second)
	}
	close(ch)
}

func consumer(ch <-chan string) {
	for item := range ch {
		fmt.Println("Consumed", item)
		time.Sleep(2 * time.Second)
	}
}

func main() {
	queue := make(chan string)

	go producer(queue)
	consumer(queue)
}
