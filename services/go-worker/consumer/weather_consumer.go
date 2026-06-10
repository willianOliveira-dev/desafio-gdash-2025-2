package consumer

import (
	"bytes"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	amqp "github.com/rabbitmq/amqp091-go"
	config "github.com/willianOliveira-dev/desafio-gdash-2025/go-worker/config"
	validate "github.com/willianOliveira-dev/desafio-gdash-2025/go-worker/validate"
)

const (
	maxHTTPRetries = 3
	retryDelay     = 2 * time.Second
)

type deliveryError struct {
	err       error
	retryable bool
}

func (e *deliveryError) Error() string {
	return e.err.Error()
}

func sendRequest(
	client *http.Client,
	apiURL string,
	token string,
	body []byte,
) error {
	req, err := http.NewRequest(http.MethodPost, apiURL, bytes.NewReader(body))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Worker-Token", token)

	res, err := client.Do(req)
	if err != nil {
		return &deliveryError{err: err, retryable: true}
	}
	defer res.Body.Close()

	if res.StatusCode >= http.StatusOK &&
		res.StatusCode < http.StatusMultipleChoices {
		return nil
	}

	retryable := res.StatusCode == http.StatusRequestTimeout ||
		res.StatusCode == http.StatusTooManyRequests ||
		res.StatusCode >= http.StatusInternalServerError

	return &deliveryError{
		err:       fmt.Errorf("API retornou %s", res.Status),
		retryable: retryable,
	}
}

func processMessage(
	msg amqp.Delivery,
	client *http.Client,
	cfg config.Env,
) {
	data, err := validate.ValidateWeatherData(msg.Body)
	if err != nil {
		log.Printf("Mensagem invalida: %v", err)
		if nackErr := msg.Nack(false, false); nackErr != nil {
			log.Printf("Falha ao descartar mensagem invalida: %v", nackErr)
		}
		return
	}

	var sendErr error
	for attempt := 1; attempt <= maxHTTPRetries; attempt++ {
		sendErr = sendRequest(
			client,
			cfg.API_NEST_URL,
			cfg.WORKER_API_TOKEN,
			msg.Body,
		)
		if sendErr == nil {
			log.Printf("Mensagem enviada com sucesso: %+v", *data)
			if ackErr := msg.Ack(false); ackErr != nil {
				log.Printf("Falha ao confirmar mensagem: %v", ackErr)
			}
			return
		}

		var httpErr *deliveryError
		if errors.As(sendErr, &httpErr) && !httpErr.retryable {
			log.Printf("Falha permanente ao enviar mensagem: %v", sendErr)
			if nackErr := msg.Nack(false, false); nackErr != nil {
				log.Printf("Falha ao descartar mensagem: %v", nackErr)
			}
			return
		}

		log.Printf(
			"Falha HTTP na tentativa %d de %d: %v",
			attempt,
			maxHTTPRetries,
			sendErr,
		)
		if attempt < maxHTTPRetries {
			time.Sleep(retryDelay)
		}
	}

	log.Println("Tentativas esgotadas. Reenfileirando mensagem.")
	if nackErr := msg.Nack(false, true); nackErr != nil {
		log.Printf("Falha ao reenfileirar mensagem: %v", nackErr)
	}
}

func WeatherConsumer(channel *amqp.Channel, cfg config.Env) error {
	err := channel.ExchangeDeclare(
		cfg.RABBITMQ_EXCHANGE,
		"direct",
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("declarar exchange: %w", err)
	}

	queue, err := channel.QueueDeclare(
		cfg.RABBITMQ_QUEUE,
		true,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("declarar fila: %w", err)
	}

	err = channel.QueueBind(
		queue.Name,
		cfg.RABBITMQ_ROUTING_KEY,
		cfg.RABBITMQ_EXCHANGE,
		false,
		nil,
	)
	if err != nil {
		return fmt.Errorf("vincular fila a exchange: %w", err)
	}

	if err := channel.Qos(1, 0, false); err != nil {
		return fmt.Errorf("configurar prefetch: %w", err)
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
		return fmt.Errorf("consumir mensagens: %w", err)
	}

	log.Println("Worker Go escutando fila: ", queue.Name)

	client := &http.Client{Timeout: 10 * time.Second}
	for msg := range messages {
		processMessage(msg, client, cfg)
	}

	return errors.New("canal de consumo fechado")
}
