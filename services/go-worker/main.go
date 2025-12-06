package main

import (
	"log"
	"time"

	consumer "github.com/willianOliveira-dev/desafio-gdash-2025/go-worker/consumer"
	mq "github.com/willianOliveira-dev/desafio-gdash-2025/go-worker/mq"
)

func main () {
	conn, channel := mq.ConnectRabbitMQ()
	
	defer conn.Close()
	defer channel.Close()

	consumer.WeatherConsumer(channel)

	for {
		time.Sleep(time.Second)
	}
	
}