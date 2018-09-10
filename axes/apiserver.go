package axes

import (
	"fmt"
	"log"
	"os"
	"os/exec"
	"syscall"
)

var (
	apiserver *exec.Cmd
)

func StartAPIServer() error {
	if apiserver != nil {
		return fmt.Errorf("apiserver already started")
	}
	log.Println("start apiserver")
	apiserver = exec.Command("gunicorn", "-w", "1", "-b", "0.0.0.0:5000", "--access-logfile", "-", "--error-logfile", "-", "--log-file", "-", "apiserver:app")
	apiserver.Stderr = os.Stderr
	apiserver.Stdout = os.Stdout
	return apiserver.Start()
}

func KillAPIServer() error {
	return apiserver.Process.Signal(syscall.SIGINT)
}

func ApiserverWatcher() chan int {
	ch := make(chan int)
	go func() {
		err := apiserver.Wait()
		if err != nil {
			log.Printf("apiserver daemon exit with error %v", err)
			ch <- 1
		} else {
			log.Printf("apiserver daemon exit")
			ch <- 0
		}
		close(ch)
	}()
	return ch
}
