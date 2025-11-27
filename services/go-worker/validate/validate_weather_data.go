package validate

import (
	json "encoding/json"
	"errors"

	contracts "github.com/willianOliveira-dev/desafio-gdash-2025/go-worker/contracts"
)

func ValidateWeatherData(jsonData []byte) (*contracts.WeatherData, error) {

	var data contracts.WeatherData

	if err := json.Unmarshal(jsonData, &data); err != nil {
		return nil, errors.New("JSON inválido ou tipos incorretos")
	}

	if data.Country == "" || 
		data.City == "" || 
		data.Clouds == 0 || 
		data.FeelsLike == 0 || 
		data.Humidity == 0 || 
		data.Pressure == 0 || 
		data.Sunrise == "" ||
		data.Sunset == "" || 
		data.TempMax == 0.0 || 
		data.TempMin == 0.0 || 
		data.Temperature == 0.0 || 
	    data.WindDeg == 0 || 
		data.WindSpeed == 0.0 {
		return nil, errors.New("faltando campos obrigatórios no JSON")
	}

	return &data, nil
}
