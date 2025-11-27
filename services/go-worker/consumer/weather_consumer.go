package consumer

import (
	"bytes"
	"errors"
	amqp "github.com/rabbitmq/amqp091-go"
	config "github.com/willianOliveira-dev/desafio-gdash-2025/go-worker/config"
	validate "github.com/willianOliveira-dev/desafio-gdash-2025/go-worker/validate"
	"log"
	"net/http"
	"time"
)

func sendRequest(apiUrl string, body []byte) error {

	res, err := http.Post(apiUrl, "application/json", bytes.NewBuffer(body))

	if err != nil {
		return err
	}

	res.Body.Close()

	if res.StatusCode >= 400 {
		return errors.New("falha ao enviar requisição para API. API retornou: " + res.Status)
	}

	return nil

}

func WeatherConsumer(channel *amqp.Channel) {
	env := config.Settings()
	queueName := env.RABBITMQ_QUEUE
	exchange := env.RABBITMQ_EXCHANGE
	routingKey := env.RABBITMQ_ROUTING_KEY
	apiNestUrl := env.API_NEST_URL

	queue, err := channel.QueueDeclare(
		queueName,
		true,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		log.Fatalf("Error ao declarar fila: %v", err)
	}

	errorBindQueueToExchange := channel.QueueBind(
		queue.Name,
		routingKey,
		exchange,
		false,
		nil,
	)

	if errorBindQueueToExchange != nil {
		log.Fatalf("Error ao vincular fila a exchange: %v", errorBindQueueToExchange)
	}

	messages, err := channel.Consume(
		queue.Name,
		"",
		false,
		false,
		false,
		false,
		nil,
	)

	if err != nil {
		log.Fatalf("Error ao consumir mensagens: %v", err)
	}

	log.Println("Worker Go escutando fila: ", queue.Name)

	go func() {
		for msg := range messages {
			log.Println("Mensagem recebida:", string(msg.Body))
			data, err := validate.ValidateWeatherData(msg.Body)

			if err != nil {
				log.Println("Mensagem inválida: ", err)
				msg.Nack(false, false)
				continue
			}

			maxRetries := 3

			var sendError error

			for i := 1; i <= maxRetries; i++ {
				sendError = sendRequest(apiNestUrl, msg.Body)

				if sendError == nil {
					log.Println("Mensagem enviada com sucesso: ", *data)
					msg.Ack(false)
					break
				}

				log.Printf("Error tentativa (%d de %d): %v ", i, maxRetries, sendError)
				time.Sleep(2 * time.Second)

			}

			if sendError != nil {
				log.Println("Todas tentativas falharam. Reenfilerando mensagens.")
				msg.Nack(false, true)
			}

		}
	}()

}
