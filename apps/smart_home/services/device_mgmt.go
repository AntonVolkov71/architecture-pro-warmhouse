package services

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"

	"smarthome/models"
)

type DeviceMgmtClient struct {
	BaseURL string
	Client  *http.Client
}

func NewDeviceMgmtClient(baseURL string) *DeviceMgmtClient {
	return &DeviceMgmtClient{
		BaseURL: baseURL,
		Client:  &http.Client{Timeout: 5 * time.Second},
	}
}

// Получить все сенсоры
func (c *DeviceMgmtClient) GetSensors() ([]models.Sensor, error) {
	resp, err := c.Client.Get(fmt.Sprintf("%s/sensors", c.BaseURL))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var sensors []models.Sensor
	if err := json.NewDecoder(resp.Body).Decode(&sensors); err != nil {
		return nil, err
	}
	return sensors, nil
}

// Получить сенсор по ID
func (c *DeviceMgmtClient) GetSensorByID(id int) (*models.Sensor, error) {
	resp, err := c.Client.Get(fmt.Sprintf("%s/sensors/%d", c.BaseURL, id))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var sensor models.Sensor
	if err := json.NewDecoder(resp.Body).Decode(&sensor); err != nil {
		return nil, err
	}
	return &sensor, nil
}

// Создать сенсор
func (c *DeviceMgmtClient) CreateSensor(data models.SensorCreate) (*models.Sensor, error) {
	body, _ := json.Marshal(data)
	resp, err := c.Client.Post(fmt.Sprintf("%s/sensors", c.BaseURL), "application/json", bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var sensor models.Sensor
	if err := json.NewDecoder(resp.Body).Decode(&sensor); err != nil {
		return nil, err
	}
	return &sensor, nil
}

// Обновить сенсор
func (c *DeviceMgmtClient) UpdateSensor(id int, data models.SensorUpdate) (*models.Sensor, error) {
	body, _ := json.Marshal(data)
	req, err := http.NewRequest(http.MethodPut, fmt.Sprintf("%s/sensors/%d", c.BaseURL, id), bytes.NewBuffer(body))
	if err != nil {
		return nil, err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	var sensor models.Sensor
	if err := json.NewDecoder(resp.Body).Decode(&sensor); err != nil {
		return nil, err
	}
	return &sensor, nil
}

// Обновить значение сенсора
func (c *DeviceMgmtClient) UpdateSensorValue(id int, value float64, status string) error {
	bodyData := map[string]interface{}{
		"value":  value,
		"status": status,
	}
	body, _ := json.Marshal(bodyData)
	req, err := http.NewRequest(http.MethodPatch, fmt.Sprintf("%s/sensors/%d/value", c.BaseURL, id), bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.Client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("failed to update sensor value, status code: %d", resp.StatusCode)
	}
	return nil
}

// Удалить сенсор
func (c *DeviceMgmtClient) DeleteSensor(id int) error {
	req, err := http.NewRequest(http.MethodDelete, fmt.Sprintf("%s/sensors/%d", c.BaseURL, id), nil)
	if err != nil {
		return err
	}

	resp, err := c.Client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode >= 400 {
		return fmt.Errorf("failed to delete sensor, status code: %d", resp.StatusCode)
	}
	return nil
}

// Отправить команду сенсору
func (c *DeviceMgmtClient) SendCommand(id int, command string) error {
    bodyData := map[string]interface{}{
        "command": command,
    }
    body, _ := json.Marshal(bodyData)

    url := fmt.Sprintf("%s/sensors/%d/command", c.BaseURL, id)
    req, err := http.NewRequest(http.MethodPost, url, bytes.NewBuffer(body))
    if err != nil {
        return err
    }
    req.Header.Set("Content-Type", "application/json")

    resp, err := c.Client.Do(req)
    if err != nil {
        return err
    }
    defer resp.Body.Close()

    if resp.StatusCode >= 400 {
        return fmt.Errorf("failed to send command, status code: %d", resp.StatusCode)
    }
    return nil
}