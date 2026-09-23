provider "aws" {
  region = var.aws_region
}

resource "aws_security_group" "app_sg" {
  name        = "ci-cd-app-sg"
  description = "Allow ssh and app http"

  ingress {
    description = "ssh"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "app"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
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
  key_name               = var.key_name

  tags = {
    Name = "spacexp-app-${random_id.instance.hex}"
  }

  user_data = templatefile("${path.module}/user_data.sh.tpl", {
    docker_image = var.docker_image
  })
}

resource "random_id" "instance" {
  byte_length = 4
}

output "public_ip" {
  value = aws_instance.app.public_ip
}