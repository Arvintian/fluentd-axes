package main

import (
	"github.com/Arvintian/fluentd-axes/axes"
	"github.com/Arvintian/fluentd-axes/ui"
	"log"
	"os"
	"os/signal"
	"time"
)

func main() {
	ui.StartUIServer()
	err := axes.StartAPIServer()
	if err != nil {
		log.Fatalf("start apiserver error %v", err)
	}
	time.Sleep(3 * time.Second)
	config, _, err := axes.GetConf()
	if err != nil {
		log.Fatalf("get config error %v", err)
	}
	err = axes.StartFluentd(config)
	if err != nil {
		log.Fatalf("start fluentd error %v", err)
	}
	apiserverCh := axes.ApiserverWatcher()
	fluentdCh := axes.FluentdWatcher()
	configCh := axes.ConfigWatcher()
	signalCh := make(chan os.Signal, 1)
	signal.Notify(signalCh, os.Interrupt)
	for {
		select {
		case <-configCh:
			err := axes.ReloadFluentd()
			if err != nil {
				log.Printf("reload error %v", err)
			}
		case v := <-fluentdCh:
			<-apiserverCh
			os.Exit(v)
		case <-signalCh:
			axes.KillFluentd()
			axes.KillAPIServer()
			ui.KillUIServer()
			log.Printf("Interrupt signal exit.")
		}
	}
}
