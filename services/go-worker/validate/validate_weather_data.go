package validate

import (
	"encoding/json"
	"errors"
	"fmt"
	"strings"

	contracts "github.com/willianOliveira-dev/desafio-gdash-2025/go-worker/contracts"
)

type weatherPayload struct {
	City        string   `json:"city"`
	Country     string   `json:"country"`
	Temperature *float64 `json:"temperature"`
	FeelsLike   *float64 `json:"feelsLike"`
	TempMin     *float64 `json:"tempMin"`
	TempMax     *float64 `json:"tempMax"`
	Humidity    *float64 `json:"humidity"`
	Pressure    *float64 `json:"pressure"`
	WindSpeed   *float64 `json:"windSpeed"`
	WindDeg     *float64 `json:"windDeg"`
	Clouds      *float64 `json:"clouds"`
	Condition   string   `json:"condition"`
	Sunrise     string   `json:"sunrise"`
	Sunset      string   `json:"sunset"`
	CurrentTime string   `json:"currentTime"`
}

func ValidateWeatherData(jsonData []byte) (*contracts.WeatherData, error) {
	var payload weatherPayload

	if err := json.Unmarshal(jsonData, &payload); err != nil {
		return nil, errors.New("JSON invalido ou tipos incorretos")
	}

	if strings.TrimSpace(payload.Country) == "" ||
		strings.TrimSpace(payload.City) == "" ||
		strings.TrimSpace(payload.Condition) == "" ||
		strings.TrimSpace(payload.Sunrise) == "" ||
		strings.TrimSpace(payload.Sunset) == "" ||
		strings.TrimSpace(payload.CurrentTime) == "" {
		return nil, errors.New("faltando campos textuais obrigatorios no JSON")
	}

	numericFields := map[string]*float64{
		"temperature": payload.Temperature,
		"feelsLike":   payload.FeelsLike,
		"tempMin":     payload.TempMin,
		"tempMax":     payload.TempMax,
		"humidity":    payload.Humidity,
		"pressure":    payload.Pressure,
		"windSpeed":   payload.WindSpeed,
		"windDeg":     payload.WindDeg,
		"clouds":      payload.Clouds,
	}
	for name, value := range numericFields {
		if value == nil {
			return nil, fmt.Errorf("campo numerico obrigatorio ausente: %s", name)
		}
	}

	if *payload.Humidity < 0 || *payload.Humidity > 100 {
		return nil, errors.New("humidity deve estar entre 0 e 100")
	}
	if *payload.Pressure <= 0 {
		return nil, errors.New("pressure deve ser maior que zero")
	}
	if *payload.WindSpeed < 0 {
		return nil, errors.New("windSpeed nao pode ser negativo")
	}
	if *payload.WindDeg < 0 || *payload.WindDeg > 360 {
		return nil, errors.New("windDeg deve estar entre 0 e 360")
	}
	if *payload.Clouds < 0 || *payload.Clouds > 100 {
		return nil, errors.New("clouds deve estar entre 0 e 100")
	}

	return &contracts.WeatherData{
		City:        payload.City,
		Country:     payload.Country,
		Temperature: *payload.Temperature,
		FeelsLike:   *payload.FeelsLike,
		TempMin:     *payload.TempMin,
		TempMax:     *payload.TempMax,
		Humidity:    *payload.Humidity,
		Pressure:    *payload.Pressure,
		WindSpeed:   *payload.WindSpeed,
		WindDeg:     *payload.WindDeg,
		Clouds:      *payload.Clouds,
		Condition:   payload.Condition,
		Sunrise:     payload.Sunrise,
		Sunset:      payload.Sunset,
		CurrentTime: payload.CurrentTime,
	}, nil
}
