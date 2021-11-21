package main

import (
	"github.com/cwhuang29/questionnaire/config"
	"github.com/cwhuang29/questionnaire/databases"
	"github.com/cwhuang29/questionnaire/routers"
	"github.com/sirupsen/logrus"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

func init() {
	cobra.OnInitialize(initConfig)
}

func initConfig() {
	viper.SetConfigName("config")
	viper.SetConfigType("yaml")
	viper.AddConfigPath(".")
	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err != nil {
		logrus.Fatal(err)
	}
	logrus.Infof("Parsing config file: %s.", viper.ConfigFileUsed())
}

func setupConfig() {
	if err := config.Initial(viper.ConfigFileUsed()); err != nil {
		logrus.Fatal(err)
	}
}

func setupDatabase() {
	logrus.Infof("Setting database ...")
	if err := databases.Initial(); err != nil {
		logrus.Fatal(err)
	}
}

var rootCmd = &cobra.Command{
	Use:   "A questionnaire website",
	Short: "a-questionnaire-website",
	Long:  "A questionnaire website developed by Go.",
	Run: func(cmd *cobra.Command, args []string) {
		setupConfig()
		setupDatabase()
		routers.Router()
	},
}

func main() {
	if err := rootCmd.Execute(); err != nil {
		logrus.Fatal(err) // This will call os.Exit(255)
	}
}
