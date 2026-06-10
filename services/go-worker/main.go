package main

import (
	"log"
	"time"

	config "github.com/willianOliveira-dev/desafio-gdash-2025/go-worker/config"
	consumer "github.com/willianOliveira-dev/desafio-gdash-2025/go-worker/consumer"
	mq "github.com/willianOliveira-dev/desafio-gdash-2025/go-worker/mq"
)

const reconnectDelay = 5 * time.Second

func run(cfg config.Env) error {
	conn, channel, err := mq.ConnectRabbitMQ(cfg.RABBITMQ_URL)
	if err != nil {
		return err
	}

	defer conn.Close()
	defer channel.Close()

	log.Println("Conexao com RabbitMQ estabelecida.")
	return consumer.WeatherConsumer(channel, cfg)
}

func main() {
	cfg, err := config.Settings()
	if err != nil {
		log.Fatal(err)
	}

	for {
		if err := run(cfg); err != nil {
			log.Printf("Worker desconectado: %v", err)
		}

		log.Printf("Nova tentativa de conexao em %s.", reconnectDelay)
		time.Sleep(reconnectDelay)
	}
}
