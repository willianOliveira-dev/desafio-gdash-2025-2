package contracts

type WeatherData struct {
	City        string  `json:"city"`
	Country     string  `json:"country"`
	Temperature float64 `json:"temperature"`
	FeelsLike   float64 `json:"feelsLike"`
	TempMin     float64 `json:"tempMin"`
	TempMax     float64 `json:"tempMax"`
	Humidity    float64 `json:"humidity"`
	Pressure    float64 `json:"pressure"`
	WindSpeed   float64 `json:"windSpeed"`
	WindDeg     float64 `json:"windDeg"`
	Clouds      float64 `json:"clouds"`
	Condition   string  `json:"condition"`
	Sunrise     string  `json:"sunrise"`
	Sunset      string  `json:"sunset"`
	CurrentTime string  `json:"currentTime"`
}
