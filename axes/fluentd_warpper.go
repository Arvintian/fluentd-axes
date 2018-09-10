package axes

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"syscall"
	"time"
)

var (
	fluentd *exec.Cmd
)

func StartFluentd(config string) error {
	if fluentd != nil {
		return fmt.Errorf("fluentd already started")
	}
	log.Println("start fluentd")
	fluentd = exec.Command("fluentd", "-c", config)
	fluentd.Stderr = os.Stderr
	fluentd.Stdout = os.Stdout
	return fluentd.Start()
}

func shell(command string) string {
	cmd := exec.Command("/bin/sh", "-c", command)
	out, err := cmd.Output()
	if err != nil {
		fmt.Printf("error %v", err)
	}
	return string(out)
}

func KillFluentd() error {
	return fluentd.Process.Signal(syscall.SIGINT)
}

var loadCh = make(chan int, 1)

func ReloadFluentd() error {
	if fluentd == nil {
		return fmt.Errorf("fluentd have not started")
	}
	select {
	case loadCh <- 1:
		go func() {
			log.Printf("reload fluentd %v", fluentd.Process.Pid)
			command := fmt.Sprintf("pgrep -P %d", fluentd.Process.Pid)
			childID := shell(command)
			log.Printf("before reload childId : %s", childID)
			fluentd.Process.Signal(syscall.SIGHUP)
			time.Sleep(5 * time.Second)
			afterChildID := shell(command)
			log.Printf("after reload childId : %s", afterChildID)
			if childID == afterChildID {
				log.Printf("kill childId : %s", childID)
				shell("kill -9 " + childID)
			}
			<-loadCh
		}()
	default:
		return fmt.Errorf("fluentd is reloading")
	}
	return nil
}

func FluentdWatcher() chan int {
	ch := make(chan int)
	go func() {
		err := fluentd.Wait()
		if err != nil {
			log.Printf("fluentd daemon exit with error %v", err)
			ch <- 1
		} else {
			log.Printf("fluentd daemon exit")
			ch <- 0
		}
		close(ch)
	}()
	return ch
}
