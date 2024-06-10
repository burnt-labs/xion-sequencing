package main

import (
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
	"time"
)

var ctx = context.Background()

func producer(rdb *redis.Client) {
	for i := 0; i < 10; i++ {

		// Construct message with transaction parameters here
		item := fmt.Sprintf("item %d", i)

		err := rdb.RPush(ctx, "queue", item).Err()
		if err != nil {
			panic(err)
		}

		fmt.Println("Produced", item)
		time.Sleep(1 * time.Second)
	}
}

func consumer(rdb *redis.Client) {
	for {

		item, err := rdb.LPop(ctx, "queue").Result()

		// Call the chain here

		if err == redis.Nil {
			break
		} else if err != nil {
			panic(err)
		}
		fmt.Println("Consumed", item)
		time.Sleep(2 * time.Second)
	}
}

func main() {
	rdb := redis.NewClient(&redis.Options{
		Addr: "localhost:6379",
	})

	go producer(rdb)
	consumer(rdb)
}
