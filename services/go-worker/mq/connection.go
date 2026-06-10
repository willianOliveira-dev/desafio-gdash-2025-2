package mq

import (
	"fmt"

	amqp "github.com/rabbitmq/amqp091-go"
)

func ConnectRabbitMQ(url string) (*amqp.Connection, *amqp.Channel, error) {
	connection, err := amqp.Dial(url)
	if err != nil {
		return nil, nil, fmt.Errorf("conectar ao RabbitMQ: %w", err)
	}

	channel, err := connection.Channel()
	if err != nil {
		connection.Close()
		return nil, nil, fmt.Errorf("abrir canal do RabbitMQ: %w", err)
	}

	return connection, channel, nil
}
