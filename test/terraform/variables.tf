variable "aws_region" { default = "us-east-1" }
variable "ami_id" {}
variable "instance_type" { default = "t3.micro" }
variable "key_name" { default = "" }
variable "docker_image" { default = "your-dockerhub-username/spacexp-sample:latest" }