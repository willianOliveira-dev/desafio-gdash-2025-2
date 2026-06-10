package config

import (
	"fmt"
	"os"
	"sort"
	"strings"
)

type Env struct {
	RABBITMQ_URL         string
	RABBITMQ_QUEUE       string
	RABBITMQ_EXCHANGE    string
	RABBITMQ_ROUTING_KEY string
	API_NEST_URL         string
	WORKER_API_TOKEN     string
}

func Settings() (Env, error) {
	cfg := Env{
		RABBITMQ_URL:         os.Getenv("RABBITMQ_URL"),
		RABBITMQ_QUEUE:       os.Getenv("RABBITMQ_QUEUE"),
		RABBITMQ_EXCHANGE:    os.Getenv("RABBITMQ_EXCHANGE"),
		RABBITMQ_ROUTING_KEY: os.Getenv("RABBITMQ_ROUTING_KEY"),
		API_NEST_URL:         os.Getenv("API_NEST_URL"),
		WORKER_API_TOKEN:     os.Getenv("WORKER_API_TOKEN"),
	}

	required := map[string]string{
		"RABBITMQ_URL":         cfg.RABBITMQ_URL,
		"RABBITMQ_QUEUE":       cfg.RABBITMQ_QUEUE,
		"RABBITMQ_EXCHANGE":    cfg.RABBITMQ_EXCHANGE,
		"RABBITMQ_ROUTING_KEY": cfg.RABBITMQ_ROUTING_KEY,
		"API_NEST_URL":         cfg.API_NEST_URL,
		"WORKER_API_TOKEN":     cfg.WORKER_API_TOKEN,
	}

	missing := make([]string, 0)
	for name, value := range required {
		if strings.TrimSpace(value) == "" {
			missing = append(missing, name)
		}
	}

	if len(missing) > 0 {
		sort.Strings(missing)
		return Env{}, fmt.Errorf(
			"variaveis de ambiente obrigatorias ausentes: %s",
			strings.Join(missing, ", "),
		)
	}

	return cfg, nil
}
