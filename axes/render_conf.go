package axes

import (
	"bytes"
	"crypto/md5"
	"fmt"
	"io/ioutil"
	"log"
	"os"
	"text/template"
	"time"
)

var (
	tpl *template.Template
)

type renderContext struct {
	Targets []map[string]string
}

func filePath(name string) string {
	prefix := os.Getenv("FILEPATH")
	if prefix == "" {
		return fmt.Sprintf("/fluentd/etc/%s", name)
	}
	return fmt.Sprintf("%s/%s", prefix, name)
}

func getRenderContext() (renderContext, error) {
	var rc renderContext
	targets, err := getTargetList()
	if err != nil {
		return rc, err
	}
	//log.Printf("%v", targets)
	rc.Targets = make([]map[string]string, len(targets))
	for k, v := range targets {
		//log.Printf("%v", v)
		rc.Targets[k] = v
	}
	return rc, nil
}

func writeConf(txt string, filename string) error {
	return ioutil.WriteFile(filePath(filename), []byte(txt), os.FileMode(0644))
}

func GetConf() (string, []byte, error) {
	tpl = template.New("fluentd")
	content, err := ioutil.ReadFile(filePath("template.conf"))
	if err != nil {
		log.Printf("read template error %v", err)
		return "", nil, err
	}
	tpl, err = tpl.Parse(string(content))
	if err != nil {
		log.Printf("parse tpl error %v", err)
		return "", nil, err
	}
	var buf bytes.Buffer
	rc, err := getRenderContext()
	if err != nil {
		log.Printf("get render context error %v", err)
		return "", nil, err
	}
	err = tpl.Execute(&buf, rc)
	if err != nil {
		log.Printf("execute tpl error %v", err)
		return "", nil, err
	}
	err = writeConf(buf.String(), "run.conf")
	if err != nil {
		log.Printf("write run conf error %v", err)
		return "", nil, err
	}
	return filePath("run.conf"), buf.Bytes(), nil
}

func ConfigWatcher() chan int {
	ch := make(chan int)
	go func() {
		var pre string
		for {
			_, c, err := GetConf()
			if err != nil {
				log.Printf("config watcher error %v", err)
				time.Sleep(2 * time.Second)
			} else {
				pre = fmt.Sprintf("%x", md5.Sum(c))
				//log.Printf("%s", pre)
				break
			}
		}
		for {
			time.Sleep(10 * time.Second)
			_, c, err := GetConf()
			if err != nil {
				log.Printf("config wtcher error %v", err)
			} else {
				now := fmt.Sprintf("%x", md5.Sum(c))
				//log.Printf("%s", now)
				if now != pre {
					pre = now
					ch <- 1
				}
			}
		}
	}()
	return ch
}
