package main

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/service/sqs"
)

const awsRegion = "us-east-1"
const queueUrl = "http://localhost:4566/000000000000/queue"

func producer(client *sqs.Client, queueUrl string) {
	for i := 0; i < 10; i++ {
		item := fmt.Sprintf("item %d", i)
		_, err := client.SendMessage(context.TODO(), &sqs.SendMessageInput{
			QueueUrl:    aws.String(queueUrl),
			MessageBody: aws.String(item),
		})
		if err != nil {
			log.Printf("Failed to send message: %v", err)
		} else {
			fmt.Println("Produced", item)
		}
		time.Sleep(1 * time.Second)
	}
	_, err := client.SendMessage(context.TODO(), &sqs.SendMessageInput{
		QueueUrl:    aws.String(queueUrl),
		MessageBody: aws.String("DONE"),
	})
	if err != nil {
		log.Printf("Failed to send message: %v", err)
	}
}

func consumer(client *sqs.Client, queueUrl string) {
	for {
		output, err := client.ReceiveMessage(context.TODO(), &sqs.ReceiveMessageInput{
			QueueUrl:            aws.String(queueUrl),
			MaxNumberOfMessages: 1,
			WaitTimeSeconds:     10,
		})
		if err != nil {
			log.Printf("Failed to receive messages: %v", err)
			time.Sleep(1 * time.Second)
			continue
		}

		for _, message := range output.Messages {
			fmt.Println("Consumed", *message.Body)
			_, err := client.DeleteMessage(context.TODO(), &sqs.DeleteMessageInput{
				QueueUrl:      aws.String(queueUrl),
				ReceiptHandle: message.ReceiptHandle,
			})
			if err != nil {
				log.Printf("Failed to delete message: %v", err)
			}
			if *message.Body == "DONE" {
				return
			}
			time.Sleep(2 * time.Second)
		}
	}
}

func main() {
	cfg, err := config.LoadDefaultConfig(context.TODO(), config.WithRegion(awsRegion), config.WithEndpointResolver(aws.EndpointResolverFunc(
		func(service, region string) (aws.Endpoint, error) {
			if service == sqs.ServiceID && region == awsRegion {
				return aws.Endpoint{
					PartitionID:   "aws",
					URL:           "http://localhost:4566",
					SigningRegion: awsRegion,
				}, nil
			}
			return aws.Endpoint{}, fmt.Errorf("unknown endpoint requested")
		},
	)))
	if err != nil {
		log.Fatalf("unable to load SDK config, %v", err)
	}

	client := sqs.NewFromConfig(cfg)
	if err != nil {
		log.Fatalf("unable to create queue, %v", err)
	}

	go producer(client, queueUrl)
	consumer(client, queueUrl)
}
