package axes

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
)

func httpget(url string) ([]byte, error) {
	rsp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	return ioutil.ReadAll(rsp.Body)
}

type targetRsp struct {
	Result []map[string]string `json:"result"`
	Reason string              `json:"reason"`
	Status string              `json:"status"`
}

type defaultRsp struct {
	Result map[string]string `json:"result"`
	Reason string            `json:"reason"`
	Status string            `json:"status"`
}

func getTargetList() ([]map[string]string, error) {
	rsp, err := httpget("http://127.0.0.1:5000/v1/target/load")
	if err != nil {
		return nil, fmt.Errorf("get target list error %v", err)
	}
	var data targetRsp
	err = json.Unmarshal(rsp, &data)
	if err != nil {
		return nil, fmt.Errorf("get target list error %v", err)
	}
	if data.Status != "ok" {
		return nil, fmt.Errorf("get target list error %v", data.Reason)
	}
	return data.Result, nil
	// targets := make([]map[string]string, 1)
	// targets[0] = map[string]string{
	// 	"target":  "demo",
	// 	"brokers": "192.168.87.80:30092",
	// 	"topic":   "demo",
	// }
	// return targets
}

func getDefaultTarget() (map[string]string, error) {
	rsp, err := httpget("http://127.0.0.1:5000/v1/default/get")
	if err != nil {
		return nil, fmt.Errorf("get default error %v", err)
	}
	var data defaultRsp
	err = json.Unmarshal(rsp, &data)
	if err != nil {
		return nil, fmt.Errorf("get default error %v", err)
	}
	if data.Status != "ok" {
		return nil, fmt.Errorf("get default error %v", data.Reason)
	}
	if data.Result == nil {
		return nil, fmt.Errorf("get default error %v", "no result")
	}
	if _, ok := data.Result["brokers"]; !ok {
		return nil, fmt.Errorf("get default error %v", "no brokers")
	}
	if _, ok := data.Result["topic"]; !ok {
		return nil, fmt.Errorf("get default error %v", "no topic")
	}
	if _, ok := data.Result["interval"]; !ok {
		return nil, fmt.Errorf("get default error %v", "no interval")
	}
	return data.Result, nil
	// target := map[string]string{
	// 	"brokers":  "192.168.87.80:30092",
	// 	"topic":    "fluentd",
	// 	"interval": "3",
	// }
	// return target
}
