provider "aws" {
  region = "eu-north-1"
}

resource "random_id" "instance" {
  byte_length = 4
}

resource "aws_security_group" "app_sg" {
  name        = "ci-cd-app-sg"
  description = "Allow restricted ssh and app http"

  ingress {
    description = "app"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "ssh"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "app" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  vpc_security_group_ids = [aws_security_group.app_sg.id]

  user_data = <<-EOT
    #!/bin/bash
    set -e
    apt-get update -y
    apt-get install -y docker.io
    systemctl start docker
    docker pull wasuaa/spacexp-sample:latest
    docker run -d --name myapp -p 8080:8080 --restart=always wasuaa/spacexp-sample:latest
  EOT

  tags = {
    Name = "ci-cd-app-${random_id.instance.hex}"
  }
}

output "public_ip" {
  value = aws_instance.app.public_ip
}
