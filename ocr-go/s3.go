package main

import (
	"fmt"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

const (
	// Bucket holds the recipes
	Bucket = "com-platezero-recipes"
)

// ListRecipes lists a given users waiting recipes
func ListRecipes(id int) ([]*s3.Object, error) {
	sess, _ := session.NewSession(&aws.Config{
		Region: aws.String("us-east-1")},
	)
	var svc = s3.New(sess)
	input := &s3.ListObjectsInput{
		Bucket: aws.String(Bucket),
		Prefix: aws.String(fmt.Sprintf("%d/", id)),
	}
	result, err := svc.ListObjects(input)
	if err != nil {
		return nil, err
	}
	return result.Contents, nil
}

// Download a file
func Download(key, name string) (*os.File, error) {
	sess, _ := session.NewSession(&aws.Config{
		Region: aws.String("us-east-1")},
	)
	downloader := s3manager.NewDownloader(sess)
	file, err := os.Create(name)
	if err != nil {
		return nil, err
	}
	_, err = downloader.Download(file,
		&s3.GetObjectInput{
			Bucket: aws.String(Bucket),
			Key:    aws.String(key),
		})
	if err != nil {
		return nil, err
	}
	return file, nil
}
